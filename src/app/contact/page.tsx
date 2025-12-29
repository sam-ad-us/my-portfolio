"use client";

import { Button } from '@/components/ui/button';
import { Github, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Section } from '@/components/section';
import ContactSection from '@/components/contact-section';
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
        console.error("Error fetching user profile for contact page:", error);
        return null;
    }
}

export default function ContactPage() {
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
    { name: 'Email', icon: Mail, href: `mailto:${'abdussamad.net.0@gmail.com'}` },
  ];

  return (
    <>
      <Section id="contact-info" className="py-12 md:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold text-primary">Contact Me</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out to me through any of the platforms below.
          </p>
        </div>
        <div className="mx-auto mt-12 flex max-w-md flex-wrap justify-center gap-4">
          {socialLinks.map((link) => (
             !link.href ? (
                 <Button key={link.name} variant="outline" size="lg" onClick={handleMissingLinkClick}>
                    <link.icon className="mr-2 h-5 w-5" />
                    {link.name}
                 </Button>
            ) : (
                <Button key={link.name} variant="outline" size="lg" asChild>
                    <Link href={link.href} target="_blank" rel="noopener noreferrer">
                        <link.icon className="mr-2 h-5 w-5" />
                        {link.name}
                    </Link>
                </Button>
            )
          ))}
        </div>
      </Section>
      <ContactSection />
    </>
  );
}
