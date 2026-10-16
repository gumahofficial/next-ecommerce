import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { items } = req.body as { items: { productId: string; quantity: number }[] };
    if (!items || items.length === 0) return res.status(400).json({ error: 'No items' });

    // fetch products and build line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const it of items) {
      const product = await prisma.product.findUnique({ where: { id: it.productId } });
      if (!product) return res.status(400).json({ error: 'Invalid product' });
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: { name: product.title, description: product.description || undefined },
          unit_amount: Math.round(product.price * 100)
        },
        quantity: it.quantity
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
