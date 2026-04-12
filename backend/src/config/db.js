import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://apoxmn:3Y%40QPVHKtFqp9e6@cluster0.qizgffq.mongodb.net/bigu?retryWrites=true&w=majority'

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}

export default mongoose