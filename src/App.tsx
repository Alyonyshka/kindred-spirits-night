import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import BugReportModal from "@/components/BugReportModal";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import Favorites from "./pages/Favorites";
import Events from "./pages/Events";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { t } from "@/lib/i18n";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, authLoading, language } = useApp();
  const [showBugModal, setShowBugModal] = useState(false);


  if (authLoading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <p className="text-muted-foreground">{t('loading', language)}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background dark">
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-4 pb-24">
          <Routes>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Auth />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <div className="fixed bottom-16 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <a href="/about" className="text-[10px] text-muted-foreground hover:text-primary transition-colors pointer-events-auto">
          О приложении
        </a>
      </div>
      <BottomNav />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
