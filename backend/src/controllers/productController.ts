import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '12',
    } = req.query;

    const where: any = {};

    if (category) {
      where.category = { slug: category as string };
    }

    if (search) {
      where.name = { contains: search as string, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sort as string]: order },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      products,
      total,
      pages: Math.ceil(total / Number(limit)),
      page: Number(page),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      sizes,
      colors,
      categoryId,
      inStock,
      isNew,
      isBestseller,
    } = req.body;

    const images = req.files
      ? (req.files as Express.Multer.File[]).map((f) => `/uploads/${f.filename}`)
      : [];

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        images,
        sizes: sizes ? JSON.parse(sizes) : [],
        colors: colors ? JSON.parse(colors) : [],
        categoryId,
        inStock: inStock === 'true' || inStock === true,
        isNew: isNew === 'true' || isNew === true,
        isBestseller: isBestseller === 'true' || isBestseller === true,
      },
      include: { category: true },
    });

    return res.status(201).json(product);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Product slug already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      sizes,
      colors,
      categoryId,
      inStock,
      isNew,
      isBestseller,
      existingImages,
    } = req.body;

    let images = existingImages
      ? JSON.parse(existingImages)
      : existing.images;

    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const newImages = (req.files as Express.Multer.File[]).map(
        (f) => `/uploads/${f.filename}`
      );
      images = [...images, ...newImages];
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        description: description ?? existing.description,
        price: price ? Number(price) : existing.price,
        oldPrice: oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : existing.oldPrice,
        images,
        sizes: sizes ? JSON.parse(sizes) : existing.sizes,
        colors: colors ? JSON.parse(colors) : existing.colors,
        categoryId: categoryId ?? existing.categoryId,
        inStock: inStock !== undefined ? (inStock === 'true' || inStock === true) : existing.inStock,
        isNew: isNew !== undefined ? (isNew === 'true' || isNew === true) : existing.isNew,
        isBestseller: isBestseller !== undefined ? (isBestseller === 'true' || isBestseller === true) : existing.isBestseller,
      },
      include: { category: true },
    });

    return res.json(product);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Product slug already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    return res.json({ message: 'Product deleted' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getBestsellers = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isBestseller: true },
      include: { category: true },
      take: 8,
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getNewArrivals = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { isNew: true },
      include: { category: true },
      take: 8,
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
