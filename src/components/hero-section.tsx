"use client";

import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin } from 'lucide-react';
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
        console.error("Error fetching user profile for hero:", error);
        return null;
    }
}


export default function HeroSection() {
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

    const cvButton = !profile?.cvLink ? (
        <Button size="lg" onClick={handleMissingLinkClick}>
            <Download className="mr-2 h-5 w-5" />
            Download CV
        </Button>
    ) : (
        <Button size="lg" asChild>
            <Link href={profile.cvLink} target='_blank' rel='noopener noreferrer'>
                <Download className="mr-2 h-5 w-5" />
                Download CV
            </Link>
        </Button>
    );

    const githubButton = !profile?.githubLink ? (
         <Button variant="outline" size="lg" onClick={handleMissingLinkClick}>
              <Github className="mr-2 h-5 w-5" />
              GitHub
         </Button>
    ) : (
         <Button variant="outline" size="lg" asChild>
            <Link href={profile.githubLink} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Link>
        </Button>
    );
    
    const linkedinButton = !profile?.linkedinLink ? (
         <Button variant="outline" size="lg" onClick={handleMissingLinkClick}>
            <Linkedin className="mr-2 h-5 w-5" />
            LinkedIn
        </Button>
    ) : (
        <Button variant="outline" size="lg" asChild>
            <Link href={profile.linkedinLink} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </Link>
        </Button>
    )

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center text-center">
      <div className="container mx-auto max-w-4xl px-4">
        <p className="mb-2 text-lg text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">Hi I'm</p>
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary drop-shadow-[0_0_8px_hsl(var(--primary))] md:text-7xl">
          {profile?.name || 'Abdus Samad'}
        </h1>
        <p className="mt-4 font-headline text-2xl font-medium text-foreground md:text-4xl">
          {profile?.role || 'Software Engineer'}
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
          I build dynamic, responsive, and user-friendly web applications.
          Passionate about clean code and modern web technologies.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
            {cvButton}
            {githubButton}
            {linkedinButton}
        </div>
      </div>
    </section>
  );
}
