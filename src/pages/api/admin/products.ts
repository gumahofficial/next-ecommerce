import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    // list products
    const products = await prisma.product.findMany({ include: { variants: true, category: true } });
    return res.status(200).json({ ok: true, products });
  }

  if (req.method === 'POST') {
    const { title, slug, description, price, images, categoryId } = req.body;
    if (!title || !slug || !price) return res.status(400).json({ error: 'Missing fields' });
    const product = await prisma.product.create({ data: { title, slug, description, price: parseFloat(price), images: images || [], categoryId } });
    return res.status(201).json({ ok: true, product });
  }

  return res.status(405).end();
}
