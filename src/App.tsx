import { Route, Routes, useLocation } from "react-router-dom";
import { DemoLayer } from "@/components/layout/DemoLayer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { RouteEffects } from "@/components/layout/RouteEffects";
import { LandingPage } from "@/pages/LandingPage";
import { SimpleLineDesignerDemo } from "@/demos/simple-line-designer/SimpleLineDesignerDemo";
import { FwcTravelTimesDemo } from "@/demos/fwc/FwcTravelTimesDemo";

function isDemoPath(pathname: string): boolean {
  return pathname.startsWith("/portfolio/");
}

export function App() {
  const { pathname } = useLocation();
  const isDemo = isDemoPath(pathname);

  return (
    <>
      <RouteEffects isDemo={isDemo} />
      <div
        className={
          isDemo ? "landing-page landing-page--inactive" : "landing-page"
        }
        aria-hidden={isDemo}
      >
        <LandingPage inactive={isDemo} />
      </div>
      {isDemo ? (
        <ErrorBoundary key={pathname}>
          <DemoLayer>
            <Routes>
              <Route
                path="/portfolio/simple-line-designer"
                element={<SimpleLineDesignerDemo />}
              />
              <Route path="/portfolio/fwc" element={<FwcTravelTimesDemo />} />
            </Routes>
          </DemoLayer>
        </ErrorBoundary>
      ) : null}
    </>
  );
}
