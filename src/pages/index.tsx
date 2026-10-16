import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{padding:40,fontFamily:'Arial'}}>
      <Head>
        <title>next-ecommerce (scaffold)</title>
      </Head>
      <h1>Next Ecommerce — Scaffold</h1>
      <p>This is a starter scaffold. To create example data, click the button below after the database is ready.</p>
      <p>
        <a href="/api/seed">
          <button>Run Seed</button>
        </a>
      </p>
      <p>After seeding, connect to your database and explore the tables (Users, Products, Orders).</p>
      <hr />
      <p>Admin (seed): admin@example.com / Password123!</p>
      <p>Next steps: implement product listing, cart, checkout (Stripe), auth, and admin dashboard.</p>
    </div>
  );
}
