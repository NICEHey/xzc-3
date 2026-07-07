import { Router } from 'express'
import {
  registerDeliveryStaff,
  getDeliveryStaffList,
  getDeliveryStaff,
  updateDeliveryStaff,
  deleteDeliveryStaff,
  assignDelivery,
  getDeliveryTraces,
  updateDeliveryPosition
} from '../controllers/deliveryController'

const router = Router()

router.post('/staff', registerDeliveryStaff)
router.get('/staff', getDeliveryStaffList)
router.get('/staff/:id', getDeliveryStaff)
router.put('/staff/:id', updateDeliveryStaff)
router.delete('/staff/:id', deleteDeliveryStaff)

router.post('/assign/:orderId', assignDelivery)
router.get('/traces/:orderId', getDeliveryTraces)
router.post('/position/:orderId', updateDeliveryPosition)

export default router