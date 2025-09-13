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
            I am a passionate Software Engineer and Full-Stack Developer with
            over 2 years of experience in building dynamic, user-friendly, and
            scalable web applications. Currently pursuing my B.Tech in Computer
            Science, I have worked on a wide range of projects, many of which
            you can explore in the projects section of this portfolio.
          </p>
          <p className="text-lg text-foreground/80">
            My expertise spans both front-end and back-end development. On the front end, I focus on creating elegant, responsive, and intuitive user interfaces that deliver seamless user experiences. On the back end, I specialize in building secure, efficient, and robust systems that power these applications. I enjoy solving complex problems with simple, effective solutions and continuously explore new technologies and frameworks to stay ahead in the ever-evolving tech world.
          </p>
          <p className="text-lg text-foreground/80">
            Beyond coding, I am also deeply passionate about writing. I have authored several books, including The Art of Self-Growth and The 48 Fundamental Principles of Power, along with a number of novels that are available on Amazon. Writing allows me to express creativity in a different form and connect with people through ideas and stories.
          </p>
        </div>
      </div>
    </Section>
  );
}
