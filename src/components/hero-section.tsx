"use client";

import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function HeroSection() {
  const { toast } = useToast();

  const handleCvClick = () => {
    toast({
      title: 'Download Not Available',
      description: 'Please check the about section for more information.',
    });
  };

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center text-center">
      <div className="container mx-auto max-w-4xl px-4">
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary drop-shadow-[0_0_8px_hsl(var(--primary))] md:text-7xl">
          Abdus Samad
        </h1>
        <p className="mt-4 font-headline text-2xl font-medium text-foreground md:text-4xl">
          Software Engineer
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
          I build dynamic, responsive, and user-friendly web applications.
          Passionate about clean code and modern web technologies.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={handleCvClick}>
            <Download className="mr-2 h-5 w-5" />
            Download CV
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/sam-ad-us" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://www.linkedin.com/in/abdussamad001" target="_blank" rel="noopener noreferrer">
              <Linkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
