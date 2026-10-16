import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { filename, data } = req.body as { filename: string; data: string };
    if (!filename || !data) return res.status(400).json({ error: 'Missing' });
    // data is base64 without data:image/... prefix
    const buffer = Buffer.from(data, 'base64');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);
    const url = `/uploads/${filename}`;
    res.status(201).json({ ok: true, url });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
