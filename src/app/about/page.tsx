"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Section } from '@/components/section';
import { Button } from '@/components/ui/button';
import { Download, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function AboutPage() {
  const profilePic = PlaceHolderImages.find((img) => img.id === 'profile-picture');
  const { toast } = useToast();

  const handleCvClick = () => {
    toast({
      title: 'Download Not Available',
      description: 'The CV is not available for download at the moment.',
    });
  };

  return (
    <Section id="about" className="py-12 md:py-24">
      <div className="grid items-start gap-12 md:grid-cols-2">
        <div className="flex flex-col items-center gap-8 sticky top-24">
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            {profilePic && (
              <Image
                src={profilePic.imageUrl}
                alt="Profile Picture"
                width={400}
                height={400}
                data-ai-hint={profilePic.imageHint}
                className="rounded-full object-cover shadow-lg shadow-primary/20"
              />
            )}
            <div className="absolute inset-0 -z-10 animate-pulse rounded-full border-4 border-primary/50" />
            <div className="absolute inset-2 -z-10 animate-pulse rounded-full border-2 border-primary/30" style={{ animationDelay: '200ms' }} />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={handleCvClick}>
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </Button>
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
            <p className="mt-4 text-lg text-foreground/80">
              I am a passionate Software Engineer and Full-Stack Developer with
              over 2 years of experience in building dynamic, user-friendly, and
              scalable web applications. Currently pursuing my B.Tech in Computer
              Science, I have worked on a wide range of projects, many of which
              you can explore in the projects section of this portfolio.
            </p>
            <p className="mt-4 text-lg text-foreground/80">
              My expertise spans both front-end and back-end development. On the front end, I focus on creating elegant, responsive, and intuitive user interfaces that deliver seamless user experiences. On the back end, I specialize in building secure, efficient, and robust systems that power these applications. I enjoy solving complex problems with simple, effective solutions and continuously explore new technologies and frameworks to stay ahead in the ever-evolving tech world.
            </p>
            <p className="mt-4 text-lg text-foreground/80">
              Beyond coding, I am also deeply passionate about writing. I have authored several books, including The Art of Self-Growth and The 48 Fundamental Principles of Power, along with a number of novels that are available on Amazon. Writing allows me to express creativity in a different form and connect with people through ideas and stories.
            </p>
            <p className="mt-4 text-lg text-foreground/80">
              I thrive on challenges, enjoy continuous learning, and aim to create impactful digital solutions that inspire and empower people.
            </p>
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-primary">Education</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg border bg-card/50 p-4">
                <h3 className="text-xl font-semibold text-foreground">Bachelor of Technology in Computer Science</h3>
                <p className="text-md text-foreground/80">MANUU, Hydrabad, Telangana</p>
                <p className="text-sm text-muted-foreground">2025-2027</p>
              </div>
               <div className="rounded-lg border bg-card/50 p-4">
                <h3 className="text-xl font-semibold text-foreground">Diploma in Electrical Engineering</h3>
                <p className="text-md text-foreground/80">Jamia Millia Isalamia, New Delhi</p>
                <p className="text-sm text-muted-foreground">2021-2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
