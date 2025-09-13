import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Section } from '@/components/section';

export default function AboutPage() {
  const profilePic = PlaceHolderImages.find((img) => img.id === 'profile-picture');

  return (
    <Section id="about" className="py-12 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="relative mx-auto h-64 w-64 md:h-80 md:w-80">
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

        <div className="space-y-4">
          <h1 className="font-headline text-4xl font-bold text-primary">About Me</h1>
          <p className="text-lg text-foreground/80">
            I am a passionate Full-Stack Developer with a knack for creating elegant
            solutions in the least amount of time. I graduated with a degree in
            Computer Science and have since been honing my skills in web
            development.
          </p>
          <p className="text-lg text-foreground/80">
            My expertise lies in building robust back-end systems and beautiful,
            responsive front-end interfaces. I thrive on challenges and am
            always eager to learn new technologies and frameworks to stay at the
            forefront of the ever-evolving tech landscape.
          </p>
          <p className="text-lg text-foreground/80">
            When I'm not coding, I enjoy exploring the outdoors, contributing to
            open-source projects, and brewing the perfect cup of coffee.
          </p>
        </div>
      </div>
    </Section>
  );
}
