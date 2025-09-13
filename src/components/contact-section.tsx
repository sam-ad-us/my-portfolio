"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Section } from './section';
import { Send } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const recipientEmail = 'abdussamad.net.0@gmail.com';

  const mailtoHref = `mailto:${recipientEmail}?subject=Contact from Portfolio: ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;


  return (
    <Section id="contact">
      <div className="text-center">
        <h2 className="font-headline text-4xl font-bold text-primary">
          Get in Touch
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Have a project in mind or just want to say hi? Feel free to send me a message.
        </p>
      </div>

      <Card className="mx-auto mt-12 max-w-2xl bg-card/50 shadow-lg shadow-accent/10">
        <CardContent className="p-8">
           <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1">Name</label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
               <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">Email</label>
                <Input id="email" placeholder="your.email@example.com (for my reply)" />
              </div>
              <div>
                 <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-1">Message</label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project or idea..."
                  className="min-h-[120px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href={mailtoHref}>
                  Send Message <Send className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </form>
        </CardContent>
      </Card>
    </Section>
  );
}

// Dummy Card components for compilation, since they are used but not imported from shadcn
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);
const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => <div className={className} {...props} />;