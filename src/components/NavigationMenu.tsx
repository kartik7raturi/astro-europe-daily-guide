import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const NavigationMenuDemo = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const dailyInsights = [
    { title: "Daily Horoscope", href: "/dashboard", description: "Your personalised daily predictions" },
    { title: "Daily Reading", href: "/daily-reading", description: "Comprehensive daily guidance" },
    { title: "Daily Affirmations", href: "/daily-affirmations", description: "Positive affirmations for your day" },
    { title: "Astro Calendar", href: "/astro-calendar", description: "Planetary transits and events" },
    { title: "Tarot Reading", href: "/tarot-reading", description: "Get your daily tarot card guidance" },
  ];

  const loveCompatibility = [
    { title: "Soulmate Sketch", href: "/love-forecasts", description: "AI-powered soulmate sketch & predictions" },
    { title: "Soulmate Analysis", href: "/soulmate-analysis", description: "Find your perfect match" },
    { title: "Twin Flame Analysis", href: "/twin-flame", description: "Discover your twin flame connection" },
    { title: "Karmic Bonds", href: "/karmic-bonds", description: "Understand past life connections" },
    { title: "Meeting Prediction", href: "/meeting-prediction", description: "When & where you'll meet your soulmate" },
    { title: "Crush Analyzer", href: "/crush-analyzer", description: "Analyse your crush compatibility" },
  ];

  const personalGuidance = [
    { title: "AI Cosmic Chat", href: "/ai-chat", description: "Get personalised life advice" },
    { title: "Life & Career Analysis", href: "/life-career-analysis", description: "Career and life path guidance" },
    { title: "Numerology", href: "/numerology", description: "Discover your numbers" },
    { title: "Lucky Elements", href: "/lucky-elements", description: "Your lucky colours, numbers & more" },
  ];

  const services = [
    { title: "Consultation", href: "/consultations", description: "Book a personal consultation" },
    { title: "Astro Journal", href: "/astro-journal", description: "Track your cosmic journey" },
    { title: "About", href: "/about", description: "Learn about us" },
    { title: "Blog", href: "/blog", description: "Read our articles" },
  ];

  const subcategories = [
    { label: "Daily Insights", items: dailyInsights },
    { label: "Love & Compatibility", items: loveCompatibility },
    { label: "Personal Guidance", items: personalGuidance },
    { label: "Services & More", items: services },
  ];

  const linkClass = "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground";

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={cn(linkClass, isActive("/") && "bg-accent text-accent-foreground")}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[500px] md:w-[600px] lg:w-[700px] p-4 max-h-[70vh] overflow-y-auto">
              {subcategories.map((sub) => (
                <div key={sub.label} className="mb-4">
                  <h4 className="text-sm font-semibold text-primary mb-2 px-3">{sub.label}</h4>
                  <ul className="grid md:grid-cols-2 gap-1">
                    {sub.items.map((item) => (
                      <li key={item.title}>
                        <Link to={item.href}>
                          <NavigationMenuLink className={cn(linkClass, isActive(item.href) && "bg-accent")}>
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-1 text-xs leading-snug text-muted-foreground mt-1">{item.description}</p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>


        {!user && (
          <NavigationMenuItem>
            <Link to="/initial-pricing">
              <NavigationMenuLink className={cn(linkClass, isActive("/initial-pricing") && "bg-accent text-accent-foreground")}>
                Pricing
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}

        {user && (
          <NavigationMenuItem>
            <Link to="/love-forecasts">
              <NavigationMenuLink className={cn(linkClass, isActive("/love-forecasts") && "bg-accent text-accent-foreground")}>
                Soulmate Sketch
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}

        <NavigationMenuItem>
          <Link to="/contact">
            <NavigationMenuLink className={cn(linkClass, isActive("/contact") && "bg-accent text-accent-foreground")}>
              Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMenuDemo;
