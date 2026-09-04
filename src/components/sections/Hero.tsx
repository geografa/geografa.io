import { useEffect, useRef } from "react";
import { hero } from "@/data/site";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  inactive?: boolean;
}

export function Hero({ inactive = false }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inactive) {
      video.pause();
      return;
    }

    video.currentTime = 0;
    void video.play().catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => {});
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [inactive]);

  return (
    <section className="hero">
      <div className="hero-video-wrap">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          id="heroVideo"
        >
          <source src={hero.videoSrc} type="video/mp4" />
        </video>
      </div>
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-tag">
          <img src="/img/logo-geografa.svg" alt="Geografa logo" />
          {hero.tagline}
        </div>
        <h1>{hero.title}</h1>
        <p className="hero-sub">{hero.subtitle}</p>
        <div className="hero-cta">
          <Button href={hero.primaryCta.href} variant="primary">
            {hero.primaryCta.label}
          </Button>
          <Button href={hero.secondaryCta.href} variant="ghost">
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>
      <div className="scroll-hint">↓ scroll</div>
    </section>
  );
}
