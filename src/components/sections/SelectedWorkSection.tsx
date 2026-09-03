import {
  archiveChips,
  featuredWork,
  selectedWorkSection,
} from "@/data/site";
import { Section } from "@/components/layout/Section";
import { WorkCard } from "@/components/ui/WorkCard";
import { WorkChip } from "@/components/ui/WorkChip";

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

      <div className="archive-label">{selectedWorkSection.archiveLabel}</div>
      <div className="work-chip-row">
        {archiveChips.map((chip) => (
          <WorkChip key={chip.label} item={chip} />
        ))}
      </div>

      <div className="archive-cta">
        <a
          href={selectedWorkSection.archiveCta.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {selectedWorkSection.archiveCta.label}
        </a>
      </div>
    </Section>
  );
}
