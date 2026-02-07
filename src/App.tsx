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
import LifeCareerAnalysis from "./pages/LifeCareerAnalysis";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SoulmateAnalysis from "./pages/SoulmateAnalysis";
import TwinFlameAnalysis from "./pages/TwinFlameAnalysis";
import KarmicBonds from "./pages/KarmicBonds";
import MeetingPrediction from "./pages/MeetingPrediction";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import AIChat from "./pages/AIChat";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsManagement from "./pages/admin/ProductsManagement";
import AstrologersManagement from "./pages/admin/AstrologersManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import CouponsManagement from "./pages/admin/CouponsManagement";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import ComboOffersManagement from "./pages/admin/ComboOffersManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import PlansManagement from "./pages/admin/PlansManagement";
import Numerology from "./pages/Numerology";
import AstroCalendar from "./pages/AstroCalendar";
import LuckyElements from "./pages/LuckyElements";
import Consultations from "./pages/Consultations";
import Blog from "./pages/Blog";
import DailyAffirmations from "./pages/DailyAffirmations";
import LoveForecasts from "./pages/LoveForecasts";
import CrushAnalyzer from "./pages/CrushAnalyzer";
import AstroJournal from "./pages/AstroJournal";
import ProfileSetup from "./pages/ProfileSetup";
import Pricing from "./pages/Pricing";
import OrderTracking from "./pages/OrderTracking";
import Wishlist from "./pages/Wishlist";
import Affiliate from "./pages/Affiliate";
import AffiliateManagement from "./pages/admin/AffiliateManagement";
import CustomerSupportManagement from "./pages/admin/CustomerSupportManagement";
import SponsorsManagement from "./pages/admin/SponsorsManagement";
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
                <Route path="/life-career" element={<LifeCareerAnalysis />} />
                <Route path="/life-career-analysis" element={<LifeCareerAnalysis />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/daily-affirmations" element={<DailyAffirmations />} />
                <Route path="/love-forecasts" element={<LoveForecasts />} />
                <Route path="/crush-analyzer" element={<CrushAnalyzer />} />
                <Route path="/astro-journal" element={<AstroJournal />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/ai-chat" element={<AIChat />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/plans" element={<PlansManagement />} />
              <Route path="/admin/products" element={<ProductsManagement />} />
              <Route path="/admin/astrologers" element={<AstrologersManagement />} />
              <Route path="/admin/orders" element={<OrdersManagement />} />
              <Route path="/admin/coupons" element={<CouponsManagement />} />
              <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
              <Route path="/admin/combo-offers" element={<ComboOffersManagement />} />
              <Route path="/admin/blog" element={<BlogManagement />} />
              <Route path="/admin/affiliates" element={<AffiliateManagement />} />
              <Route path="/admin/support" element={<CustomerSupportManagement />} />
              <Route path="/admin/sponsors" element={<SponsorsManagement />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cancellation-refund" element={<CancellationRefund />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/soulmate-analysis" element={<SoulmateAnalysis />} />
                <Route path="/twin-flame" element={<TwinFlameAnalysis />} />
                <Route path="/karmic-bonds" element={<KarmicBonds />} />
                <Route path="/meeting-prediction" element={<MeetingPrediction />} />
                <Route path="/checkout" element={<Checkout />} />
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
