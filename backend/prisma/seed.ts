import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.admin.findFirst();
  if (!adminExists) {
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
      },
    });
    console.log('Created default admin: admin / admin123');
  }

  const categories = [
    { name: 'Кроссовки', slug: 'sneakers', image: '/uploads/cat-sneakers.jpg' },
    { name: 'Ботинки', slug: 'boots', image: '/uploads/cat-boots.jpg' },
    { name: 'Футболки', slug: 'tshirts', image: '/uploads/cat-tshirts.jpg' },
    { name: 'Куртки', slug: 'jackets', image: '/uploads/cat-jackets.jpg' },
    { name: 'Джинсы', slug: 'jeans', image: '/uploads/cat-jeans.jpg' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const cats = await prisma.category.findMany();
  const catMap = new Map(cats.map((c) => [c.slug, c.id]));

  const products = [
    {
      name: 'Nike Air Force 1',
      slug: 'nike-air-force-1',
      description: 'Классические кроссовки Nike Air Force 1. Легендарный дизайн и непревзойденный комфорт.',
      price: 12990,
      oldPrice: 15990,
      images: ['/uploads/placeholder-shoe-1.jpg'],
      sizes: ['40', '41', '42', '43', '44', '45'],
      colors: ['Белый', 'Черный'],
      categoryId: catMap.get('sneakers')!,
      isNew: true,
      isBestseller: true,
    },
    {
      name: 'Adidas Ultraboost 22',
      slug: 'adidas-ultraboost-22',
      description: 'Беговые кроссовки с технологией Boost для максимальной амортизации.',
      price: 15490,
      images: ['/uploads/placeholder-shoe-2.jpg'],
      sizes: ['40', '41', '42', '43', '44'],
      colors: ['Черный', 'Серый'],
      categoryId: catMap.get('sneakers')!,
      isNew: true,
      isBestseller: false,
    },
    {
      name: 'Dr. Martens 1460',
      slug: 'dr-martens-1460',
      description: 'Культовые ботинки Dr. Martens 1460 с 8 люверсами.',
      price: 18990,
      oldPrice: 21990,
      images: ['/uploads/placeholder-boot-1.jpg'],
      sizes: ['39', '40', '41', '42', '43', '44', '45'],
      colors: ['Черный', 'Коричневый'],
      categoryId: catMap.get('boots')!,
      isNew: false,
      isBestseller: true,
    },
    {
      name: 'Timberland Premium',
      slug: 'timberland-premium',
      description: 'Водонепроницаемые ботинки Timberland Premium 6 Inch.',
      price: 22990,
      images: ['/uploads/placeholder-boot-2.jpg'],
      sizes: ['40', '41', '42', '43', '44', '45'],
      colors: ['Песочный', 'Черный'],
      categoryId: catMap.get('boots')!,
      isNew: false,
      isBestseller: true,
    },
    {
      name: 'Supreme Box Logo Tee',
      slug: 'supreme-box-logo-tee',
      description: 'Культовая футболка с бокс-логотипом Supreme.',
      price: 8990,
      images: ['/uploads/placeholder-tshirt-1.jpg'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Белый', 'Черный', 'Красный'],
      categoryId: catMap.get('tshirts')!,
      isNew: true,
      isBestseller: false,
    },
    {
      name: 'The North Face Puffer',
      slug: 'the-north-face-puffer',
      description: 'Теплый пуховик The North Face для холодной погоды.',
      price: 34990,
      oldPrice: 39990,
      images: ['/uploads/placeholder-jacket-1.jpg'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Черный', 'Оливковый'],
      categoryId: catMap.get('jackets')!,
      isNew: false,
      isBestseller: true,
    },
    {
      name: 'Levis 501 Original',
      slug: 'levis-501-original',
      description: 'Классические джинсы Levis 501 с прямым кроем.',
      price: 9990,
      images: ['/uploads/placeholder-jeans-1.jpg'],
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Синий', 'Черный', 'Светло-синий'],
      categoryId: catMap.get('jeans')!,
      isNew: false,
      isBestseller: true,
    },
    {
      name: 'New Balance 550',
      slug: 'new-balance-550',
      description: 'Ретро-кроссовки New Balance 550 в винтажном стиле.',
      price: 13990,
      images: ['/uploads/placeholder-shoe-3.jpg'],
      sizes: ['40', '41', '42', '43', '44', '45'],
      colors: ['Белый/Зеленый', 'Белый/Синий'],
      categoryId: catMap.get('sneakers')!,
      isNew: true,
      isBestseller: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product as any,
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
