const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: 'Password123!'
    }
  });

  // sample category
  const cat = await prisma.category.upsert({
    where: { slug: 'general' },
    update: {},
    create: { name: 'General', slug: 'general' }
  });

  // sample product
  const product = await prisma.product.create({
    data: {
      title: 'Sample Product',
      slug: 'sample-product',
      description: 'This is a sample product created by the seed script.',
      price: 19.99,
      images: [],
      categoryId: cat.id,
      variants: {
        create: [
          { sku: 'SAMPLE-001', price: 19.99, stock: 10 }
        ]
      }
    }
  });

  console.log('Seed complete:', { adminId: admin.id, productId: product.id });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
