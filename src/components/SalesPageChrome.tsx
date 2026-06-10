import { Link } from "react-router-dom";
import DigistoreBadge from "./DigistoreBadge";

interface SalesPageChromeProps {
  badgeType?: "salespage" | "thankyoupage";
  showBankNote?: boolean;
}

/**
 * Shared footer for sales / thank-you pages: inline Digistore badge,
 * imprint + legal links, optional bank-statement disclosure.
 */
const SalesPageChrome = ({ badgeType = "salespage", showBankNote = false }: SalesPageChromeProps) => {
  return (
    <div className="mt-12 pt-8 border-t border-border/40 space-y-6 text-center">
      <div className="flex justify-center">
        <DigistoreBadge type={badgeType} />
      </div>

      {showBankNote && (
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto px-4">
          The debit will appear as <strong>JVZoo</strong> on your bank or card statement.
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <Link to="/imprint" className="hover:text-primary transition-colors">Imprint</Link>
        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
        <Link to="/cancellation-refund" className="hover:text-primary transition-colors">Cancellation & Refund</Link>
        <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
      </div>

      <p className="text-[11px] text-muted-foreground/80 max-w-2xl mx-auto px-4">
        Powered by JVZoo — secure checkout. 60-day money-back guarantee.
      </p>
    </div>
  );
};

export default SalesPageChrome;
