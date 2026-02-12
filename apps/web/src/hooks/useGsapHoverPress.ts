import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

/** Adds hover lift + press to elements with [data-press]. */
export function useGsapHoverPress(container: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!container.current) return;
    if (prefersReducedMotion()) return;

    const elms = Array.from(container.current.querySelectorAll<HTMLElement>("[data-press]"));
    const cleanups: Array<() => void> = [];

    elms.forEach((el) => {
      const onEnter = () => gsap.to(el, { y: -2, duration: 0.18, ease: "power2.out" });
      const onLeave = () => gsap.to(el, { y: 0, duration: 0.18, ease: "power2.out" });
      const onDown = () => gsap.to(el, { y: 0, scale: 0.99, duration: 0.08, ease: "power1.out" });
      const onUp = () => gsap.to(el, { scale: 1, duration: 0.12, ease: "power1.out" });

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("mousedown", onDown);
      el.addEventListener("mouseup", onUp);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("mousedown", onDown);
        el.removeEventListener("mouseup", onUp);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [container]);
}
