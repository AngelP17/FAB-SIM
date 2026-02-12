import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function isMobileOrTouchViewport() {
  const isMobile = window.matchMedia?.("(max-width: 1023px)")?.matches ?? false;
  const noHover = window.matchMedia?.("(hover: none)")?.matches ?? false;
  return isMobile || noHover;
}

export function useGsapTerminal(
  container: React.RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  useEffect(() => {
    if (!container.current) return;
    if (prefersReducedMotion() || isMobileOrTouchViewport()) return;

    const ctx = gsap.context(() => {
      const terminal = container.current!.querySelector("[data-terminal]");
      const lines = gsap.utils.toArray<HTMLElement>(
        container.current!.querySelectorAll("[data-terminal-line]")
      );

      if (!terminal || lines.length === 0) return;

      gsap.fromTo(
        terminal,
        { opacity: 0, y: 12, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        lines,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power1.out", stagger: 0.08, delay: 0.1 }
      );
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
