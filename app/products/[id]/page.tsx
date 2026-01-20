'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, ShoppingBag, ThumbsUp, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

export default function ProductDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { t, locale } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
      if (session) {
        checkUserData();
      }
    }
  }, [params.id, session]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserData = async () => {
    try {
      const [likesRes, wishlistRes] = await Promise.all([
        fetch('/api/likes'),
        fetch('/api/wishlist')
      ]);
      
      if (likesRes.ok) {
        const likes = await likesRes.json();
        setIsLiked(likes.some((l: any) => l.productId === params.id));
      }
      
      if (wishlistRes.ok) {
        const wishlist = await wishlistRes.json();
        setIsInWishlist(wishlist.some((w: any) => w.productId === params.id));
      }
    } catch (error) {
      console.error('Error checking user data:', error);
    }
  };

  const handleLike = async () => {
    if (!session) {
      alert('Please sign in to like products');
      return;
    }
    
    try {
      if (isLiked) {
        await fetch(`/api/likes?productId=${params.id}`, {
          method: 'DELETE'
        });
        setIsLiked(false);
      } else {
        await fetch('/api/likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: params.id })
        });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      alert('Please sign in to add to wishlist');
      return;
    }
    
    try {
      if (isInWishlist) {
        await fetch(`/api/wishlist?productId=${params.id}`, {
          method: 'DELETE'
        });
        setIsInWishlist(false);
      } else {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: params.id })
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleAddToBag = async () => {
    if (!session) {
      alert('Please sign in to add to bag');
      return;
    }
    
    try {
      await fetch('/api/bag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: params.id, quantity })
      });
      alert('Added to bag!');
    } catch (error) {
      console.error('Error adding to bag:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-xl text-red-600">Product not found</div>
      </div>
    );
  }

  const productName = locale === 'nl' ? product.nameNl : product.nameEn;
  const productDesc = locale === 'nl' ? product.descriptionNl : product.descriptionEn;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
        <ArrowLeft size={20} />
        {t.products}
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div>
          <img
            src={product.imageUrl || '/placeholder-garden.jpg'}
            alt={productName}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {productName}
          </h1>
          
          <div className="text-3xl font-bold text-green-600 mb-6">
            €{product.price.toFixed(2)}
          </div>

          <div className="mb-6">
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded">
              {product.category}
            </span>
            <span className="ml-3 text-gray-600">
              {t.stock}: {product.stock}
            </span>
          </div>

          <div className="prose max-w-none mb-8">
            <h3 className="text-lg font-semibold mb-2">{t.description}</h3>
            <p className="text-gray-700">{productDesc}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">{t.quantity}:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="border rounded px-3 py-2 w-20"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLike}
                className={`flex-1 py-3 px-4 rounded flex items-center justify-center gap-2 ${
                  isLiked
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ThumbsUp size={20} />
                {isLiked ? t.unlike : t.like}
              </button>

              <button
                onClick={handleAddToWishlist}
                className={`flex-1 py-3 px-4 rounded flex items-center justify-center gap-2 ${
                  isInWishlist
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Heart size={20} />
                {isInWishlist ? t.removeFromWishlist : t.addToWishlist}
              </button>
            </div>

            <button
              onClick={handleAddToBag}
              disabled={product.stock === 0}
              className="w-full py-3 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold"
            >
              <ShoppingBag size={20} />
              {t.addToBag}
            </button>

            <button
              onClick={handleAddToBag}
              disabled={product.stock === 0}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {t.buy}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
