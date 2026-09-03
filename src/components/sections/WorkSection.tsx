import { services, workSection } from "@/data/site";
import { Section } from "@/components/layout/Section";

export function WorkSection() {
  return (
    <Section id="work" variant="ink" label={workSection.label}>
      <h2 className="section-title">{workSection.title}</h2>
      <p className="section-intro">{workSection.intro}</p>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.title} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
