import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminIndex() {
  const { data, error } = useSWR('/api/products', fetcher);

  if (error) return <div>فشل تحميل المنتجات</div>;
  if (!data) return <div>جاري التحميل...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>لوحة الإدارة — المنتجات</h1>
      <p><Link href="/products"><a>عرض واجهة المتجر</a></Link></p>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd' }}>العنوان</th>
            <th style={{ border: '1px solid #ddd' }}>السعر</th>
            <th style={{ border: '1px solid #ddd' }}>الإجراء</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map((p: any) => (
            <tr key={p.id}>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{p.title}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}>{p.price}</td>
              <td style={{ border: '1px solid #eee', padding: 8 }}><a href={`/admin/edit/${p.id}`}>تعديل</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
