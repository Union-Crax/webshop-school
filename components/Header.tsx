'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingBag, Heart } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  return (
    <header className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-green-200">
            🌱 {t.gardenProducts}
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-green-200">
              {t.home}
            </Link>
            <Link href="/products" className="hover:text-green-200">
              {t.products}
            </Link>
            
            {session ? (
              <>
                <Link href="/wishlist" className="hover:text-green-200 flex items-center gap-1">
                  <Heart size={18} />
                  {t.wishlist}
                </Link>
                <Link href="/bag" className="hover:text-green-200 flex items-center gap-1">
                  <ShoppingBag size={18} />
                  {t.shoppingBag}
                </Link>
                {(session.user as any).isAdmin && (
                  <Link href="/admin" className="hover:text-green-200">
                    {t.admin}
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="hover:text-green-200"
                >
                  {t.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="hover:text-green-200">
                  {t.signIn}
                </Link>
                <Link href="/auth/register" className="hover:text-green-200">
                  {t.register}
                </Link>
              </>
            )}
            
            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
