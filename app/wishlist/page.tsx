'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { X } from 'lucide-react';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    nameEn: string;
    nameNl: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
}

export default function WishlistPage() {
  const { data: session } = useSession();
  const { t, locale } = useLanguage();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE'
      });
      setItems(items.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToBag = async (productId: string) => {
    try {
      await fetch('/api/bag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      alert('Added to bag!');
    } catch (error) {
      console.error('Error adding to bag:', error);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600">Please sign in to view your wishlist.</p>
        <Link href="/auth/signin" className="inline-block mt-4 text-green-600 hover:text-green-700">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-xl">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">{t.wishlist}</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">{t.emptyWishlist}</p>
          <Link href="/products" className="text-green-600 hover:text-green-700">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {items.map(item => {
            const productName = locale === 'nl' ? item.product.nameNl : item.product.nameEn;
            return (
              <div key={item.id} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                <img
                  src={item.product.imageUrl || '/placeholder-garden.jpg'}
                  alt={productName}
                  className="w-24 h-24 object-cover rounded"
                />
                
                <div className="flex-1">
                  <Link href={`/products/${item.product.id}`} className="text-lg font-semibold hover:text-green-600">
                    {productName}
                  </Link>
                  <p className="text-gray-600">€{item.product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{t.stock}: {item.product.stock}</p>
                </div>

                <button
                  onClick={() => handleAddToBag(item.product.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {t.addToBag}
                </button>

                <button
                  onClick={() => handleRemove(item.product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <X size={24} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
