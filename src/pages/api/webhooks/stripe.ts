import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const sig = req.headers['stripe-signature'] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  try {
    const buf = await buffer(req as any);
    const raw = buf.toString();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(raw, sig || '', webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      // create an Order in DB using metadata if present
      try {
        const line_items = await stripe.checkout.sessions.listLineItems(session.id as string);
        // Build order items
        // For simplicity we store minimal data
        const userEmail = session.customer_details?.email || null;
        // Find or create user
        let user = null;
        if (userEmail) {
          user = await prisma.user.findUnique({ where: { email: userEmail } });
          if (!user) user = await prisma.user.create({ data: { email: userEmail, password: 'oauth', name: session.customer_details?.name || undefined } });
        }
        const order = await prisma.order.create({ data: { userId: user ? user.id : '', status: 'paid', total: (session.amount_total || 0) / 100, shipping: session.customer_details ? { name: session.customer_details.name, address: session.customer_details.address } : undefined } });
        // items
        for (const li of line_items.data) {
          const name = li.description || li.price?.product?.toString() || li.price?.id || 'item';
          const unit_amount = (li.price?.unit_amount || 0) / 100;
          await prisma.orderItem.create({ data: { orderId: order.id, productVariantId: '', quantity: li.quantity || 1, unitPrice: unit_amount } });
        }
      } catch (err) {
        console.error('Error creating order from webhook:', err);
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
