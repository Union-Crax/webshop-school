import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          🌱 Welcome to Garden Shop
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Explore our selection of quality garden products
        </p>
        <Link
          href="/products"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🌻</div>
          <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
          <p className="text-gray-600">
            Hand-picked selection of the finest garden products for your needs
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🚚</div>
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">
            Quick and reliable shipping to your doorstep
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">💚</div>
          <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
          <p className="text-gray-600">
            Sustainable and environmentally conscious products
          </p>
        </div>
      </div>
    </div>
  );
}
