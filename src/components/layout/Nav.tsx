import { Link } from "react-router-dom";
import { navLinks } from "@/data/site";

function hashFromHref(href: string): string | undefined {
  if (!href.startsWith("/#")) return undefined;
  return href.slice(2);
}

export function Nav() {
  return (
    <nav>
      <Link to="/" className="nav-logo">
        <img src="/img/logo-geografa.svg" alt="Geografa logo" />
        <span>eografa</span>
      </Link>
      <div className="nav-links">
        {navLinks.map((link) => {
          const hash = hashFromHref(link.href);
          if (hash) {
            return (
              <Link
                key={link.label}
                to={{ pathname: "/", hash }}
              >
                {link.label}
              </Link>
            );
          }

          return (
            <a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
