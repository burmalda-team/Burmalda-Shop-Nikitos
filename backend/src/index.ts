import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import uploadRoutes from './routes/upload';
import { errorHandler } from './middleware/errorHandler';
import { createDefaultAdmin } from './controllers/authController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

app.use(cors());
app.use(express.json());
app.use(`/${UPLOAD_DIR}`, express.static(path.resolve(UPLOAD_DIR)));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

createDefaultAdmin().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
