import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProjectCard, { type Project } from './project-card';
import { Section } from './section';

async function getProjects(): Promise<Project[]> {
  try {
    const projectsCol = collection(db, 'projects');
    const q = query(projectsCol, orderBy('createdAt', 'desc'));
    const projectsSnapshot = await getDocs(q);
    const projectsList = projectsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        techStack: data.techStack,
        githubLink: data.githubLink,
        liveLink: data.liveLink,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt.toDate(),
      };
    });
    return projectsList as Project[];
  } catch (error) {
    console.error("Error fetching projects: ", error);
    return [];
  }
}

export default async function ProjectsSection() {
  const projects = await getProjects();

  return (
    <Section id="projects">
      <div className="text-center">
        <h2 className="font-headline text-4xl font-bold text-primary">My Projects</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Here are some of the projects I've worked on. Feel free to explore them.
        </p>
      </div>
       <div className="mt-12 grid gap-8 md:grid-cols-2">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))
        ) : (
          <div className="md:col-span-2 text-center text-muted-foreground">
            <p>No projects have been added yet. Check back soon!</p>
          </div>
        )}
      </div>
    </Section>
  );
}
