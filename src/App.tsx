import { Route, Routes } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { SimpleLineDesignerDemo } from "@/demos/simple-line-designer/SimpleLineDesignerDemo";
import { FwcTravelTimesDemo } from "@/demos/fwc/FwcTravelTimesDemo";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/portfolio/simple-line-designer"
        element={<SimpleLineDesignerDemo />}
      />
      <Route path="/portfolio/fwc" element={<FwcTravelTimesDemo />} />
    </Routes>
  );
}
