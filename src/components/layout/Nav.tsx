import { navLinks } from "@/data/site";

export function Nav() {
  return (
    <nav>
      <a href="#" className="nav-logo">
        <img src="/img/logo-geografa.svg" alt="Geografa logo" />
        <span>eografa</span>
      </a>
      <div className="nav-links">
        {navLinks.map((link) => (
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
    </nav>
  );
}
