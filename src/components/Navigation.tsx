import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Stars, Sparkles, LogOut, User, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import NavigationMenuDemo from "./NavigationMenu";

interface NavCategory {
  name: string;
  items: { name: string; href: string }[];
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
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

  const navCategories: NavCategory[] = [
    {
      name: "Shop",
      items: [
        { name: "Browse Products", href: "/shop" },
      ]
    },
    {
      name: "Daily Insights",
      items: [
        { name: "Daily Horoscope", href: "/dashboard" },
        { name: "Daily Reading", href: "/daily-reading" },
        { name: "Daily Affirmations", href: "/daily-affirmations" },
        { name: "Astro Calendar", href: "/astro-calendar" },
      ]
    },
    {
      name: "Love & Compatibility",
      items: [
        { name: "Love Forecasts", href: "/love-forecasts" },
        { name: "Soulmate Analysis", href: "/soulmate-analysis" },
        { name: "Soulmate Portrait", href: "/soulmate-portrait" },
        { name: "Crush Analyzer", href: "/crush-analyzer" },
      ]
    },
    {
      name: "Personal Guidance",
      items: [
        { name: "AI Problem Chat", href: "/ai-chat" },
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
        { name: "Pricing", href: "/pricing" },
      ]
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isCategoryActive = (category: NavCategory) => 
    category.items.some(item => isActive(item.href));

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
                astrovibe.online
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenuDemo />
            
            {user ? (
              <div className="flex items-center gap-2">
                {user.email === "sankhobusiness@gmail.com" && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
                )}
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
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="cosmic" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {user.email?.split('@')[0]}
              </Button>
            ) : null}
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-sm rounded-lg mt-2 max-h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive("/") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

              {/* Categories with Dropdown */}
              {navCategories.map((category) => (
                <div key={category.name} className="border-b border-border/50 last:border-0">
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold transition-colors rounded-md ${
                      isCategoryActive(category) 
                        ? "text-primary bg-primary/5" 
                        : "text-foreground hover:bg-accent/30"
                    }`}
                  >
                    <span>{category.name}</span>
                    {expandedCategories.includes(category.name) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  
                  {expandedCategories.includes(category.name) && (
                    <div className="pl-4 pb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(item.href)
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    {user.email === "sankhobusiness@gmail.com" && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <User className="h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
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
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="cosmic" size="sm" className="w-full">
                      Sign In
                    </Button>
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
