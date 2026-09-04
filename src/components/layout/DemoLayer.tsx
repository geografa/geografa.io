import { useEffect, type ReactNode } from "react";
import {
  resetPageAfterMap,
  resetPageAfterMapDeferred,
} from "@/lib/map/resetPageAfterMap";

interface DemoLayerProps {
  children: ReactNode;
}

/** Full-viewport shell for map demos; tears down Mapbox leaks on exit. */
export function DemoLayer({ children }: DemoLayerProps) {
  useEffect(() => {
    document.body.classList.add("demo-open");

    return () => {
      document.body.classList.remove("demo-open");
      resetPageAfterMap();
      resetPageAfterMapDeferred();
    };
  }, []);

  return <div className="demo-layer">{children}</div>;
}
