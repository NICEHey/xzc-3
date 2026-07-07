import express from 'express'
import cors from 'cors'
import path from 'path'
import 'dotenv/config'
import prisma from './utils/prisma'
import { errorMiddleware } from './middleware/error'

import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'
import deliveryRoutes from './routes/delivery'
import statsRoutes from './routes/stats'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/delivery', deliveryRoutes)
app.use('/api/stats', statsRoutes)

app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: 'OK', data: { timestamp: new Date().toISOString() } })
})

app.use(errorMiddleware)

async function main() {
  try {
    await prisma.$connect()
    console.log('数据库连接成功')

    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('服务器启动失败:', err)
    process.exit(1)
  }
}

main()