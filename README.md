# Garden Shop - Web Shop School Project

A modern e-commerce webshop focused on garden-related products, built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- 🌱 **Product Catalog**: Browse and search garden products
- 🌐 **Multi-language Support**: Switch between English and Dutch
- 👤 **User Authentication**: Auto-generated username/password account system
- ❤️ **Wishlist**: Save favorite products
- 🛒 **Shopping Bag**: Add items with quantity management
- 👍 **Likes**: Like/unlike products
- 👨‍💼 **Admin Dashboard**: Manage products, edit prices, add new listings
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webshop-school
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env` and update with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/garden_shop?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Push the database schema:
```bash
npm run db:push
```

5. Seed the database with sample products:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Admin Credentials

After seeding the database, you can log in with:
- **Username**: `admin`
- **Password**: `admin123`

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── bag/               # Shopping bag page
│   ├── products/          # Product listing and detail pages
│   └── wishlist/          # Wishlist page
├── components/            # React components
├── contexts/              # React contexts (Language)
├── lib/                   # Utility functions
├── locales/               # Translation files
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── public/                # Static assets
```

## Database Schema

- **User**: User accounts with auto-generated credentials
- **Product**: Garden products with multi-language support
- **WishlistItem**: User's saved favorite products
- **BagItem**: Shopping cart items with quantity
- **Like**: User's liked products

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data

## Features in Detail

### Language Switcher
Click the EN/NL buttons in the header to switch between English and Dutch. Product names and descriptions are stored in both languages.

### User Registration
Click "Register" to create an account. The system automatically generates a unique username and secure password. **Save these credentials** as they won't be shown again!

### Admin Dashboard
Admin users can:
- Add new products with bilingual names and descriptions
- Edit product prices and stock levels
- Delete products
- View all products in a table format

### Shopping Experience
- View products in a grid layout
- Click product cards to see detailed information
- Add items to wishlist or shopping bag from product cards
- Adjust quantities in the shopping bag
- See total price calculation

## License

This project is created for educational purposes.
