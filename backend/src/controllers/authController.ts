import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.json({ id: req.admin.id, username: req.admin.username });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createDefaultAdmin = async () => {
  const existing = await prisma.admin.findFirst();
  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    console.log('Default admin created: admin / admin123');
  }
};
