import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!session_id) return;
      const res = await fetch(`/api/stripe-session?session_id=${session_id}`);
      const data = await res.json();
      setInfo(data);
    }
    load();
  }, [session_id]);

  return (
    <div style={{ padding: 40 }}>
      <h1>تم الدفع بنجاح</h1>
      <p>شكراً لطلبك. هذه صفحة نجاح مبدئية.</p>
      <pre>{JSON.stringify(info, null, 2)}</pre>
    </div>
  );
}
