import { Link } from "react-router-dom";
import { navLinks } from "@/data/site";

export function Nav() {
  return (
    <nav>
      <Link to="/" className="nav-logo">
        <img src="/img/logo-geografa.svg" alt="Geografa logo" />
        <span>eografa</span>
      </Link>
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
