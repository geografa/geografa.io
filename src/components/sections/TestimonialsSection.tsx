import { testimonials, testimonialsSection } from "@/data/site";
import { Section } from "@/components/layout/Section";

export function TestimonialsSection() {
  return (
    <Section id="testimonials" variant="green" label={testimonialsSection.label}>
      <h2 className="section-title">{testimonialsSection.title}</h2>
      <p className="section-intro" style={{ color: "rgba(245, 240, 232, 0.55)" }}>
        {testimonialsSection.intro}
      </p>
      <div className="quotes-grid">
        {testimonials.map((t, i) => (
          <div key={`${t.role}-${i}`} className="quote-card">
            <blockquote>{t.quote}</blockquote>
            <div className="quote-author">{t.author}</div>
            <div className="quote-role">{t.role}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
