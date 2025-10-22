import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Stars, Sparkles, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import NavigationMenuDemo from "./NavigationMenu";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  useEffect(() => {
    checkUserProfile();
  }, [user]);
  const checkUserProfile = async () => {
    if (!user) {
      setHasProfile(false);
      return;
    }
    try {
      const {
        data
      } = await supabase.from("profiles").select("id").eq("user_id", user.id).single();
      setHasProfile(!!data);
    } catch (error) {
      setHasProfile(false);
    }
  };
  const handleDailyHoroscopeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
    } else if (hasProfile) {
      navigate("/dashboard");
    } else {
      navigate("/horoscope");
    }
  };
  const mobileNavigation = [{
    name: "Home",
    href: "/"
  }, {
    name: "Daily Horoscope",
    href: "/dashboard"
  }, {
    name: "Love Forecasts",
    href: "/love-forecasts"
  }, {
    name: "AI Problem Chat",
    href: "/ai-chat"
  }, {
    name: "Numerology",
    href: "/numerology"
  }, {
    name: "Crush Analyzer",
    href: "/crush-analyzer"
  }, {
    name: "Shop",
    href: "/shop"
  }, {
    name: "Astro Calendar",
    href: "/astro-calendar"
  }, {
    name: "Consultation",
    href: "/consultations"
  }, {
    name: "Blog",
    href: "/blog"
  }, {
    name: "Pricing",
    href: "/pricing"
  }];
  const isActive = (href: string) => location.pathname === href;
  return <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <Stars className="h-8 w-8 text-primary animate-glow" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-sparkle" />
              </div>
              <span className="text-xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mx-[10px] px-[10px] my-0">
                astrovibe.online
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenuDemo />
            
            {user ? <div className="flex items-center gap-2">
                {user.email === "sankhobusiness@gmail.com" && <Link to="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>}
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div> : <Link to="/auth">
                <Button variant="cosmic" size="sm">
                  Sign In
                </Button>
              </Link>}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {user ? <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {user.email?.split('@')[0]}
              </Button> : null}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 bg-card/95 backdrop-blur-sm rounded-lg mt-2 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive("/") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`} onClick={() => setIsOpen(false)}>
                Home
              </Link>

              {/* Daily Insights */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-semibold text-foreground">Daily Insights</div>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Daily Horoscope
                </Link>
                <Link to="/daily-reading" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Daily Reading
                </Link>
                <Link to="/daily-affirmations" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Daily Affirmations
                </Link>
                <Link to="/astro-calendar" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Astro Calendar
                </Link>
              </div>

              {/* Love & Compatibility */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-semibold text-foreground">Love & Compatibility</div>
                <Link to="/love-forecasts" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Love Forecasts
                </Link>
                <Link to="/soulmate-analysis" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Soulmate Analysis
                </Link>
                <Link to="/crush-analyzer" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Crush Analyzer
                </Link>
              </div>

              {/* Personal Guidance */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-semibold text-foreground">Personal Guidance</div>
                <Link to="/ai-chat" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  AI Problem Chat
                </Link>
                <Link to="/life-career-analysis" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Life & Career Analysis
                </Link>
                <Link to="/numerology" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Numerology
                </Link>
                <Link to="/lucky-elements" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Lucky Elements
                </Link>
              </div>

              {/* Services & More */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-semibold text-foreground">Services & More</div>
                <Link to="/consultations" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Consultation
                </Link>
                <Link to="/shop" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Shop
                </Link>
                <Link to="/astro-journal" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Astro Journal
                </Link>
                <Link to="/about" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  About
                </Link>
                <Link to="/blog" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Blog
                </Link>
                <Link to="/pricing" className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50" onClick={() => setIsOpen(false)}>
                  Pricing
                </Link>
              </div>

              <div className="pt-2 border-t border-border">
                {user ? <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    {user.email === "sankhobusiness@gmail.com" && <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <User className="h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      </Link>}
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <User className="h-4 w-4" />
                        My Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={signOut} className="w-full gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div> : <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="cosmic" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>}
              </div>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navigation;