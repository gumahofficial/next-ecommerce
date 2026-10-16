import { useEffect, useState } from 'react';
import { useCart } from '../context/cart';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(i => ({ productId: i.productId, quantity: i.quantity })) })
      });
      const data = await res.json();
      if (data.url) {
        // clear cart before redirect to avoid duplicate orders on return
        clear();
        window.location.href = data.url;
      } else {
        alert('فشل إنشاء جلسة الدفع');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ');
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Checkout</h1>
      <p>Items: {items.length}</p>
      <p>Total: {total.toFixed(2)}</p>
      <button onClick={handleCheckout} disabled={loading || items.length === 0}>{loading ? 'جاري التحويل...' : 'الدفع عبر Stripe'}</button>
    </div>
  );
}
