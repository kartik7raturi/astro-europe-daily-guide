import { Link } from "react-router-dom";
import { Heart, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-background/95 border-t border-border/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content in One Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-cosmic bg-clip-text text-transparent">
              astrovibe.online
            </h3>
            <p className="text-sm text-muted-foreground">
              Your trusted companion for daily horoscopes, love forecasts, and cosmic guidance.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Made with love for the cosmos</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Daily Horoscope
                </Link>
              </li>
              <li>
                <Link to="/love-forecasts" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Love Forecasts
                </Link>
              </li>
              <li>
                <Link to="/ai-chat" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  AI Problem Chat
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/numerology" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Numerology
                </Link>
              </li>
              <li>
                <Link to="/crush-analyzer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Crush Analyzer
                </Link>
              </li>
              <li>
                <Link to="/astro-calendar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Astro Calendar
                </Link>
              </li>
              <li>
                <Link to="/consultations" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Consultation
                </Link>
              </li>
              <li>
                <Link to="/astro-journal" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Astro Journal
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cancellation-refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cancellation & Refund
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/affiliate" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Become an Affiliate
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <a href="mailto:support@astrovibe.online" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4 mr-2" />
              support@astrovibe.online
            </a>
            <a href="tel:+1234567890" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4 mr-2" />
              +1 (234) 567-890
            </a>
          </div>
          
          <p className="text-sm text-muted-foreground">
            © 2024 astrovibe.online. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
