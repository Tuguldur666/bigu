import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'zangia_secret_key_2024'

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'Токен оруулна уу' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Хүчинтэй токен биш' })
  }
}