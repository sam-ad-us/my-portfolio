import { Button } from '@/components/ui/button';
import { Github, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Section } from '@/components/section';
import ContactSection from '@/components/contact-section';

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/sam-ad-us' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/abdussamad001' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/sam_ad_us?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
  { name: 'Email', icon: Mail, href: 'mailto:abdussamadsid001@gmail.com' },
];

export default function ContactPage() {
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
            <Button key={link.name} variant="outline" size="lg" asChild>
              <Link href={link.href} target="_blank" rel="noopener noreferrer">
                <link.icon className="mr-2 h-5 w-5" />
                {link.name}
              </Link>
            </Button>
          ))}
        </div>
      </Section>
      <ContactSection />
    </>
  );
}
