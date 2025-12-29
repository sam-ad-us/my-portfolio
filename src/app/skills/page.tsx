
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Section } from '@/components/section';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Skill = {
  id: string;
  name: string;
  svg: string;
  type: 'tech' | 'non-tech';
};

async function getSkills(): Promise<{ techSkills: Skill[]; nonTechSkills: Skill[] }> {
  try {
    const skillsCol = collection(db, 'skills');
    const q = query(skillsCol, orderBy('createdAt', 'desc'));
    const skillsSnapshot = await getDocs(q);
    
    const techSkills: Skill[] = [];
    const nonTechSkills: Skill[] = [];

    skillsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const skill: Skill = {
        id: doc.id,
        name: data.name,
        svg: data.svg,
        type: data.type,
      };
      if (skill.type === 'tech') {
        techSkills.push(skill);
      } else {
        nonTechSkills.push(skill);
      }
    });
    
    return { techSkills, nonTechSkills };
  } catch (error) {
    console.error("Error fetching skills: ", error);
    return { techSkills: [], nonTechSkills: [] };
  }
}

function SkillCard({ skill }: { skill: Skill }) {
    const isTech = skill.type === 'tech';
    const colorClass = isTech ? 'hover:shadow-primary/20' : 'hover:shadow-accent/20';

    return (
        <Card
            className={cn(
                `group transform-gpu bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`,
                colorClass
            )}
        >
            <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
                 <div
                    className={cn(
                        'h-12 w-12 transition-transform duration-300 group-hover:scale-110',
                        isTech 
                            ? 'text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]'
                            : 'text-accent drop-shadow-[0_0_8px_hsl(var(--accent))]'
                    )}
                    dangerouslySetInnerHTML={{ __html: skill.svg }}
                />
                <span className="font-medium text-foreground/90">{skill.name}</span>
            </CardContent>
        </Card>
    );
}

export default async function SkillsPage() {
  const { techSkills, nonTechSkills } = await getSkills();

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
            {techSkills.length > 0 ? (
                techSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                ))
            ) : (
                <p className="col-span-full text-center text-muted-foreground">No tech skills added yet.</p>
            )}
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
           {nonTechSkills.length > 0 ? (
                nonTechSkills.map((skill) => (
                    <SkillCard key={skill.id} skill={skill} />
                ))
            ) : (
                 <p className="col-span-full text-center text-muted-foreground">No professional skills added yet.</p>
            )}
        </div>
      </Section>
    </div>
  );
}
