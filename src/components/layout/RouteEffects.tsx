import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  resetPageAfterMap,
  resetPageAfterMapDeferred,
} from "@/lib/map/resetPageAfterMap";

function isDemoPath(pathname: string): boolean {
  return pathname.startsWith("/portfolio/");
}

/** Reset scroll and page chrome when moving between landing and map demos. */
export function RouteEffects() {
  const navigate = useNavigate();
  const { pathname, hash, key } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useLayoutEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    const returnedFromDemo = isDemoPath(prevPathname) && pathname === "/";
    const enteredDemo = isDemoPath(pathname);

    if (returnedFromDemo && (hash || window.location.hash)) {
      navigate({ pathname: "/", hash: "" }, { replace: true });
    }

    if (returnedFromDemo || enteredDemo) {
      window.scrollTo(0, 0);
    }

    resetPageAfterMap();
  }, [pathname, hash, key, navigate]);

  // Map teardown runs in effect cleanups, which fire after layout effects.
  useEffect(() => {
    resetPageAfterMap();
    resetPageAfterMapDeferred();
  }, [pathname, key]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (window.location.hash && pathname === "/") {
        navigate({ pathname: "/", hash: "" }, { replace: true });
      }
      window.scrollTo(0, 0);
      resetPageAfterMap();
      resetPageAfterMapDeferred();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [navigate, pathname]);

  return null;
}
