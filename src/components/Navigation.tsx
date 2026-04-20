import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Stars, Sparkles, LogOut, User, ChevronDown, ChevronUp, Crown, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import NavigationMenuDemo from "./NavigationMenu";

interface NavCategory {
  name: string;
  items: { name: string; href: string }[];
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { tier, isAdmin } = useFeatureAccess();

  // VIP badge: locked unless user has master tier (or admin).
  const hasVip = isAdmin || tier === "master";

  const navCategories: NavCategory[] = [
    {
      name: "Daily Insights",
      items: [
        { name: "Daily Horoscope", href: "/dashboard" },
        { name: "Daily Reading", href: "/daily-reading" },
        { name: "Daily Affirmations", href: "/daily-affirmations" },
        { name: "Astro Calendar", href: "/astro-calendar" },
        { name: "Tarot Reading", href: "/tarot-reading" },
      ]
    },
    {
      name: "Love & Compatibility",
      items: [
        { name: "Soulmate Sketch", href: "/love-forecasts" },
        { name: "Soulmate Analysis", href: "/soulmate-analysis" },
        { name: "Twin Flame Analysis", href: "/twin-flame" },
        { name: "Karmic Bonds", href: "/karmic-bonds" },
        { name: "Meeting Prediction", href: "/meeting-prediction" },
        { name: "Crush Analyzer", href: "/crush-analyzer" },
      ]
    },
    {
      name: "Personal Guidance",
      items: [
        { name: "AI Cosmic Chat", href: "/ai-chat" },
        { name: "Life & Career Analysis", href: "/life-career-analysis" },
        { name: "Numerology", href: "/numerology" },
        { name: "Lucky Elements", href: "/lucky-elements" },
      ]
    },
    {
      name: "Services & More",
      items: [
        { name: "Consultation", href: "/consultations" },
        { name: "Astro Journal", href: "/astro-journal" },
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
      ]
    }
  ];

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 transform-gpu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <Stars className="h-8 w-8 text-primary animate-glow" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-sparkle" />
              </div>
              <span className="text-xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mx-[10px] px-[10px] my-0">
                AstroVibe
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenuDemo />
            {user ? (
              <div className="flex items-center gap-2">
                {/* VIP upgrade chip — locked icon for non-VIP, crown for VIP */}
                <Link
                  to={hasVip ? "/dashboard" : "/vip-upgrade"}
                  title={hasVip ? "VIP member" : "Upgrade to VIP"}
                >
                  <Button
                    variant={hasVip ? "cosmic" : "outline"}
                    size="sm"
                    className="gap-1.5"
                  >
                    {hasVip ? <Crown className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    VIP
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" /> Admin
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" /> Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="cosmic" size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-sm rounded-lg mt-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive("/") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`} onClick={() => setIsOpen(false)}>
                Home
              </Link>

              {/* Features with subcategories */}
              <div className="border-b border-border/50">
                <button onClick={() => toggleCategory("Features")} className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold transition-colors rounded-md text-foreground hover:bg-accent/30">
                  <span>Features</span>
                  {expandedCategories.includes("Features") ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedCategories.includes("Features") && (
                  <div className="pl-2 pb-2 space-y-1">
                    {navCategories.map((category) => (
                      <div key={category.name}>
                        <button onClick={() => toggleCategory(category.name)} className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold transition-colors rounded-md text-muted-foreground hover:text-foreground">
                          <span>{category.name}</span>
                          {expandedCategories.includes(category.name) ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                        {expandedCategories.includes(category.name) && (
                          <div className="pl-4 pb-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            {category.items.map((item) => (
                              <Link key={item.href} to={item.href} className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${isActive(item.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`} onClick={() => setIsOpen(false)}>
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>


              {!user && (
                <Link to="/pricing" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive("/pricing") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`} onClick={() => setIsOpen(false)}>
                  Pricing
                </Link>
              )}

              <Link to="/shop" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive("/shop") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`} onClick={() => setIsOpen(false)}>
                Shop
              </Link>

              {user && (
                <Link to={hasVip ? "/dashboard" : "/vip-upgrade"} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  {hasVip ? "👑 VIP Member" : "🔒 Upgrade to VIP"}
                </Link>
              )}

              <Link to="/contact" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive("/contact") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`} onClick={() => setIsOpen(false)}>
                Contact
              </Link>

              <div className="pt-2 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">{user.email}</div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2"><User className="h-4 w-4" /> Admin Dashboard</Button>
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2"><User className="h-4 w-4" /> My Profile</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={signOut} className="w-full gap-2">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="cosmic" size="sm" className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
