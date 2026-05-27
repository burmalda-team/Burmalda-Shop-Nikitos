import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, image } = req.body;
    const category = await prisma.category.create({
      data: { name, slug, image },
    });
    return res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Category already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, image } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, image },
    });
    return res.json(category);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    return res.json({ message: 'Category deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'Category has products' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};
