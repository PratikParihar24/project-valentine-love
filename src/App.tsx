import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoseGarden from "./pages/RoseGarden";
import FriendshipContract from "./pages/FriendshipContract";
import ChocolateGame from "./pages/ChocolateGame";
import BuildABuddy from "./pages/BuildABuddy";
import TimeCapsule from "./pages/TimeCapsule";
import MemoryLane from "./pages/MemoryLane";

// Lazy load 3D components to prevent global crash
const HugMeter = lazy(() => import("./pages/HugMeter"));
const KissWall = lazy(() => import("./pages/KissWall"));
const Test3D = lazy(() => import("./pages/Test3D"));

import { ChakudiGuide } from "@/components/ChakudiGuide";

import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">3D Scene Error</h1>
          <p className="text-muted-foreground mb-4">Something went wrong while loading the 3D characters.</p>
          <pre className="bg-secondary/20 p-4 rounded-lg text-xs overflow-auto max-w-full">
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-primary text-white px-6 py-2 rounded-full"
          >
            Retry Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ChakudiGuide />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rose-garden" element={<RoseGarden />} />
            <Route path="/friendship-contract" element={<FriendshipContract />} />
            <Route path="/chocolate-game" element={<ChocolateGame />} />
            <Route path="/build-a-buddy" element={<BuildABuddy />} />
            <Route path="/time-capsule" element={<TimeCapsule />} />
            <Route path="/hug-meter" element={<ErrorBoundary><HugMeter /></ErrorBoundary>} />
            <Route path="/kiss-wall" element={<ErrorBoundary><KissWall /></ErrorBoundary>} />
            <Route path="/memory-lane" element={<MemoryLane />} />
            <Route path="/test-3d" element={<ErrorBoundary><Test3D /></ErrorBoundary>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;