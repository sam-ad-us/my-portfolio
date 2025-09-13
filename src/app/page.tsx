import ContactSection from '@/components/contact-section';
import HeroSection from '@/components/hero-section';
import SkillsSection from '@/components/skills-section';

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <HeroSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}
