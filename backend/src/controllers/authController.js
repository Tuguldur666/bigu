import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'zangia_secret_key_2024'

export const registerSeeker = async (req, res) => {
  try {
    const { lastname, firstname, phone, email, password } = req.body

    if (!lastname || !firstname || !phone || !email || !password) {
      return res.status(400).json({ error: 'Бүх талбарыг бөглөнө үү' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] })
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Имэйл хаяг аль хэдийн бүртгэгдсэн байна' : 'Утасны дугаар аль хэдийн бүртгэгдсэн байна' 
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      lastname,
      firstname,
      phone,
      email,
      password: hashedPassword,
      type: 'seeker',
      profession: req.body.profession || null,
      experience: req.body.experience || null
    })

    await user.save()

    const token = jwt.sign({ id: user._id, type: user.type }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      message: 'Ажил хайгч бүртгэл амжилттай',
      token,
      user: { 
        id: user._id, 
        lastname: user.lastname, 
        firstname: user.firstname, 
        email: user.email, 
        type: user.type 
      }
    })
  } catch (error) {
    console.error('Register seeker error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}

export const registerEmployer = async (req, res) => {
  try {
    const { lastname, firstname, phone, email, password, companyName, sector, employees } = req.body

    if (!lastname || !firstname || !phone || !email || !password || !companyName) {
      return res.status(400).json({ error: 'Бүх талбарыг бөглөнө үү' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] })
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Имэйл хаяг аль хэдийн бүртгэгдсэн байна' : 'Утасны дугаар аль хэдийн бүртгэгдсэн байна' 
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      lastname,
      firstname,
      phone,
      email,
      password: hashedPassword,
      type: 'employer',
      companyName,
      sector: sector || null,
      employees: employees || null
    })

    await user.save()

    const token = jwt.sign({ id: user._id, type: user.type }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      message: 'Ажил олгогчийн бүртгэл амжилттай',
      token,
      user: { 
        id: user._id, 
        companyName: user.companyName, 
        email: user.email, 
        type: user.type 
      }
    })
  } catch (error) {
    console.error('Register employer error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}

export const login = async (req, res) => {
  try {
    const { emailOrPhone, password, type } = req.body

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Имэйл эсвэл утасны дугаар, нууц үг оруулна уу' })
    }

    const user = await User.findOne({ 
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] 
    })

    if (!user) {
      return res.status(400).json({ error: 'Хэрэглэгч олдсонгүй' })
    }

    if (type && user.type !== type) {
      return res.status(400).json({ 
        error: type === 'employer' ? 'Ажил олгогчоор нэвтрэх шаардлагатай' : 'Ажил хайгчаар нэвтрэх шаардлагатай' 
      })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(400).json({ error: 'Нууц үг буруу' })
    }

    const token = jwt.sign({ id: user._id, type: user.type }, JWT_SECRET, { expiresIn: '7d' })

    const userInfo = user.type === 'employer'
      ? { id: user._id, companyName: user.companyName, email: user.email, type: user.type }
      : { id: user._id, lastname: user.lastname, firstname: user.firstname, email: user.email, type: user.type }

    res.json({
      message: 'Амжилттай нэвтэрлэ',
      token,
      user: userInfo
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Серверийн алдаа' })
  }
}

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Токен оруулна уу' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ error: 'Хэрэглэгч олдсонгүй' })
    }

    const userInfo = user.type === 'employer'
      ? { 
          id: user._id, 
          companyName: user.companyName, 
          email: user.email, 
          type: user.type, 
          sector: user.sector, 
          employees: user.employees,
          phone: user.phone,
          lastname: user.lastname,
          firstname: user.firstname
        }
      : { 
          id: user._id, 
          lastname: user.lastname, 
          firstname: user.firstname, 
          email: user.email, 
          type: user.type, 
          profession: user.profession, 
          experience: user.experience,
          phone: user.phone
        }

    res.json({ user: userInfo })
  } catch (error) {
    res.status(401).json({ error: 'Хүчинтэй токен биш' })
  }
}