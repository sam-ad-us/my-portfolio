"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';

export default function AdminPanelPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button onClick={handleSignOut}>Sign Out</Button>
      </div>
      <p>Welcome, {user.displayName}! You can manage your portfolio from here.</p>
    </div>
  );
}
