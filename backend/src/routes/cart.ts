import { Router } from 'express'
import {
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
  getCart,
  getCartCount
} from '../controllers/cartController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/', authMiddleware, addCartItem)
router.get('/', authMiddleware, getCart)
router.get('/count', authMiddleware, getCartCount)
router.put('/:id', authMiddleware, updateCartItem)
router.delete('/:id', authMiddleware, deleteCartItem)
router.delete('/', authMiddleware, clearCart)

export default router