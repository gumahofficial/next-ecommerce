import useSWR from 'swr';
import Link from 'next/link';
import React from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductsPage() {
  const { data, error } = useSWR('/api/products', fetcher);

  if (error) return <div>فشل تحميل المنتجات</div>;
  if (!data) return <div>جاري التحميل...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>المنتجات</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {data.products.map((p: any) => (
          <div key={p.id} style={{ border: '1px solid #ddd', padding: 12 }}>
            <h3>{p.title}</h3>
            <p>{p.description}</p>
            <p>السعر: {p.price} </p>
            <Link href={`/products/${p.slug}`}><a>عرض</a></Link>
          </div>
        ))}
      </div>
    </div>
  );
}
