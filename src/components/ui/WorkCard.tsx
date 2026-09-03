import type { WorkItem } from "@/types/content";

export function WorkCard({ item }: { item: WorkItem }) {
  return (
    <article className="work-card">
      <img src={item.image} alt={item.imageAlt} />
      <div className="work-card-body">
        <div className="work-tag">{item.tag}</div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <a
          href={item.href}
          className="work-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.linkLabel}
        </a>
      </div>
    </article>
  );
}
