import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RoseGarden from "./pages/RoseGarden";
import FriendshipContract from "./pages/FriendshipContract";
import ChocolateGame from "./pages/ChocolateGame";
import BuildABuddy from "./pages/BuildABuddy";
import TimeCapsule from "./pages/TimeCapsule";
import HugMeter from "./pages/HugMeter";
import KissWall from "./pages/KissWall";
import MemoryLane from "./pages/MemoryLane";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rose-garden" element={<RoseGarden />} />
          <Route path="/friendship-contract" element={<FriendshipContract />} />
          <Route path="/chocolate-game" element={<ChocolateGame />} />
          <Route path="/build-a-buddy" element={<BuildABuddy />} />
          <Route path="/time-capsule" element={<TimeCapsule />} />
          <Route path="/hug-meter" element={<HugMeter />} />
          <Route path="/kiss-wall" element={<KissWall />} />
          <Route path="/memory-lane" element={<MemoryLane />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;