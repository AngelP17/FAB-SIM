import { useState, useEffect, Suspense, lazy } from "react";
import { LandingPage } from "@/pages/LandingPage";

// Lazy load ConsolePage for code splitting
const ConsolePage = lazy(() => import("@/pages/ConsolePage"));

// Lazy load AiDemoPage
const AiDemoPage = lazy(() => import("@/pages/AiDemoPage"));

// Lazy load FullDemoExperience
const FullDemoExperience = lazy(() => import("@/components/demo/FullDemoExperience").then(m => ({ default: m.FullDemoExperience })));

// Loading fallback
function PageLoading({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-neutral-600 font-mono text-sm flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-neutral-800 border-t-white rounded-full animate-spin" />
        {text}
      </div>
    </div>
  );
}

function App() {
  const resolvePath = () => {
    const hashPath = window.location.hash.slice(1);
    if (hashPath) return hashPath;

    const pathname = window.location.pathname || "/";
    if (pathname === "/console" || pathname === "/ai" || pathname === "/demo") {
      return pathname;
    }
    return "/";
  };

  // Hash-based routing with pathname fallback for direct links
  const [currentPath, setCurrentPath] = useState(resolvePath());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(resolvePath());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Normalize initial navigation to hash routes
  useEffect(() => {
    const pathname = window.location.pathname || "/";
    if (!window.location.hash && (pathname === "/console" || pathname === "/ai" || pathname === "/demo")) {
      window.location.hash = pathname;
      return;
    }
    if (!window.location.hash) {
      window.location.hash = "/";
    }
  }, []);

  // Route to appropriate component
  if (currentPath === "/console") {
    return (
      <Suspense fallback={<PageLoading text="Loading TradeOS Console..." />}>
        <ConsolePage />
      </Suspense>
    );
  }

  if (currentPath === "/ai") {
    return (
      <Suspense fallback={<PageLoading text="Loading AI Demo..." />}>
        <AiDemoPage />
      </Suspense>
    );
  }

  if (currentPath === "/demo") {
    return (
      <Suspense fallback={<PageLoading text="Loading Demo Experience..." />}>
        <FullDemoExperience />
      </Suspense>
    );
  }

  return <LandingPage />;
}

export default App;
