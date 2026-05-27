import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getBestsellers,
  getNewArrivals,
} from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/bestsellers', getBestsellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authMiddleware, upload.array('images', 10), createProduct);
router.put('/:id', authMiddleware, upload.array('images', 10), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
