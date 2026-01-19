import { Shield, Truck, CreditCard, RefreshCw, Lock, Star } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    { icon: Shield, label: "100% Secure Payments", color: "text-green-500" },
    { icon: Truck, label: "Free Shipping in India", color: "text-blue-500" },
    { icon: CreditCard, label: "COD Available", color: "text-purple-500" },
    { icon: RefreshCw, label: "Easy Returns", color: "text-orange-500" },
    { icon: Lock, label: "SSL Protected", color: "text-emerald-500" },
    { icon: Star, label: "5000+ Happy Customers", color: "text-yellow-500" },
  ];

  return (
    <div className="bg-muted/50 border rounded-xl p-4 my-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col items-center gap-2 text-center">
            <badge.icon className={`w-6 h-6 ${badge.color}`} />
            <span className="text-xs font-medium text-muted-foreground">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;
