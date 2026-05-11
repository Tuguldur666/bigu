import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'
import path from 'path'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://apoxmn:3Y%40QPVHKtFqp9e6@cluster0.qizgffq.mongodb.net/bigu?retryWrites=true&w=majority'

const employerSchema = new mongoose.Schema({
  lastname: String,
  firstname: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  type: String,
  companyName: String,
  sector: String,
  employees: String,
  description: String,
  website: String,
  createdAt: { type: Date, default: Date.now }
})

const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  type: String,
  sector: String,
  location: String,
  deadline: String,
  salFrom: Number,
  salTo: Number,
  description: String,
  benefits: String,
  workHours: String,
  workDays: String,
  workEnvironment: String,
  education: String,
  experience: String,
  gender: String,
  ageRange: String,
  skills: [String],
  contactEmail: String,
  contactPhone: String,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', employerSchema)
const Job = mongoose.model('Job', jobSchema)

const companies = [
  {
    companyName: 'Голомт Банк',
    emailPrefix: 'golomtbank',
    sector: 'Санхүү / Нягтлан',
    employees: '1000+',
    description: 'Монголын тэргүүлэх банк. 1995 онд байгуулагдсан.',
    website: 'https://golomtbank.com',
    jobs: [
      {
        title: 'Зээлийн мэргэжилтэн',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-06-30',
        salFrom: 3000000,
        salTo: 5000000,
        description: 'Банкны зээлийн үйл ажиллагаа хариуцан ажиллах, үйлчлүүлэгчдэд зээлийн зөвлөгөө өгөх, зээлийн хүсэлт хүлээн авч боловсруулах',
        benefits: 'Эрүүл мэндийн даатгал, урамшуулал, сургалт',
        contactEmail: 'hr@golomtbank.com',
        contactPhone: '77771111',
        skills: ['Санхүү', 'Аналитик', 'Excel', 'Харилцааны ур чадвар']
      },
      {
        title: 'IT аудитор',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-07-15',
        salFrom: 4000000,
        salTo: 6000000,
        description: 'Мэдээллийн системийн аудит хийх, дотоод хяналтын үнэлгээ хийх, IT эрсдэлийн үнэлгээ',
        benefits: 'Даатгал, сургалтын төлбөр, уян хатан цаг',
        contactEmail: 'hr@golomtbank.com',
        contactPhone: '77771111',
        skills: ['IT аудит', 'Эрсдэлийн менежмент', 'SQL', 'Python']
      }
    ]
  },
  {
    companyName: 'MCS Холдинг',
    emailPrefix: 'mcsholding',
    sector: 'Бусад',
    employees: '500+',
    description: 'Монголын томоохон холдинг компани. Хүнс, үйлдвэрлэл, худалдаа, үйлчилгээний чиглэлээр үйл ажиллагаа явуулдаг.',
    website: 'https://mcs.mn',
    jobs: [
      {
        title: 'Маркетингийн менежер',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-06-20',
        salFrom: 3500000,
        salTo: 5000000,
        description: 'Брэндийн стратеги боловсруулах, маркетингийн кампанит ажил зохион байгуулах, сурталчилгааны материалыг удирдах',
        benefits: 'Эрүүл мэндийн даатгал, гадаад сургалт, урамшуулал',
        contactEmail: 'hr@mcs.mn',
        contactPhone: '70001111',
        skills: ['Маркетинг', 'SMM', 'Брэндинг', 'Аналитик']
      }
    ]
  },
  {
    companyName: 'Монголын Хүнс Их Дэлгүүр',
    emailPrefix: 'mongolhunsdelguur',
    sector: 'Эрхлэх',
    employees: '200+',
    description: 'Хүнсний жижиглэн худалдааны сүлжээ дэлгүүр. Нийслэл хотод 20+ салбартай.',
    website: 'https://khiderguur.mn',
    jobs: [
      {
        title: 'Дэлгүүрийн менежер',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-07-01',
        salFrom: 2500000,
        salTo: 3500000,
        description: 'Дэлгүүрийн үйл ажиллагааг бүрэн удирдах, борлуулалтыг нэмэгдүүлэх, ажилтнуудыг удирдах',
        benefits: 'Хоол, урамшуулал, эрүүл мэндийн даатгал',
        contactEmail: 'hr@khiderguur.mn',
        contactPhone: '70112233',
        skills: ['Борлуулалт', 'Удирдах', 'Харилцагчийн үйлчилгээ']
      },
      {
        title: 'Нябоо',
        type: 'Цагийн',
        location: 'Улаанбаатар',
        deadline: '2026-12-31',
        salFrom: 1500000,
        salTo: 1800000,
        description: 'Бараа бүтээгдэхүүний нягтлан бодох, тооллого хийх, агуулахын бүртгэл хөтлөх',
        benefits: 'Цагийн цалин, урамшуулал',
        contactEmail: 'hr@khiderguur.mn',
        contactPhone: '70112233',
        skills: ['Агуулах', 'Тооллого', 'Бүртгэл']
      }
    ]
  },
  {
    companyName: 'Монголын Инженерийн Холбоо',
    emailPrefix: 'mongolinjeneriinholboo',
    sector: 'Инженер',
    employees: '50+',
    description: 'Монголын инженерүүдийн мэргэжлийн байгууллага. Барилга, дэд бүтэц, эрчим хүчний чиглэлээр үйл ажиллагаа явуулдаг.',
    website: 'https://mie.mn',
    jobs: [
      {
        title: 'Инженер-зураач',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-06-25',
        salFrom: 2800000,
        salTo: 4000000,
        description: 'Барилгын зураг төсөл боловсруулах, AutoCAD дээр ажиллах, зураг төслийн баримт бичиг бэлтгэх',
        benefits: 'Мэргэжлийн сургалт, даатгал, уян хатан ажлын цаг',
        contactEmail: 'hr@mie.mn',
        contactPhone: '75001111',
        skills: ['AutoCAD', 'Барилгын зураг', 'Revit', 'Техникийн бичиг']
      }
    ]
  },
  {
    companyName: 'Ард Холдинг',
    emailPrefix: 'ardholding',
    sector: 'Санхүү / Нягтлан',
    employees: '300+',
    description: 'Санхүү, даатгал, хөрөнгө оруулалтын чиглэлээр үйл ажиллагаа явуулдаг холдинг компани.',
    website: 'https://ardholding.mn',
    jobs: [
      {
        title: 'Даатгалын төлөөлөгч',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-08-01',
        salFrom: 2000000,
        salTo: 6000000,
        description: 'Даатгалын бүтээгдэхүүн худалдах, үйлчлүүлэгчдэд зөвлөгөө өгөх, даатгалын гэрээ байгуулах',
        benefits: 'Комисс, урамшуулал, сургалт, эрүүл мэндийн даатгал',
        contactEmail: 'hr@ardholding.mn',
        contactPhone: '11223344',
        skills: ['Борлуулалт', 'Харилцах', 'Санхүүгийн мэдлэг']
      },
      {
        title: 'Санхүүгийн шинжээч',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-07-20',
        salFrom: 3500000,
        salTo: 5000000,
        description: 'Санхүүгийн тайлан шинжлэх, хөрөнгө оруулалтын шийдвэр гаргахад дэмжлэг үзүүлэх, эрсдэлийн үнэлгээ хийх',
        benefits: 'Урамшуулал, даатгал, уян хатан цаг',
        contactEmail: 'hr@ardholding.mn',
        contactPhone: '11223344',
        skills: ['Санхүүгийн шинжилгээ', 'Excel', 'Эрсдэлийн үнэлгээ', 'CPA']
      }
    ]
  },
  {
    companyName: 'Шунклай Групп',
    emailPrefix: 'shunkhlaigroup',
    sector: 'Эрхлэх',
    employees: '800+',
    description: 'Монголын томоохон жижиглэн худалдааны сүлжээ. Хүнс, барилга, электроник зэрэг олон чиглэлээр үйл ажиллагаа явуулдаг.',
    website: 'https://shunkhlai.mn',
    jobs: [
      {
        title: 'Борлуулалтын зохицуулагч',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-06-15',
        salFrom: 1800000,
        salTo: 2500000,
        description: 'Борлуулалтын үйл ажиллагааг зохицуулах, агуулахын бүртгэл хөтлөх, худалдан авалтыг төлөвлөх',
        benefits: 'Хоол, урамшуулал, даатгал',
        contactEmail: 'hr@shunkhlai.mn',
        contactPhone: '11998877',
        skills: ['Борлуулалт', 'Агуулах', 'Excel', 'Зохион байгуулалт']
      }
    ]
  },
  {
    companyName: 'Технологийн Дэвшил',
    emailPrefix: 'tehnologiindevshil',
    sector: 'IT / Технологи',
    employees: '100+',
    description: 'Програм хангамж, вэб хөгжүүлэлт, IT зөвлөх үйлчилгээ эрхэлдэг Монголын тэргүүлэх технологийн компани.',
    website: 'https://techdev.mn',
    jobs: [
      {
        title: 'Senior React Developer',
        type: 'Бүтэн цаг',
        location: 'Улаанбаатар',
        deadline: '2026-07-10',
        salFrom: 5000000,
        salTo: 8000000,
        description: 'React.js ашиглан вэб аппликейшн хөгжүүлэх, фронтенд архитектур төлөвлөх, баг удирдах',
        benefits: 'Гадаад сургалт, MacBook, эрүүл мэндийн даатгал, уян хатан цаг',
        contactEmail: 'hr@techdev.mn',
        contactPhone: '99008877',
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'Git']
      },
      {
        title: 'Backend Developer (Node.js)',
        type: 'Бүтэн цаг',
        location: 'Зайнаас',
        deadline: '2026-07-15',
        salFrom: 4000000,
        salTo: 6500000,
        description: 'Node.js/Express.js ашиглан REST API хөгжүүлэх, MongoDB загварчлал, хэрэглэгчийн баталгаажуулалт',
        benefits: 'Зайнаас ажиллах, сургалт, урамшуулал',
        contactEmail: 'hr@techdev.mn',
        contactPhone: '99008877',
        skills: ['Node.js', 'Express', 'MongoDB', 'JWT', 'API Design']
      },
      {
        title: 'Дадлагажигч програмист',
        type: 'Дадлага',
        location: 'Улаанбаатар',
        deadline: '2026-06-30',
        salFrom: 800000,
        salTo: 1200000,
        description: 'Вэб хөгжүүлэлтийн багтай хамтран ажиллах, React болон Node.js суурь мэдлэгтэй байх',
        benefits: 'Мэргэжлийн сургалт, зөвлөгч, үдийн хоол',
        contactEmail: 'hr@techdev.mn',
        contactPhone: '99008877',
        skills: ['React', 'JavaScript', 'HTML/CSS', 'Git-ийн суурь']
      }
    ]
  }
]

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected')

    for (const company of companies) {
      const emailPrefix = company.emailPrefix
      const email = emailPrefix + '@example.com'
      const password = '123456'
      const hashedPassword = await bcrypt.hash(password, 10)

      // Delete existing employer and jobs for this company
      const existing = await User.findOne({ email })
      if (existing) {
        await Job.deleteMany({ employerId: existing._id })
        await User.deleteOne({ _id: existing._id })
        console.log(`Removed existing: ${company.companyName}`)
      }

      const employer = await User.create({
        lastname: company.companyName.split(' ')[0],
        firstname: 'Админ',
        phone: '9911' + Math.floor(1000 + Math.random() * 9000),
        email,
        password: hashedPassword,
        type: 'employer',
        companyName: company.companyName,
        sector: company.sector,
        employees: company.employees,
        description: company.description,
        website: company.website
      })

      console.log(`Created: ${company.companyName} (${email})`)

      for (const jobData of company.jobs) {
        await Job.create({
          employerId: employer._id,
          title: jobData.title,
          type: jobData.type,
          sector: company.sector,
          location: jobData.location,
          deadline: jobData.deadline,
          salFrom: jobData.salFrom,
          salTo: jobData.salTo,
          description: jobData.description,
          benefits: jobData.benefits || '',
          workHours: '09:00–18:00',
          workDays: '5 өдөр',
          workEnvironment: 'Оффис',
          education: 'Хамаарахгүй',
          experience: 'Шаардахгүй',
          gender: 'Хамаарахгүй',
          ageRange: '18-60',
          skills: jobData.skills || [],
          contactEmail: jobData.contactEmail,
          contactPhone: jobData.contactPhone || '',
          status: 'active'
        })
        console.log(`  -> Job: ${jobData.title}`)
      }
    }

    console.log('\nDone! Employers created:')
    for (const c of companies) {
      console.log(`  ${c.companyName} → ${c.emailPrefix}@example.com / 123456`)
    }

    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seed()
