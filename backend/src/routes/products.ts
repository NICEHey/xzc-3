import { Router } from 'express'
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  uploadProductImage,
  deleteProduct,
  getStockAlert
} from '../controllers/productController'
import { upload } from '../middleware/multer'

const router = Router()

router.post('/categories', createCategory)
router.get('/categories', getCategories)
router.get('/categories/:id', getCategory)
router.put('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)

router.post('/', createProduct)
router.get('/', getProducts)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)
router.post('/:id/image', upload.single('image'), uploadProductImage)
router.delete('/:id', deleteProduct)

router.get('/stock/alert', getStockAlert)

export default router