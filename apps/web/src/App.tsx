import { useState, useEffect, Suspense, lazy, Component, type ReactNode } from "react";
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

interface SafeRouteBoundaryProps {
  children: ReactNode;
  routeName: string;
}

interface SafeRouteBoundaryState {
  hasError: boolean;
}

class SafeRouteBoundary extends Component<SafeRouteBoundaryProps, SafeRouteBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError(): SafeRouteBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md w-full border border-neutral-800 bg-neutral-950 rounded-xl p-6 text-center">
            <div className="text-white text-sm font-medium mb-2">{this.props.routeName} failed to load</div>
            <div className="text-neutral-500 text-sm mb-5">Please reload this route.</div>
            <a href={window.location.hash || "/#/"} className="px-4 py-2 rounded bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors">
              Retry
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
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
      <SafeRouteBoundary routeName="TradeOS Console">
        <Suspense fallback={<PageLoading text="Loading TradeOS Console..." />}>
          <ConsolePage />
        </Suspense>
      </SafeRouteBoundary>
    );
  }

  if (currentPath === "/ai") {
    return (
      <SafeRouteBoundary routeName="AI Demo">
        <Suspense fallback={<PageLoading text="Loading AI Demo..." />}>
          <AiDemoPage />
        </Suspense>
      </SafeRouteBoundary>
    );
  }

  if (currentPath === "/demo") {
    return (
      <SafeRouteBoundary routeName="Full Demo">
        <Suspense fallback={<PageLoading text="Loading Demo Experience..." />}>
          <FullDemoExperience />
        </Suspense>
      </SafeRouteBoundary>
    );
  }

  return <LandingPage />;
}

export default App;
