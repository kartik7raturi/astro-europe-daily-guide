import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import HoroscopeForm from "./pages/HoroscopeForm";
import DailyReading from "./pages/DailyReading";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CancellationRefund from "./pages/CancellationRefund";
import ShippingPolicy from "./pages/ShippingPolicy";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SoulmateAnalysis from "./pages/SoulmateAnalysis";

import Numerology from "./pages/Numerology";
import AstroCalendar from "./pages/AstroCalendar";
import LuckyElements from "./pages/LuckyElements";
import Consultations from "./pages/Consultations";
import Blog from "./pages/Blog";
import DailyAffirmations from "./pages/DailyAffirmations";
import LoveForecasts from "./pages/LoveForecasts";
import CrushAnalyzer from "./pages/CrushAnalyzer";
import AstroJournal from "./pages/AstroJournal";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/horoscope" element={<HoroscopeForm />} />
                <Route path="/daily-reading" element={<DailyReading />} />
                
                <Route path="/numerology" element={<Numerology />} />
                <Route path="/astro-calendar" element={<AstroCalendar />} />
                <Route path="/lucky-elements" element={<LuckyElements />} />
                <Route path="/consultations" element={<Consultations />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/daily-affirmations" element={<DailyAffirmations />} />
                <Route path="/love-forecasts" element={<LoveForecasts />} />
                <Route path="/crush-analyzer" element={<CrushAnalyzer />} />
                <Route path="/astro-journal" element={<AstroJournal />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cancellation-refund" element={<CancellationRefund />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/soulmate-analysis" element={<SoulmateAnalysis />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
