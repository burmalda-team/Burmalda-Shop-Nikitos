import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', authMiddleware, upload.array('images', 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  const urls = files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
});

export default router;
