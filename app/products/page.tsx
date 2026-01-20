'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  nameNl: string;
  description: string;
  descriptionEn: string;
  descriptionNl: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const [likesRes, wishlistRes] = await Promise.all([
        fetch('/api/likes'),
        fetch('/api/wishlist')
      ]);
      
      if (likesRes.ok) {
        const likesData = await likesRes.json();
        setLikes(new Set(likesData.map((l: any) => l.productId)));
      }
      
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlist(new Set(wishlistData.map((w: any) => w.productId)));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLike = async (productId: string) => {
    try {
      if (likes.has(productId)) {
        await fetch(`/api/likes?productId=${productId}`, {
          method: 'DELETE'
        });
        setLikes(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        });
        setLikes(prev => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      if (wishlist.has(productId)) {
        await fetch(`/api/wishlist?productId=${productId}`, {
          method: 'DELETE'
        });
        setWishlist(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId })
        });
        setWishlist(prev => new Set(prev).add(productId));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        {t.products}
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">
            No products available yet. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onLike={handleLike}
              onAddToWishlist={handleAddToWishlist}
              onAddToBag={handleAddToBag}
              isLiked={likes.has(product.id)}
              isInWishlist={wishlist.has(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
