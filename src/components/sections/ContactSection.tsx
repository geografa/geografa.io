import { contactSection } from "@/data/site";
import { Section } from "@/components/layout/Section";
import { ContactPill } from "@/components/ui/ContactPill";

export function ContactSection() {
  return (
    <Section
      id="contact"
      variant="ink"
      label={contactSection.label}
      className="contact-section"
    >
      <h2 className="section-title">
        {contactSection.titleBefore}
        <em>{contactSection.titleEmphasis}</em>
        {contactSection.titleAfter}
      </h2>
      <p className="contact-body">{contactSection.body}</p>
      <div className="contact-links">
        {contactSection.links.map((link) => (
          <ContactPill
            key={link.label}
            href={link.href}
            external={link.external}
          >
            {link.label}
          </ContactPill>
        ))}
      </div>
    </Section>
  );
}
