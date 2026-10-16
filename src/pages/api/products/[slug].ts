import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  try {
    const product = await prisma.product.findUnique({
      where: { slug: String(slug) },
      include: { variants: true, category: true }
    });
    if (!product) return res.status(404).json({ ok: false, error: 'Not found' });
    res.status(200).json({ ok: true, product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
