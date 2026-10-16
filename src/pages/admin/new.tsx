import { getSession, useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AdminNew() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('0');
  const [desc, setDesc] = useState('');
  const [imageData, setImageData] = useState<string | null>(null);

  async function handleImage(e: any) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const base = res.split(',')[1];
      setImageData(base);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    let imageUrl = null;
    if (imageData) {
      const filename = `${Date.now()}.png`;
      const r = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename, data: imageData }) });
      const j = await r.json();
      imageUrl = j.url;
    }
    const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, slug, description: desc, price, images: imageUrl ? [imageUrl] : [] }) });
    if (res.ok) alert('منتج تمت إضافته');
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>إضافة منتج جديد</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>العنوان</label>
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label>slug</label>
          <input value={slug} onChange={e => setSlug(e.target.value)} />
        </div>
        <div>
          <label>السعر</label>
          <input value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <div>
          <label>الوصف</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div>
          <label>صورة</label>
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>
        <button type="submit">إضافة</button>
      </form>
    </div>
  );
}
