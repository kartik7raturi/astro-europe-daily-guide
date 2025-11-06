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

const NavigationMenuDemo = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const dailyInsights = [
    { title: "Daily Horoscope", href: "/dashboard", description: "Your personalized daily predictions" },
    { title: "Daily Reading", href: "/daily-reading", description: "Comprehensive daily guidance" },
    { title: "Daily Affirmations", href: "/daily-affirmations", description: "Positive affirmations for your day" },
    { title: "Astro Calendar", href: "/astro-calendar", description: "Planetary transits and events" },
  ];

  const loveCompatibility = [
    { title: "Love Forecasts", href: "/love-forecasts", description: "Daily love and relationship predictions" },
    { title: "Soulmate Analysis", href: "/soulmate-analysis", description: "Find your perfect match" },
    { title: "Soulmate Portrait", href: "/soulmate-portrait", description: "Generate your soulmate portrait" },
    { title: "Crush Analyzer", href: "/crush-analyzer", description: "Analyze your crush compatibility" },
  ];

  const personalGuidance = [
    { title: "AI Problem Chat", href: "/ai-chat", description: "Get personalized life advice" },
    { title: "Life & Career Analysis", href: "/life-career-analysis", description: "Career and life path guidance" },
    { title: "Numerology", href: "/numerology", description: "Discover your numbers" },
    { title: "Lucky Elements", href: "/lucky-elements", description: "Your lucky colors, numbers & more" },
  ];

  const services = [
    { title: "Consultation", href: "/consultations", description: "Book a personal consultation" },
    { title: "Shop", href: "/shop", description: "Browse our products" },
    { title: "Astro Journal", href: "/astro-journal", description: "Track your cosmic journey" },
  ];

  const resources = [
    { title: "About", href: "/about", description: "Learn about us" },
    { title: "Blog", href: "/blog", description: "Read our articles" },
    { title: "Pricing", href: "/pricing", description: "View our plans" },
  ];

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink
              className={cn(
                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                isActive("/") && "bg-accent text-accent-foreground"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Daily Insights</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {dailyInsights.map((item) => (
                <li key={item.title}>
                  <Link to={item.href}>
                    <NavigationMenuLink
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive(item.href) && "bg-accent"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </NavigationMenuLink>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Love & Compatibility</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {loveCompatibility.map((item) => (
                <li key={item.title}>
                  <Link to={item.href}>
                    <NavigationMenuLink
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive(item.href) && "bg-accent"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </NavigationMenuLink>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Personal Guidance</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {personalGuidance.map((item) => (
                <li key={item.title}>
                  <Link to={item.href}>
                    <NavigationMenuLink
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive(item.href) && "bg-accent"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </NavigationMenuLink>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Services & More</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {[...services, ...resources].map((item) => (
                <li key={item.title}>
                  <Link to={item.href}>
                    <NavigationMenuLink
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive(item.href) && "bg-accent"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </NavigationMenuLink>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationMenuDemo;
