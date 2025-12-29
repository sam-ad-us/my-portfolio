"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function AdminPanelPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  const adminUid = 'emM4KrlWNMR9Vhh7uCMmH5D6t362';

  useEffect(() => {
    if (loading) {
      return; 
    }

    if (!user) {
      router.push('/portfolio-sam-pannel04/login');
      return;
    }

    if (user.uid !== adminUid) {
      toast({
        title: 'Not Authorized',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
      router.push('/');
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [user, loading, router, toast, adminUid]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>{loading ? 'Loading...' : 'Redirecting...'}</div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/portfolio-sam-pannel04/login');
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
