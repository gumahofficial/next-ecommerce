const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const plainPassword = 'Password123!';
  const hashedPassword = bcrypt.hashSync(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: hashedPassword,
      name: 'Admin',
      role: 'admin'
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin'
    }
  });

  const cat = await prisma.category.upsert({
    where: { slug: 'general' },
    update: {},
    create: { name: 'General', slug: 'general' }
  });

  await prisma.product.upsert({
    where: { slug: 'sample-product' },
    update: {},
    create: {
      title: 'Sample Product',
      slug: 'sample-product',
      description: 'This is a sample product created by the seed script.',
      price: 19.99,
      images: ['/uploads/sample-product.png'],
      categoryId: cat.id,
      variants: {
        create: [
          { sku: 'SAMPLE-001', price: 19.99, stock: 10 }
        ]
      }
    }
  });

  console.log('Seed complete:', { adminId: admin.id, email: admin.email, password: plainPassword });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
