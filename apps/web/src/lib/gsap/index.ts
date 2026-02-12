// Minimal GSAP stub using Web Animations API
// Provides enough compatibility for our use cases

interface GSAPTween {
  pause(): void;
  play(): void;
  kill(): void;
}

interface GSAPContext {
  revert(): void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function toArray<T>(value: T | T[] | NodeList | HTMLCollection | null): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (value instanceof NodeList) return Array.from(value) as T[];
  if (value instanceof HTMLCollection) return Array.from(value) as T[];
  return [value];
}

export const utils = {
  toArray,
};

export const gsap = {
  utils,
  
  set(targets: unknown, vars: Record<string, unknown>): void {
    if (prefersReducedMotion()) return;
    const elements = toArray(targets as HTMLElement);
    elements.forEach(el => {
      Object.assign(el.style, vars);
    });
  },

  to(targets: unknown, vars: Record<string, unknown>): GSAPTween {
    if (prefersReducedMotion()) {
      // Just set final state immediately
      this.set(targets, {
        opacity: vars.opacity ?? 1,
        transform: vars.y !== undefined ? `translateY(${vars.y}px)` : undefined,
        filter: vars.filter ?? "none",
      });
      return { pause: () => {}, play: () => {}, kill: () => {} };
    }

    const elements = toArray(targets as HTMLElement);
    const duration = (vars.duration as number) ?? 0.5;
    const ease = (vars.ease as string) ?? "ease-out";
    const delay = (vars.delay as number) ?? 0;
    const stagger = (vars.stagger as number) ?? 0;
    const onComplete = vars.onComplete as (() => void) | undefined;

    const initial: Record<string, string> = {};
    const final: Record<string, string> = {};

    // Build keyframes from animation vars
    if (vars.opacity !== undefined) {
      initial.opacity = "0";
      final.opacity = String(vars.opacity);
    }
    if (vars.y !== undefined) {
      initial.transform = `translateY(${vars.y}px)`;
      final.transform = `translateY(0px)`;
    }
    if (vars.filter !== undefined) {
      initial.filter = vars.filter as string;
      final.filter = "none";
    }
    if (vars.scale !== undefined) {
      const currentTransform = initial.transform || "";
      initial.transform = currentTransform + ` scale(${vars.scale})`;
      final.transform = (final.transform || "") + " scale(1)";
    }

    elements.forEach((el, i) => {
      const elementDelay = delay + (stagger * i);
      
      // Apply initial state
      Object.assign(el.style, initial);
      
      // Force reflow
      void el.offsetHeight;
      
      // Animate to final state
      const animation = el.animate([initial, final], {
        duration: duration * 1000,
        easing: ease === "power2.out" ? "cubic-bezier(0.16, 1, 0.3, 1)" :
                ease === "power1.out" ? "cubic-bezier(0.25, 0.46, 0.45, 0.94)" :
                "ease-out",
        delay: elementDelay * 1000,
        fill: "forwards",
      });

      if (onComplete && i === elements.length - 1) {
        animation.onfinish = onComplete;
      }
    });

    return {
      pause() {},
      play() {},
      kill() {
        elements.forEach(el => {
          el.getAnimations().forEach(anim => anim.cancel());
        });
      },
    };
  },

  fromTo(targets: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>): GSAPTween {
    if (prefersReducedMotion()) {
      this.set(targets, toVars);
      return { pause: () => {}, play: () => {}, kill: () => {} };
    }

    const elements = toArray(targets as HTMLElement);
    const duration = (toVars.duration as number) ?? 0.5;
    const ease = (toVars.ease as string) ?? "ease-out";
    const delay = (toVars.delay as number) ?? 0;
    const stagger = (toVars.stagger as number) ?? 0;

    const from: Record<string, string> = {};
    const to: Record<string, string> = {};

    if (fromVars.opacity !== undefined) from.opacity = String(fromVars.opacity);
    if (toVars.opacity !== undefined) to.opacity = String(toVars.opacity);
    
    if (fromVars.y !== undefined) from.transform = `translateY(${fromVars.y}px)`;
    if (toVars.y !== undefined) to.transform = `translateY(${toVars.y}px)`;
    
    if (fromVars.filter !== undefined) from.filter = fromVars.filter as string;
    if (toVars.filter !== undefined) to.filter = toVars.filter as string;

    elements.forEach((el, i) => {
      const elementDelay = delay + (stagger * i);
      
      Object.assign(el.style, from);
      void el.offsetHeight;
      
      el.animate([from, to], {
        duration: duration * 1000,
        easing: ease === "power2.out" ? "cubic-bezier(0.16, 1, 0.3, 1)" :
                ease === "power1.out" ? "cubic-bezier(0.25, 0.46, 0.45, 0.94)" :
                "ease-out",
        delay: elementDelay * 1000,
        fill: "forwards",
      });
    });

    return {
      pause() {},
      play() {},
      kill() {
        elements.forEach(el => {
          el.getAnimations().forEach(anim => anim.cancel());
        });
      },
    };
  },

  context(fn: () => void, scope?: unknown): GSAPContext {
    fn();
    return {
      revert() {
        // Cleanup animations in scope
        if (scope && typeof scope === "object" && scope !== null) {
          const element = (scope as { current?: HTMLElement }).current;
          if (element) {
            element.querySelectorAll("*").forEach(el => {
              (el as HTMLElement).getAnimations().forEach(anim => anim.cancel());
            });
          }
        }
      },
    };
  },
};
