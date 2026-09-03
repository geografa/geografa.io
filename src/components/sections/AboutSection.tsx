import { aboutSection, timeline } from "@/data/site";
import { Section } from "@/components/layout/Section";

export function AboutSection() {
  return (
    <Section id="about" variant="cream" label={aboutSection.label}>
      <h2 className="section-title">{aboutSection.title}</h2>
      <p className="about-intro">{aboutSection.intro}</p>
      <div className="timeline">
        {timeline.map((entry) => (
          <div key={entry.title} className="timeline-row">
            <div className="timeline-date">{entry.date}</div>
            <div>
              <div className="timeline-title">{entry.title}</div>
              <div className="timeline-desc">{entry.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
