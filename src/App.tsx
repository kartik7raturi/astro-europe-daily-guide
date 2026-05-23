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
import ManagePages from "./pages/admin/ManagePages";
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
import CustomerSupportManagement from "./pages/admin/CustomerSupportManagement";
import SponsorsManagement from "./pages/admin/SponsorsManagement";
import UpdatesManagement from "./pages/admin/UpdatesManagement";
import AstrologerRegistration from "./pages/AstrologerRegistration";
import AstrologerDashboard from "./pages/AstrologerDashboard";
import AstrologerProfile from "./pages/AstrologerProfile";
import ConsultationChat from "./pages/ConsultationChat";
import ConsultationManagement from "./pages/admin/ConsultationManagement";
import TarotReading from "./pages/TarotReading";
import ThankYou from "./pages/ThankYou";
import ThankYouVip from "./pages/ThankYouVip";
import InitialPricing from "./pages/InitialPricing";
import Upsell from "./pages/Upsell";
import PLRSales from "./pages/PLRSales";
import PLRDownload from "./pages/PLRDownload";
import Imprint from "./pages/Imprint";
import Quiz from "./pages/Quiz";
import FreeReport from "./pages/FreeReport";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import AuthRedirect from "./components/AuthRedirect";
import FeatureGate from "./components/FeatureGate";

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
                <Route path="/" element={<AuthRedirect><Home /></AuthRedirect>} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/free-report" element={<FreeReport />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ProductDetail />} />
                <Route path="/horoscope" element={<HoroscopeForm />} />
                <Route path="/daily-reading" element={<DailyReading />} />
                <Route path="/numerology" element={<Numerology />} />
                <Route path="/astro-calendar" element={<AstroCalendar />} />
                <Route path="/lucky-elements" element={<LuckyElements />} />
                <Route path="/consultations" element={<Consultations />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/daily-affirmations" element={<FeatureGate minTier="explorer"><DailyAffirmations /></FeatureGate>} />
                <Route path="/love-forecasts" element={<FeatureGate minTier="explorer"><LoveForecasts /></FeatureGate>} />
                <Route path="/crush-analyzer" element={<FeatureGate minTier="explorer"><CrushAnalyzer /></FeatureGate>} />
                <Route path="/astro-journal" element={<AstroJournal />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/initial-pricing" element={<InitialPricing />} />
                <Route path="/upsell" element={<Upsell />} />
                <Route path="/vip-upgrade" element={<Upsell />} />
                <Route path="/plr" element={<PLRSales />} />
                <Route path="/plr-download" element={<PLRDownload />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/ai-chat" element={<FeatureGate minTier="master"><AIChat /></FeatureGate>} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/astrologer-register" element={<AstrologerRegistration />} />
                <Route path="/astrologer-dashboard" element={<AstrologerDashboard />} />
                <Route path="/astrologer/:id" element={<AstrologerProfile />} />
                <Route path="/consultation-chat/:bookingId" element={<ConsultationChat />} />
                <Route path="/tarot-reading" element={<FeatureGate minTier="explorer"><TarotReading /></FeatureGate>} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/thank-you-vip" element={<ThankYouVip />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/plans" element={<PlansManagement />} />
                <Route path="/admin/products" element={<ProductsManagement />} />
                <Route path="/admin/astrologers" element={<AstrologersManagement />} />
                <Route path="/admin/orders" element={<OrdersManagement />} />
                <Route path="/admin/coupons" element={<CouponsManagement />} />
                <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                <Route path="/admin/combo-offers" element={<ComboOffersManagement />} />
                <Route path="/admin/blog" element={<BlogManagement />} />
                <Route path="/admin/support" element={<CustomerSupportManagement />} />
                <Route path="/admin/sponsors" element={<SponsorsManagement />} />
                <Route path="/admin/updates" element={<UpdatesManagement />} />
                <Route path="/admin/consultations" element={<ConsultationManagement />} />
                <Route path="/admin/pages" element={<ManagePages />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cancellation-refund" element={<CancellationRefund />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/soulmate-analysis" element={<FeatureGate minTier="explorer"><SoulmateAnalysis /></FeatureGate>} />
                <Route path="/twin-flame" element={<FeatureGate minTier="explorer"><TwinFlameAnalysis /></FeatureGate>} />
                <Route path="/karmic-bonds" element={<FeatureGate minTier="explorer"><KarmicBonds /></FeatureGate>} />
                <Route path="/meeting-prediction" element={<FeatureGate minTier="explorer"><MeetingPrediction /></FeatureGate>} />
                <Route path="/life-career" element={<FeatureGate minTier="master"><LifeCareerAnalysis /></FeatureGate>} />
                <Route path="/life-career-analysis" element={<FeatureGate minTier="master"><LifeCareerAnalysis /></FeatureGate>} />
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
