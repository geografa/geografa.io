import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { RouteEffects } from "@/components/layout/RouteEffects";
import { LandingPage } from "@/pages/LandingPage";
import { SimpleLineDesignerDemo } from "@/demos/simple-line-designer/SimpleLineDesignerDemo";
import { FwcTravelTimesDemo } from "@/demos/fwc/FwcTravelTimesDemo";

function isDemoPath(pathname: string): boolean {
  return pathname.startsWith("/portfolio/");
}

function LandingRoute() {
  const { pathname, key } = useLocation();
  const prevPathnameRef = useRef(pathname);
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    if (isDemoPath(prevPathname) && pathname === "/") {
      setRemountKey((value) => value + 1);
    }
  }, [pathname]);

  return <LandingPage key={`${key}-${remountKey}`} />;
}

export function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route
          path="/portfolio/simple-line-designer"
          element={<SimpleLineDesignerDemo />}
        />
        <Route path="/portfolio/fwc" element={<FwcTravelTimesDemo />} />
      </Routes>
    </>
  );
}
