"use client";

import { Button } from '@/components/ui/button';
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type UserProfile } from '@/types/user-profile';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

async function getUserProfile(): Promise<UserProfile | null> {
    const adminUid = 'emM4KrlWNMR9Vhh7uCMmH5D6t362';
    try {
        const docRef = doc(db, 'user_profiles', adminUid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile for footer:", error);
        return null;
    }
}

export default function Footer() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

   useEffect(() => {
        getUserProfile().then(setProfile);
    }, []);

  const handleMissingLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
        title: 'Hey, this is nothing, coming soon.',
    });
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: profile?.githubLink },
    { name: 'LinkedIn', icon: Linkedin, href: profile?.linkedinLink },
    { name: 'Twitter', icon: Twitter, href: profile?.twitterLink },
    { name: 'Instagram', icon: Instagram, href: profile?.instagramLink },
  ];

  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} {profile?.name || 'Abdus Samad'}. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
             !link.href ? (
                <Button key={link.name} variant="ghost" size="icon" onClick={handleMissingLinkClick}>
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.name}</span>
                </Button>
            ) : (
                <Button key={link.name} variant="ghost" size="icon" asChild>
                <Link href={link.href} target="_blank" rel="noopener noreferrer">
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.name}</span>
                </Link>
                </Button>
            )
          ))}
        </div>
      </div>
    </footer>
  );
}
