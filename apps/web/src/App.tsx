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
  // Simple hash-based routing for static deployment
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || "/");

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || "/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Handle initial load
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = "/";
    }
  }, []);

  // Route to appropriate component
  if (currentPath === "/console") {
    return (
      <Suspense fallback={<PageLoading text="Loading TruthGrid Console..." />}>
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
