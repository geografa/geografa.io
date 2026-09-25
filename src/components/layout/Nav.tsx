import { Link, useLocation } from "react-router-dom";
import { navLinks } from "@/data/site";

function hashFromHref(href: string): string | undefined {
  if (!href.startsWith("/#")) return undefined;
  return href.slice(2);
}

function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Nav() {
  const { pathname, hash } = useLocation();
  const onLanding = pathname === "/";

  return (
    <nav>
      <Link to="/" className="nav-logo">
        <img src="/img/logo-geografa.svg" alt="Geografa logo" />
        <span>eografa</span>
      </Link>
      <div className="nav-links">
        {navLinks.map((link) => {
          const sectionId = hashFromHref(link.href);
          if (sectionId) {
            const targetHash = `#${sectionId}`;
            return (
              <Link
                key={link.label}
                to={{ pathname: "/", hash: targetHash }}
                onClick={(event) => {
                  if (!onLanding) return;
                  // Same-hash re-clicks don't update location; scroll manually.
                  if (hash === targetHash) {
                    event.preventDefault();
                    scrollToSection(sectionId);
                  }
                }}
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
