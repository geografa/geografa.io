import { featuredWork, selectedWorkSection } from "@/data/site";
import { Section } from "@/components/layout/Section";
import { WorkCard } from "@/components/ui/WorkCard";

export function SelectedWorkSection() {
  return (
    <Section id="selected" variant="cream" label={selectedWorkSection.label}>
      <h2 className="section-title">{selectedWorkSection.title}</h2>
      <p className="about-intro">{selectedWorkSection.intro}</p>

      <div className="work-featured-grid">
        {featuredWork.map((item) => (
          <WorkCard key={item.title} item={item} />
        ))}
      </div>
    </Section>
  );
}
