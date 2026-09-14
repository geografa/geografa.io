import { aboutSection, timeline } from "@/data/site";
import { Section } from "@/components/layout/Section";

export function AboutSection() {
  return (
    <Section id="about" variant="cream" label={aboutSection.label}>
      <h2 className="section-title">{aboutSection.title}</h2>
      <p className="about-intro">{aboutSection.intro}</p>
      <ol className="timeline">
        {timeline.map((entry) => (
          <li key={`${entry.year}-${entry.title}`} className="timeline-item">
            <span className="timeline-marker" aria-hidden="true" />
            <div className="timeline-content">
              <div className="timeline-year">{entry.year}</div>
              <div className="timeline-title">{entry.title}</div>
              {entry.description ? (
                <div className="timeline-desc">{entry.description}</div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
