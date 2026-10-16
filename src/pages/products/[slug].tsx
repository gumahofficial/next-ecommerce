import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useCart } from '../../context/cart';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { data, error } = useSWR(() => (slug ? `/api/products/${slug}` : null), fetcher);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (error) return <div>خطأ في تحميل المنتج</div>;
  if (!data) return <div>جاري التحميل...</div>;

  const p = data.product;

  function handleAdd() {
    addItem({ productId: p.id, title: p.title, price: p.price, quantity: qty });
    router.push('/cart');
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>{p.title}</h1>
      <p>{p.description}</p>
      <p>السعر: {p.price}</p>
      <div>
        الكمية: <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} />
      </div>
      <button onClick={handleAdd}>أضف إلى السلة</button>
    </div>
  );
}
