import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
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
router.put('/addresses/:id', authMiddleware, updateAddress)
router.delete('/addresses/:id', authMiddleware, deleteAddress)

router.get('/points/logs', authMiddleware, getPointLogs)

export default router