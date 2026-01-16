import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Index from "../pages/Index";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Trading from "../pages/Trading";
import Challenge from "../pages/Challenge";
import Wallet from "../pages/Wallet";
import Profile from "../pages/Profile";
import Leaderboard from "../pages/Leaderboard";
import DashboardLeaderboard from "../pages/DashboardLeaderboard";
import AdminPanel from "../pages/AdminPanel";
import NotFound from "../pages/NotFound";
import Checkout from "../pages/Checkout";
import MarketCasablanca from "../pages/MarketCasablanca";
import About from "../pages/About";
import Careers from "../pages/Careers";
import Press from "../pages/Press";
import Contact from "../pages/Contact";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import Risk from "../pages/Risk";
import Refund from "../pages/Refund";

import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider } from "../components/theme-provider";
import GrokChatWidget from "../components/chat/GrokChatWidget";
import { API_BASE_URL } from "../lib/api";

const queryClient = new QueryClient();

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = location.hash.replace("#", "");
    const scrollToTarget = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    requestAnimationFrame(scrollToTarget);
  }, [location.pathname, location.hash]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthBootstrapper />
            <ScrollToHash />
            <AnimatedRoutes />
            <GrokChatWidget />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/trading" element={<Trading />} />
        <Route path="/dashboard/challenge" element={<Challenge />} />
        <Route path="/dashboard/wallet" element={<Wallet />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/leaderboard" element={<DashboardLeaderboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/market-casablanca" element={<MarketCasablanca />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/refund" element={<Refund />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AuthBootstrapper = () => {
  useEffect(() => {
    const syncUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, { credentials: "include" });
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user_id");
            localStorage.removeItem("auth_email");
            localStorage.removeItem("auth_username");
            localStorage.removeItem("auth_is_admin");
          }
          return;
        }
        const data = await res.json();
        localStorage.setItem("auth_user_id", String(data.user_id));
        localStorage.setItem("auth_email", data.email);
        localStorage.setItem("auth_username", data.username);
        localStorage.setItem("auth_is_admin", String(Boolean(data.is_admin)));
      } catch (error) {
        // Ignore bootstrap failures to avoid blocking the app.
      }
    };
    syncUser();
  }, []);

  return null;
};
