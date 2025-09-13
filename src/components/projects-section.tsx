import ProjectCard from './project-card';
import { Section } from './section';

const projects = [
  {
    id: 'project-1',
    title: 'E-Commerce Platform',
    description:
      'A full-featured e-commerce site with product listings, a shopping cart, and a secure checkout process. Built with a modern MERN stack.',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux'],
    githubLink: '#',
    liveLink: '#',
  },
  {
    id: 'project-2',
    title: 'Real-Time Chat App',
    description:
      'A responsive chat application enabling users to communicate in real-time. Features include private messaging and user presence indicators.',
    techStack: ['Next.js', 'Socket.IO', 'Tailwind CSS', 'TypeScript'],
    githubLink: '#',
    liveLink: '#',
  },
  {
    id: 'project-3',
    title: 'Data Visualization Dashboard',
    description:
      'An interactive dashboard for visualizing complex datasets. Users can filter, sort, and view data through dynamic charts and graphs.',
    techStack: ['React', 'D3.js', 'Python', 'Flask'],
    githubLink: '#',
    liveLink: '#',
  },
  {
    id: 'project-4',
    title: 'Portfolio Website',
    description:
      'This very portfolio website! A personal space to showcase my projects and skills, built with Next.js and a cinematic Three.js background.',
    techStack: ['Next.js', 'Three.js', 'Tailwind CSS', 'Genkit'],
    githubLink: '#',
    liveLink: '#',
  },
  {
    id: 'project-5',
    title: 'RB Publication',
    description:
      'A modern publication website for showcasing articles, books, and author profiles. Built with Next.js for a fast and responsive user experience.',
    techStack: ['Next.js', 'React', 'Tailwind CSS'],
    githubLink: '#',
    liveLink: 'https://rb-publication.vercel.app/',
  }
];

export default function ProjectsSection() {
  return (
    <Section id="projects">
      <div className="text-center">
        <h2 className="font-headline text-4xl font-bold text-primary">My Projects</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80">
          Here are some of the projects I've worked on. Feel free to explore them.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </Section>
  );
}
