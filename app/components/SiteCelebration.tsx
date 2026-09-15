"use client";

import { useEffect, useState } from "react";
import Celebration from "./Celebration";

// Site-wide ambient celebration (founder request 2026-09-15): the same
// fireworks, falling treats and Hugo-running-laps that the app shows on its
// login screen, dialled down to the app's ambient opacity so page content
// stays readable. Mounted once in the root layout. Honours the visitor's
// reduce-motion setting by rendering nothing.
export default function SiteCelebration() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setEnabled(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  if (!enabled) return null;
  return <Celebration dog="run" treats opacity={0.4} />;
}
