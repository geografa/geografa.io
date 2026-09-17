import { Route, Routes, useLocation } from "react-router-dom";
import { DemoLayer } from "@/components/layout/DemoLayer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { RouteEffects } from "@/components/layout/RouteEffects";
import { LandingPage } from "@/pages/LandingPage";
import { SimpleLineDesignerDemo } from "@/demos/simple-line-designer/SimpleLineDesignerDemo";
import { FwcTravelTimesDemo } from "@/demos/fwc/FwcTravelTimesDemo";
import { ModelMapperDemo } from "@/demos/model-mapper/ModelMapperDemo";
import { GhostsDemo } from "@/demos/ghosts/GhostsDemo";
import { PortlandTreesDemo } from "@/demos/portland-trees/PortlandTreesDemo";
import { BoiseLightsDemo } from "@/demos/boise-lights/BoiseLightsDemo";
import { HexVotesDemo } from "@/demos/hexvotes/HexVotesDemo";
import { WillamettePaddlesDemo } from "@/demos/willamette-paddles/WillamettePaddlesDemo";

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
              <Route
                path="/portfolio/model-mapper"
                element={<ModelMapperDemo />}
              />
              <Route path="/portfolio/ghosts" element={<GhostsDemo />} />
              <Route
                path="/portfolio/portland-trees"
                element={<PortlandTreesDemo />}
              />
              <Route
                path="/portfolio/boise-lights"
                element={<BoiseLightsDemo />}
              />
              <Route
                path="/portfolio/willamette-paddles"
                element={<WillamettePaddlesDemo />}
              />
              <Route path="/portfolio/hexvotes" element={<HexVotesDemo />} />
              <Route path="/portfolio/fwc" element={<FwcTravelTimesDemo />} />
            </Routes>
          </DemoLayer>
        </ErrorBoundary>
      ) : null}
    </>
  );
}
