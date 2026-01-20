'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, ShoppingBag, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

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

interface ProductCardProps {
  product: Product;
  onLike?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onAddToBag?: (productId: string) => void;
  isLiked?: boolean;
  isInWishlist?: boolean;
}

export default function ProductCard({
  product,
  onLike,
  onAddToWishlist,
  onAddToBag,
  isLiked,
  isInWishlist
}: ProductCardProps) {
  const { data: session } = useSession();
  const { t, locale } = useLanguage();
  const [loading, setLoading] = useState(false);

  const productName = locale === 'nl' ? product.nameNl : product.nameEn;
  const productDesc = locale === 'nl' ? product.descriptionNl : product.descriptionEn;

  const handleAction = async (action: () => void) => {
    if (!session) {
      alert('Please sign in to perform this action');
      return;
    }
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/products/${product.id}`}>
        <img
          src={product.imageUrl || '/placeholder-garden.jpg'}
          alt={productName}
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600">
            {productName}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {productDesc}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-green-600">
            €{product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            {t.stock}: {product.stock}
          </span>
        </div>
        
        <div className="mt-4 flex gap-2">
          {onLike && (
            <button
              onClick={() => handleAction(() => onLike(product.id))}
              disabled={loading}
              className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-1 ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ThumbsUp size={16} />
              {isLiked ? t.unlike : t.like}
            </button>
          )}
          
          {onAddToWishlist && (
            <button
              onClick={() => handleAction(() => onAddToWishlist(product.id))}
              disabled={loading}
              className={`flex-1 py-2 px-3 rounded flex items-center justify-center gap-1 ${
                isInWishlist
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Heart size={16} />
            </button>
          )}
          
          {onAddToBag && (
            <button
              onClick={() => handleAction(() => onAddToBag(product.id))}
              disabled={loading}
              className="flex-1 py-2 px-3 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-1"
            >
              <ShoppingBag size={16} />
              {t.addToBag}
            </button>
          )}
        </div>
        
        <Link
          href={`/products/${product.id}`}
          className="block mt-3 text-center py-2 text-green-600 hover:text-green-700 font-medium"
        >
          {t.viewDetails} →
        </Link>
      </div>
    </div>
  );
}
