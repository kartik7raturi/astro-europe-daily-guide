import { Link } from "react-router-dom";
import { Stars, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Stars className="h-8 w-8 text-primary animate-glow" />
              <span className="text-xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
                Cosmic Insights
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Discover your cosmic destiny with personalized astrology readings tailored for European wisdom and traditions. 
              Connect with the universe and unlock your potential.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                Europe
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                sankhobusiness@gmail.com
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/horoscope" className="text-muted-foreground hover:text-primary transition-colors">
                  Daily Horoscope
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground">Personal Readings</span>
              </li>
              <li>
                <span className="text-muted-foreground">Daily Guidance</span>
              </li>
              <li>
                <span className="text-muted-foreground">Lucky Numbers</span>
              </li>
              <li>
                <span className="text-muted-foreground">Color Therapy</span>
              </li>
              <li>
                <span className="text-muted-foreground">Problem Solutions</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Cosmic Insights. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;