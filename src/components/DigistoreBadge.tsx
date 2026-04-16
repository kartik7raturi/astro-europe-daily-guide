import { useEffect, useRef } from "react";

interface DigistoreBadgeProps {
  type: "salespage" | "thankyoupage";
  className?: string;
}

/**
 * Digistore24 Trusted Badge
 * Renders the official Digistore badge inline so it does NOT cover the menu.
 * The script injects markup into the container element.
 */
const DigistoreBadge = ({ type, className = "" }: DigistoreBadgeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";

    const src =
      type === "salespage"
        ? "https://www.digistore24.com/trusted-badge/45148/s7e2aWO7TB1vImg/salespage"
        : "https://www.digistore24.com/trusted-badge/45152/URbvNfHBuUCF7uC/thankyoupage";

    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [type]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex items-center justify-center gap-3 flex-wrap ${className}`}
    />
  );
};

export default DigistoreBadge;
