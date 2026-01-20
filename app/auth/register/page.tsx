'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.success) {
        setCredentials(data.credentials);
      } else {
        setError(data.message || 'Failed to create account');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!credentials) return;

    const result = await signIn('credentials', {
      username: credentials.username,
      password: credentials.password,
      redirect: false
    });

    if (!result?.error) {
      router.push('/products');
      router.refresh();
    }
  };

  if (credentials) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-600">
            Account Created! 🎉
          </h1>

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-6">
            <p className="font-bold text-lg mb-4">⚠️ Save These Credentials!</p>
            <p className="text-sm text-gray-700 mb-4">
              These credentials won't be shown again. Please save them in a safe place.
            </p>
            
            <div className="bg-white rounded p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="font-mono bg-gray-100 p-2 rounded">
                  {credentials.username}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="font-mono bg-gray-100 p-2 rounded">
                  {credentials.password}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-semibold"
          >
            Continue to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <p className="text-sm text-gray-700">
            Click the button below to create an account. Your username and password
            will be automatically generated.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-gray-400 font-semibold"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
