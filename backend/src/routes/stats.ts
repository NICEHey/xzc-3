import { Router } from 'express'
import {
  getDashboard,
  getOrderStats,
  getUserStats,
  getProductSalesTop,
  getDeliveryStats
} from '../controllers/statsController'

const router = Router()

router.get('/dashboard', getDashboard)
router.get('/orders', getOrderStats)
router.get('/users', getUserStats)
router.get('/products/sales', getProductSalesTop)
router.get('/delivery', getDeliveryStats)

export default router