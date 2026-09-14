import { Link } from "react-router-dom";
import type { WorkItem } from "@/types/content";

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function WorkCard({ item }: { item: WorkItem }) {
  const internal = isInternalHref(item.href);

  return (
    <article className="work-card">
      <img src={item.image} alt={item.imageAlt} />
      <div className="work-card-body">
        <div className="work-tag">{item.tag}</div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        {internal ? (
          <Link to={item.href} className="work-link">
            {item.linkLabel}
          </Link>
        ) : (
          <a
            href={item.href}
            className="work-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.linkLabel}
          </a>
        )}
      </div>
    </article>
  );
}
