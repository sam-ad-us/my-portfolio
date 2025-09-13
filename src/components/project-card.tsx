import { PlaceHolderImages } from '@/lib/placeholder-images';
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

type ProjectCardProps = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
};

export default function ProjectCard({
  id,
  title,
  description,
  techStack,
  githubLink,
  liveLink,
}: ProjectCardProps) {
  const projectImage = PlaceHolderImages.find((img) => img.id === id);

  return (
    <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-card/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20">
      {projectImage && (
        <Image
          src={projectImage.imageUrl}
          alt={title}
          width={600}
          height={400}
          data-ai-hint={projectImage.imageHint}
          className="w-full object-cover"
        />
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
        <Button variant="outline" asChild>
          <Link href={githubLink} target="_blank" rel="noopener noreferrer">
            <Github /> Code
          </Link>
        </Button>
        <Button asChild>
          <Link href={liveLink} target="_blank" rel="noopener noreferrer">
            Live Demo <ArrowUpRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
