import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // create admin if not exists and a sample product
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: { email: 'admin@example.com', name: 'Admin', password: 'Password123!' }
    });

    const cat = await prisma.category.upsert({
      where: { slug: 'general' },
      update: {},
      create: { name: 'General', slug: 'general' }
    });

    const product = await prisma.product.upsert({
      where: { slug: 'sample-product' },
      update: {},
      create: {
        title: 'Sample Product',
        slug: 'sample-product',
        description: 'Seed product from API',
        price: 19.99,
        images: [],
        categoryId: cat.id,
        variants: { create: [{ sku: 'SAMPLE-API-001', price: 19.99, stock: 10 }] }
      }
    });

    res.status(200).json({ ok: true, adminId: admin.id, productId: product.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
