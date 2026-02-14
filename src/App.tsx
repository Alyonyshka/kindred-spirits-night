import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import Favorites from "./pages/Favorites";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background dark">
            <Header />
            <main className="max-w-5xl mx-auto px-4 py-4 pb-24">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/events" element={<Events />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {/* Footer - About link */}
            <div className="fixed bottom-16 left-0 right-0 z-40 flex justify-center pointer-events-none">
              <a href="/about" className="text-[10px] text-muted-foreground hover:text-primary transition-colors pointer-events-auto">
                О приложении
              </a>
            </div>
            <BottomNav />
          </div>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
