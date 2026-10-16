import Link from 'next/link';
import { useCart } from '../context/cart';

export default function CartPage() {
  const { items, removeItem, total } = useCart();

  return (
    <div style={{ padding: 40 }}>
      <h1>السلة</h1>
      {items.length === 0 && <p>السلة فارغة</p>}
      {items.map(i => (
        <div key={i.productId} style={{ borderBottom: '1px solid #eee', padding: 8 }}>
          <h3>{i.title}</h3>
          <p>سعر الوحدة: {i.price} | الكمية: {i.quantity}</p>
          <p>المجموع: {(i.price * i.quantity).toFixed(2)}</p>
          <button onClick={() => removeItem(i.productId)}>إزالة</button>
        </div>
      ))}
      <h3>الإجمالي: {total.toFixed(2)}</h3>
      <Link href="/checkout"><a><button disabled={items.length===0}>الدفع</button></a></Link>
    </div>
  );
}
