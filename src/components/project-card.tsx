"use client";

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowUpRight, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  imageUrl: string;
  createdAt?: Date;
};

export default function ProjectCard({
  id,
  title,
  description,
  techStack,
  githubLink,
  liveLink,
  imageUrl,
}: Project) {
  const { toast } = useToast();

  const handleMissingLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast({
      title: 'Hey, this is nothing, coming soon.',
    });
  };
  
  return (
    <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-card/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
      {imageUrl && (
        <div className="relative w-full h-60">
            <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            />
        </div>
      )}
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        {!githubLink ? (
          <Button variant="outline" onClick={handleMissingLinkClick}>
            <Github /> Code
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href={githubLink} target="_blank" rel="noopener noreferrer">
              <Github /> Code
            </Link>
          </Button>
        )}
        {!liveLink ? (
          <Button onClick={handleMissingLinkClick}>
            Live Demo <ArrowUpRight />
          </Button>
        ) : (
          <Button asChild>
            <Link href={liveLink} target="_blank" rel="noopener noreferrer">
              Live Demo <ArrowUpRight />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
