import { Button } from '@/components/ui/button';
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/abdussamad001' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <p className="text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} John Doe. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Button key={link.name} variant="ghost" size="icon" asChild>
              <Link href={link.href} target="_blank" rel="noopener noreferrer">
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
