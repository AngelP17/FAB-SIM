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
      gsap.set(items, { opacity: 0, y: 10, filter: "blur(6px)" });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.05,
      });
    }, container);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
