import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  resetPageAfterMap,
  resetPageAfterMapDeferred,
} from "@/lib/map/resetPageAfterMap";

interface RouteEffectsProps {
  isDemo: boolean;
}

/** Reset scroll and page chrome when moving between landing and map demos. */
export function RouteEffects({ isDemo }: RouteEffectsProps) {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const wasDemoRef = useRef(isDemo);

  useEffect(() => {
    const wasDemo = wasDemoRef.current;
    wasDemoRef.current = isDemo;

    if (wasDemo && !isDemo) {
      if (hash || window.location.hash) {
        navigate({ pathname: "/", hash: "" }, { replace: true });
      }
      window.scrollTo(0, 0);
      resetPageAfterMap();
      resetPageAfterMapDeferred();
      return;
    }

    if (isDemo) {
      window.scrollTo(0, 0);
    }
  }, [isDemo, hash, navigate]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || isDemo) return;
      if (window.location.hash) {
        navigate({ pathname: "/", hash: "" }, { replace: true });
      }
      window.scrollTo(0, 0);
      resetPageAfterMap();
      resetPageAfterMapDeferred();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [isDemo, navigate]);

  return null;
}
