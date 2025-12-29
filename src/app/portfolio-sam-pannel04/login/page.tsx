"use client";

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
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/portfolio-sam-pannel04');
    }
  }, [user, loading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/portfolio-sam-pannel04');
    } catch (error) {
      console.error("Error signing in: ", error);
      toast({
        title: 'Sign-In Failed',
        description: 'Please check your email and password.',
        variant: 'destructive',
      });
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
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
