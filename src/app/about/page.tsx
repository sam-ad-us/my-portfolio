"use client";

import Image from 'next/image';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { Download, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type UserProfile, type EducationEntry } from '@/types/user-profile';
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
        console.error("Error fetching user profile:", error);
        return null;
    }
}

// A simple component to render paragraphs from text with newlines
const Paragraphs = ({ text }: { text?: string }) => {
    if (!text) return null;
    return (
      <>
        {text.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
          <p key={index} className="mt-4 text-lg text-foreground/80">
            {paragraph}
          </p>
        ))}
      </>
    );
};
  
const EducationBlock = ({ education }: { education?: EducationEntry[] }) => {
    // Defensive check to ensure education is an array before mapping
    if (!Array.isArray(education) || education.length === 0) {
      return null;
    }

    return (
         <div className="mt-6 space-y-4">
            {education.map((entry) => (
                 <div key={entry.id} className="rounded-lg border bg-card/50 p-4 shadow-sm transition-all hover:shadow-md hover:shadow-primary/10">
                    <h3 className="text-xl font-semibold text-foreground">{entry.degree}</h3>
                    <p className="text-md text-foreground/80">{entry.institution}</p>
                    <p className="text-sm text-muted-foreground">{entry.dates}</p>
                </div>
            ))}
        </div>
    )
}

export default function AboutPage() {
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

  return (
    <Section id="about" className="py-12 md:py-24">
      <div className="grid items-start gap-12 md:grid-cols-2">
        <div className="flex flex-col items-center gap-8 md:sticky md:top-24">
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            {profile?.profilePicture ? (
              <Image
                src={profile.profilePicture}
                alt="Profile Picture"
                width={400}
                height={400}
                data-ai-hint="portrait person"
                className="rounded-full object-cover shadow-lg shadow-primary/20"
              />
            ) : (
                 <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                </div>
            )}
            <div className="absolute inset-0 -z-10 animate-pulse rounded-full border-4 border-primary/50" />
            <div className="absolute inset-2 -z-10 animate-pulse rounded-full border-2 border-primary/30" style={{ animationDelay: '200ms' }} />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {cvButton}
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">
                <FolderKanban className="mr-2 h-5 w-5" />
                Projects
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="font-headline text-4xl font-bold text-primary">About Me</h1>
            <Paragraphs text={profile?.introduction} />
          </div>
          
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Education</h2>
            <EducationBlock education={profile?.education} />
          </div>
          
          {profile?.passions && (
            <div>
              <h2 className="font-headline text-3xl font-bold text-primary">Passions & Hobbies</h2>
               <Paragraphs text={profile.passions} />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
