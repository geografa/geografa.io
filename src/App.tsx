import { Route, Routes, useLocation } from "react-router-dom";
import { DemoLayer } from "@/components/layout/DemoLayer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { RouteEffects } from "@/components/layout/RouteEffects";
import { LandingPage } from "@/pages/LandingPage";
import { CaseStudyPage } from "@/pages/CaseStudyPage";
import { SimpleLineDesignerDemo } from "@/demos/simple-line-designer/SimpleLineDesignerDemo";
import { FwcTravelTimesDemo } from "@/demos/fwc/FwcTravelTimesDemo";
import { ModelMapperDemo } from "@/demos/model-mapper/ModelMapperDemo";
import { GhostsDemo } from "@/demos/ghosts/GhostsDemo";
import { PortlandTreesDemo } from "@/demos/portland-trees/PortlandTreesDemo";
import { BoiseLightsDemo } from "@/demos/boise-lights/BoiseLightsDemo";
import { HexVotesDemo } from "@/demos/hexvotes/HexVotesDemo";
import { WillamettePaddlesDemo } from "@/demos/willamette-paddles/WillamettePaddlesDemo";
import { WashingtonParkTrailsDemo } from "@/demos/washington-park-trails/WashingtonParkTrailsDemo";
import { WinterWonderlandDemo } from "@/demos/winter-wonderland/WinterWonderlandDemo";

function isDemoPath(pathname: string): boolean {
  return pathname.startsWith("/portfolio/");
}

function isCaseStudyPath(pathname: string): boolean {
  return pathname.startsWith("/work/");
}

export function App() {
  const { pathname } = useLocation();
  const isDemo = isDemoPath(pathname);
  const isCaseStudy = isCaseStudyPath(pathname);
  const hideLanding = isDemo || isCaseStudy;

  return (
    <>
      <RouteEffects isDemo={isDemo} isOverlay={hideLanding} />
      <div
        className={
          hideLanding ? "landing-page landing-page--inactive" : "landing-page"
        }
        aria-hidden={hideLanding}
      >
        <LandingPage inactive={hideLanding} />
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
              <Route
                path="/portfolio/washington-park-trails"
                element={<WashingtonParkTrailsDemo />}
              />
              <Route path="/portfolio/hexvotes" element={<HexVotesDemo />} />
              <Route path="/portfolio/fwc" element={<FwcTravelTimesDemo />} />
              <Route
                path="/portfolio/winter-wonderland"
                element={<WinterWonderlandDemo />}
              />
            </Routes>
          </DemoLayer>
        </ErrorBoundary>
      ) : null}
      {isCaseStudy ? (
        <ErrorBoundary key={pathname}>
          <Routes>
            <Route path="/work/:slug" element={<CaseStudyPage />} />
          </Routes>
        </ErrorBoundary>
      ) : null}
    </>
  );
}
