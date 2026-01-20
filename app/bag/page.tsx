'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { X, Minus, Plus } from 'lucide-react';

interface BagItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    nameEn: string;
    nameNl: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
}

export default function BagPage() {
  const { data: session } = useSession();
  const { t, locale } = useLanguage();
  const [items, setItems] = useState<BagItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchBag();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchBag = async () => {
    try {
      const res = await fetch('/api/bag');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching bag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await fetch(`/api/bag?productId=${productId}`, {
        method: 'DELETE'
      });
      setItems(items.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Error removing from bag:', error);
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      // Remove and re-add with new quantity
      await fetch(`/api/bag?productId=${productId}`, {
        method: 'DELETE'
      });
      
      if (newQuantity > 0) {
        await fetch('/api/bag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: newQuantity })
        });
      }
      
      fetchBag();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-600">Please sign in to view your shopping bag.</p>
        <Link href="/auth/signin" className="inline-block mt-4 text-green-600 hover:text-green-700">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-xl">Loading bag...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">{t.shoppingBag}</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">{t.emptyBag}</p>
          <Link href="/products" className="text-green-600 hover:text-green-700">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="mt-2 p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>{t.total}</span>
                  <span className="text-green-600">€{total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-semibold">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
