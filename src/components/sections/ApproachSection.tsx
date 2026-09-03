import { approachSection } from "@/data/site";
import { Section } from "@/components/layout/Section";

export function ApproachSection() {
  return (
    <Section id="approach" variant="cream" label={approachSection.label}>
      <h2 className="section-title">{approachSection.title}</h2>
      <div className="approach-card">
        <div>
          <p>
            Geografa is committed to a <em>customer- and client-centered</em>{" "}
            approach — assembling just the right team for each project, then
            keeping the relationship close as it grows.
          </p>
          <p>
            Most engagements start with a conversation, not a SOW. We listen
            first, then scope: what's already working, where the bottlenecks
            are, who on your team will own this after we hand it off.
          </p>
          <p>
            From there, we tap a committed network of engineers, designers, and
            developers and assemble the smallest team that can ship the work
            well. Everything routes through one P&amp;E manager so you get
            high-touch, consistent account support — no rotating contacts, no
            relearning your stack on every new ticket.
          </p>
          <p>
            And we leave you the code, the docs, and a clear way to keep going
            without us.
          </p>
          <div className="approach-signature">{approachSection.signature}</div>
        </div>
        <img
          src={approachSection.photo.src}
          alt={approachSection.photo.alt}
          className="approach-photo"
        />
      </div>
    </Section>
  );
}
