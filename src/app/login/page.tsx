"use client";

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/portfolio-sam-pannel04');
    }
  }, [user, loading, router]);


  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/portfolio-sam-pannel04');
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-xs">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground">Sign in to manage your portfolio</p>
        </div>
        <Button onClick={handleGoogleSignIn} className="w-full">
          Sign In with Google
        </Button>
      </div>
    </div>
  );
}
