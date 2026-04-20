import { ShieldCheck, Lock } from "lucide-react";

interface DigistoreBadgeProps {
  type: "salespage" | "thankyoupage";
  className?: string;
}

/**
 * Digistore24 trust badge — clean inline component.
 *
 * The official Digistore script renders a position:fixed widget that overlays
 * the entire site (covering the navigation menu). We render an in-flow badge
 * instead and link to the Digistore trust page for verification. This satisfies
 * the "Digistore24 + Secure Order shown horizontally" requirement without
 * breaking the header.
 */
const DigistoreBadge = ({ type, className = "" }: DigistoreBadgeProps) => {
  const verifyUrl =
    type === "salespage"
      ? "https://www.digistore24.com/trusted-badge/45148/s7e2aWO7TB1vImg/salespage"
      : "https://www.digistore24.com/trusted-badge/45152/URbvNfHBuUCF7uC/thankyoupage";

  return (
    <a
      href={verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-lg border border-primary/30 bg-card/80 backdrop-blur-sm px-4 py-2 shadow-sm hover:border-primary/50 transition-colors ${className}`}
    >
      <div className="flex items-center gap-2 pr-3 border-r border-border/60">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <span className="text-sm font-semibold text-foreground">Digistore24</span>
      </div>
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">Secure Order</span>
      </div>
    </a>
  );
};

export default DigistoreBadge;
