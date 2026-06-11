import { Link } from "react-router-dom";
import { Heart, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-background/95 border-t border-border/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-cosmic bg-clip-text text-transparent">AstroVibe</h3>
            <p className="text-sm text-muted-foreground">Your trusted companion for soulmate sketches, daily horoscopes, and cosmic guidance.</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Made with love for the cosmos</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/love-forecasts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Soulmate Sketch</Link></li>
              <li><Link to="/vip-upgrade" className="text-sm text-muted-foreground hover:text-primary transition-colors">VIP Upgrade</Link></li>
              <li><Link to="/plr" className="text-sm text-muted-foreground hover:text-primary transition-colors">AstroVibe PLR ($999)</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Features</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Daily Horoscope</Link></li>
              <li><Link to="/numerology" className="text-sm text-muted-foreground hover:text-primary transition-colors">Numerology</Link></li>
              <li><Link to="/tarot-reading" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tarot Reading</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cancellation-refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cancellation & Refund</Link></li>
              <li><Link to="/imprint" className="text-sm text-muted-foreground hover:text-primary transition-colors">Imprint (Impressum)</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
            <a href="mailto:support@astrovibe.online" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4 mr-2" /> support@astrovibe.online
            </a>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AstroVibe. All rights reserved.</p>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          AstroVibe content is for entertainment and general wellness reflection only. It is not FDA reviewed
          or approved, and it is not intended to diagnose, treat, cure, mitigate, or prevent any disease or
          health condition.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
