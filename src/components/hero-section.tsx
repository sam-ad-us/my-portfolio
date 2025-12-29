
import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { type UserProfile } from '@/types/user-profile';

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

export default async function HeroSection() {
    const profile = await getUserProfile();

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
            <Button size="lg" asChild>
                <Link href={profile?.cvLink || '#'} target='_blank' rel='noopener noreferrer'>
                    <Download className="mr-2 h-5 w-5" />
                    Download CV
                </Link>
            </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={profile?.githubLink || '#'} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={profile?.linkedinLink || '#'} target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
