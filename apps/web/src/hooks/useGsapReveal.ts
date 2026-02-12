import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

/**
 * Reveals children of container with [data-reveal] attribute.
 * Usage: put ref on section, mark elements with data-reveal.
 */
export function useGsapReveal(container: React.RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useEffect(() => {
    if (!container.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(
        container.current!.querySelectorAll("[data-reveal]")
      );
      gsap.set(items, { opacity: 0, y: 8 });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.42,
        ease: "power2.out",
        stagger: 0.04,
        delay: 0.02,
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
