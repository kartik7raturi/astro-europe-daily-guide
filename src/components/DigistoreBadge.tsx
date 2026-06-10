import { ShieldCheck, Lock } from "lucide-react";

interface DigistoreBadgeProps {
  type?: "salespage" | "thankyoupage";
  className?: string;
}

/**
 * JVZoo secure-checkout trust badge — inline, no external redirects.
 */
const DigistoreBadge = ({ className = "" }: DigistoreBadgeProps) => {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-lg border border-primary/30 bg-card/80 backdrop-blur-sm px-4 py-2 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 pr-3 border-r border-border/60">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <span className="text-sm font-semibold text-foreground">JVZoo</span>
      </div>
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">Secure Order</span>
      </div>
    </div>
  );
};

export default DigistoreBadge;
