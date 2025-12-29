'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();
  const adminUid = 'emM4KrlWNMR9Vhh7uCMmH5D6t362';

  useEffect(() => {
    if (!loading && user?.uid === adminUid) {
      router.replace('/portfolio-sam-pannel04');
    }
  }, [user, loading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle the redirect upon successful auth state change.
    } catch (error) {
      console.error('Error signing in: ', error);
      toast({
        title: 'Sign-In Failed',
        description: 'Please check your email and password.',
        variant: 'destructive',
      });
      setIsSigningIn(false);
    }
  };

  // While loading auth state or if user is already the admin, show a loading indicator.
  if (loading || (!loading && user?.uid === adminUid)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Only show login form if not loading and user is not the admin
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-xs p-4">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground">
            Sign in to manage your portfolio
          </p>
        </div>
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSigningIn}
            className="bg-card"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSigningIn}
            className="bg-card"
          />
          <Button type="submit" className="w-full" disabled={isSigningIn}>
            {isSigningIn ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
