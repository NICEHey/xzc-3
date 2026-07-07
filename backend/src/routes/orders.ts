import { Router } from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  getOrderByNo,
  payOrder,
  cancelOrder,
  refundOrder,
  deliverOrder,
  completeOrder,
  createEvaluation,
  getEvaluations
} from '../controllers/orderController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/', authMiddleware, createOrder)
router.get('/', authMiddleware, getOrders)
router.get('/:id', authMiddleware, getOrder)
router.get('/no/:orderNo', authMiddleware, getOrderByNo)

router.post('/pay', payOrder)
router.post('/cancel/:orderNo', authMiddleware, cancelOrder)
router.post('/refund/:orderNo', refundOrder)
router.post('/deliver/:orderNo', deliverOrder)
router.post('/complete/:orderNo', completeOrder)

router.post('/evaluations', authMiddleware, createEvaluation)
router.get('/evaluations', getEvaluations)

export default router