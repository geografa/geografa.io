import { footer, footerLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="footer">
      <div style={{ marginBottom: "0.5rem" }}>
        <strong>Geografa</strong>
      </div>
      <div>{footer.tagline}</div>
      <div className="footer-links">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
