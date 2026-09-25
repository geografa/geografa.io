import { Link, Navigate, useParams } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { getCaseStudy } from "@/data/caseStudies";
import "@/styles/case-study.css";

export function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? getCaseStudy(slug) : undefined;

  if (!study) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="case-study-page">
      <Nav />
      <main className="case-study">
        <header className="case-study__header">
          <Link to={{ pathname: "/", hash: "selected" }} className="case-study__back">
            ← Selected work
          </Link>
          <p className="case-study__meta">
            <span className="case-study__tag">{study.tag}</span>
            <span className="case-study__meta-sep">·</span>
            <span>
              {study.client} · {study.year}
            </span>
          </p>
          <h1 className="case-study__title">{study.title}</h1>
          <p className="case-study__summary">{study.summary}</p>
        </header>

        <figure className="case-study__hero">
          <img src={study.heroImage} alt={study.heroImageAlt} />
        </figure>

        <div className="case-study__body">
          {study.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        {study.videoEmbedUrl ? (
          <section
            className="case-study__video"
            aria-labelledby="case-study-video"
          >
            <h2 id="case-study-video">Broadcast</h2>
            <div className="case-study__video-frame">
              <iframe
                src={study.videoEmbedUrl}
                title={study.videoTitle ?? "YouTube video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </section>
        ) : null}

        <section className="case-study__scope" aria-labelledby="case-study-scope">
          <h2 id="case-study-scope">Scope of work</h2>
          <ul>
            {study.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {study.gallery.length > 0 ? (
          <section
            className="case-study__gallery"
            aria-labelledby="case-study-gallery"
          >
            <h2 id="case-study-gallery">Gallery</h2>
            <div className="case-study__gallery-grid">
              {study.gallery.map((image) => (
                <figure key={image.src} className="case-study__gallery-item">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {study.externalHref && study.externalLabel ? (
          <p className="case-study__external">
            <a
              href={study.externalHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {study.externalLabel}
            </a>
          </p>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
