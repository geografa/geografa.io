import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Divider } from "@/components/ui/Divider";
import { Hero } from "@/components/sections/Hero";
import { WorkSection } from "@/components/sections/WorkSection";
import { SelectedWorkSection } from "@/components/sections/SelectedWorkSection";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";

interface LandingPageProps {
  inactive?: boolean;
}

export function LandingPage({ inactive = false }: LandingPageProps) {
  return (
    <>
      <Nav />
      <Hero inactive={inactive} />
      <WorkSection />
      <Divider />
      <SelectedWorkSection />
      <Divider />
      <ApproachSection />
      <Divider />
      <TestimonialsSection />
      <AboutSection />
      <Divider />
      <ContactSection />
      <Footer />
    </>
  );
}
