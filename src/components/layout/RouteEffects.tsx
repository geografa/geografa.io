import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  resetPageAfterMap,
  resetPageAfterMapDeferred,
} from "@/lib/map/resetPageAfterMap";

interface RouteEffectsProps {
  isDemo: boolean;
  isOverlay: boolean;
}

function scrollToHash(rawHash: string): void {
  const id = rawHash.replace(/^#/, "");
  if (!id) return;
  // Defer until after layout (esp. when landing leaves inactive/fixed state).
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/** Reset scroll and page chrome when moving between landing, demos, and case studies. */
export function RouteEffects({ isDemo, isOverlay }: RouteEffectsProps) {
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();
  const wasDemoRef = useRef(isDemo);
  const wasOverlayRef = useRef(isOverlay);

  useEffect(() => {
    const wasDemo = wasDemoRef.current;
    const wasOverlay = wasOverlayRef.current;
    wasDemoRef.current = isDemo;
    wasOverlayRef.current = isOverlay;

    if (wasDemo && !isDemo) {
      if (hash || window.location.hash) {
        navigate({ pathname: "/", hash: "" }, { replace: true });
      }
      window.scrollTo(0, 0);
      resetPageAfterMap();
      resetPageAfterMapDeferred();
      return;
    }

    if (isOverlay) {
      window.scrollTo(0, 0);
      return;
    }

    // Landing is visible: scroll to section hash (nav clicks, case-study back, deep links).
    if (hash) {
      scrollToHash(hash);
      return;
    }

    if (wasOverlay && !isOverlay) {
      window.scrollTo(0, 0);
    }
  }, [isDemo, isOverlay, hash, navigate, pathname]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || isOverlay) return;
      if (window.location.hash) {
        navigate({ pathname: "/", hash: "" }, { replace: true });
      }
      window.scrollTo(0, 0);
      resetPageAfterMap();
      resetPageAfterMapDeferred();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [isOverlay, navigate]);

  return null;
}
