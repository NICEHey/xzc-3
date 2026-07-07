import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  addAddress,
  getAddresses,
  getDefaultAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getPointLogs
} from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'
import { upload } from '../middleware/multer'

const router = Router()

router.get('/profile', authMiddleware, getProfile)
router.put('/profile', authMiddleware, updateProfile)
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar)

router.post('/addresses', authMiddleware, addAddress)
router.get('/addresses', authMiddleware, getAddresses)
router.get('/addresses/default', authMiddleware, getDefaultAddress)
router.put('/addresses/:id', authMiddleware, updateAddress)
router.delete('/addresses/:id', authMiddleware, deleteAddress)
router.put('/addresses/:id/default', authMiddleware, setDefaultAddress)

router.get('/points/logs', authMiddleware, getPointLogs)

export default router