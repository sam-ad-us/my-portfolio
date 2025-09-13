import { GitGraph, Lightbulb, MessageSquare, Users, ClipboardList } from 'lucide-react';
import {
  IconDocker,
  IconNextjs,
  IconNodejs,
  IconPython,
  IconReact,
  IconTailwind,
  IconTypescript,
} from '@/components/icons';
import { Section } from '@/components/section';
import { Card, CardContent } from '@/components/ui/card';

const techSkills = [
  { name: 'React', icon: IconReact },
  { name: 'Next.js', icon: IconNextjs },
  { name: 'Node.js', icon: IconNodejs },
  { name: 'TypeScript', icon: IconTypescript },
  { name: 'Tailwind CSS', icon: IconTailwind },
  { name: 'Python', icon: IconPython },
  { name: 'Docker', icon: IconDocker },
  { name: 'Git', icon: GitGraph },
];

const nonTechSkills = [
    { name: 'Communication', icon: MessageSquare },
    { name: 'Teamwork', icon: Users },
    { name: 'Problem Solving', icon: Lightbulb },
    { name: 'Project Management', icon: ClipboardList },
];

export default function SkillsPage() {
  return (
    <div className="flex flex-col items-center">
      <Section id="skills" className="bg-card/30 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-bold text-primary">
            My Tech Stack
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
            A collection of technologies I'm proficient with and enjoy using.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {techSkills.map((skill) => (
            <Card
              key={skill.name}
              className="group transform-gpu bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
            >
              <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                <skill.icon
                  className="h-12 w-12 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))] transition-transform duration-300 group-hover:scale-110"
                  fill="currentColor"
                />
                <span className="font-medium text-foreground/90">{skill.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
       <Section id="non-tech-skills">
        <div className="text-center">
          <h2 className="font-headline text-4xl font-bold text-primary">
            Professional Skills
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
            The soft skills that complement my technical expertise.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {nonTechSkills.map((skill) => (
            <Card
              key={skill.name}
              className="group transform-gpu bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20"
            >
              <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                <skill.icon
                  className="h-12 w-12 text-accent drop-shadow-[0_0_8px_hsl(var(--accent))] transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-medium text-foreground/90">{skill.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
