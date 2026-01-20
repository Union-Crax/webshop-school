import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      isAdmin: true
    }
  });

  console.log('Created admin user:', admin);

  // Create garden products
  const products = [
    {
      nameEn: 'Organic Potting Soil',
      nameNl: 'Biologische Potgrond',
      descriptionEn: 'High-quality organic potting soil enriched with nutrients. Perfect for all your potted plants and garden beds.',
      descriptionNl: 'Hoogwaardige biologische potgrond verrijkt met voedingsstoffen. Perfect voor al uw potplanten en tuinbedden.',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      category: 'Soil & Compost',
      stock: 50
    },
    {
      nameEn: 'Garden Tool Set',
      nameNl: 'Tuingereedschap Set',
      descriptionEn: 'Complete 5-piece garden tool set including trowel, fork, pruner, and gloves. Durable stainless steel construction.',
      descriptionNl: 'Compleet tuingereedschap set van 5 stuks inclusief schepje, vork, snoeischaar en handschoenen. Duurzame roestvrijstalen constructie.',
      price: 34.99,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      category: 'Tools',
      stock: 30
    },
    {
      nameEn: 'Sunflower Seeds',
      nameNl: 'Zonnebloem Zaden',
      descriptionEn: 'Giant sunflower seeds that grow up to 3 meters tall. Easy to grow and perfect for beginners.',
      descriptionNl: 'Reuze zonnebloem zaden die tot 3 meter hoog groeien. Gemakkelijk te kweken en perfect voor beginners.',
      price: 3.99,
      imageUrl: 'https://images.unsplash.com/photo-1597848212624-e6c70f6dfbe0?w=400',
      category: 'Seeds',
      stock: 100
    },
    {
      nameEn: 'Watering Can 10L',
      nameNl: 'Gieter 10L',
      descriptionEn: 'Large capacity watering can with comfortable grip and long spout for precise watering.',
      descriptionNl: 'Gieter met grote capaciteit met comfortabele grip en lange tuit voor nauwkeurig gieten.',
      price: 18.50,
      imageUrl: 'https://images.unsplash.com/photo-1563299796-17596ed6b017?w=400',
      category: 'Tools',
      stock: 25
    },
    {
      nameEn: 'Tomato Plant',
      nameNl: 'Tomatenplant',
      descriptionEn: 'Healthy tomato plant ready for transplanting. Produces delicious cherry tomatoes.',
      descriptionNl: 'Gezonde tomatenplant klaar voor het verplanten. Produceert heerlijke cherrytomaten.',
      price: 6.99,
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
      category: 'Plants',
      stock: 40
    },
    {
      nameEn: 'Garden Hose 25m',
      nameNl: 'Tuinslang 25m',
      descriptionEn: 'Flexible and durable garden hose with spray nozzle. Anti-kink design for easy handling.',
      descriptionNl: 'Flexibele en duurzame tuinslang met sproeikop. Anti-knik ontwerp voor gemakkelijke bediening.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      category: 'Tools',
      stock: 20
    },
    {
      nameEn: 'Rose Bush',
      nameNl: 'Rozenstruik',
      descriptionEn: 'Beautiful red rose bush. Hardy perennial that blooms from spring to fall.',
      descriptionNl: 'Mooie rode rozenstruik. Winterharde vaste plant die bloeit van lente tot herfst.',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=400',
      category: 'Plants',
      stock: 15
    },
    {
      nameEn: 'Organic Fertilizer',
      nameNl: 'Biologische Meststof',
      descriptionEn: 'All-purpose organic fertilizer for vegetables, flowers, and trees. Slow-release formula.',
      descriptionNl: 'Universele biologische meststof voor groenten, bloemen en bomen. Langzaam afgevende formule.',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
      category: 'Soil & Compost',
      stock: 60
    },
    {
      nameEn: 'Herb Garden Kit',
      nameNl: 'Kruidentuin Set',
      descriptionEn: 'Complete herb garden starter kit with basil, parsley, and mint seeds. Includes pots and soil.',
      descriptionNl: 'Compleet kruidentuin starter kit met basilicum, peterselie en munt zaden. Inclusief potten en aarde.',
      price: 19.99,
      imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
      category: 'Seeds',
      stock: 35
    },
    {
      nameEn: 'Garden Kneeler Pad',
      nameNl: 'Tuin Knielkussen',
      descriptionEn: 'Comfortable foam kneeling pad for gardening. Water-resistant and easy to clean.',
      descriptionNl: 'Comfortabel schuim knielkussen voor tuinieren. Waterbestendig en gemakkelijk schoon te maken.',
      price: 14.99,
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      category: 'Tools',
      stock: 45
    },
    {
      nameEn: 'Lavender Plant',
      nameNl: 'Lavendelplant',
      descriptionEn: 'Aromatic lavender plant perfect for borders and containers. Attracts bees and butterflies.',
      descriptionNl: 'Aromatische lavendelplant perfect voor borders en containers. Trekt bijen en vlinders aan.',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400',
      category: 'Plants',
      stock: 30
    },
    {
      nameEn: 'Compost Bin',
      nameNl: 'Compostbak',
      descriptionEn: 'Large capacity compost bin for turning garden waste into nutrient-rich compost.',
      descriptionNl: 'Compostbak met grote capaciteit voor het omzetten van tuinafval in voedingsrijke compost.',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
      category: 'Tools',
      stock: 12
    }
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product
    });
    console.log('Created product:', created.nameEn);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
