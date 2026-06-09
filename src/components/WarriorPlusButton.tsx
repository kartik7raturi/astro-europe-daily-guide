import { useEffect, useRef } from "react";

interface WarriorPlusButtonProps {
  /** Vendor script src. */
  scriptSrc: string;
  /** External buy link. */
  buyHref: string;
  /** Button image src. */
  buttonImg: string;
  /** Tracking pixel URL. */
  trackingUrl?: string;
  alt?: string;
}

/**
 * Renders a WarriorPlus payment button with the vendor's tracking script,
 * the standard `wplus_spdisclaimer` block and an optional view-tracking
 * pixel. The script is injected once per src.
 */
const WarriorPlusButton = ({
  scriptSrc,
  buyHref,
  buttonImg,
  trackingUrl,
  alt = "Buy now",
}: WarriorPlusButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${scriptSrc}"]`)) return;
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.src = scriptSrc;
    s.defer = true;
    document.body.appendChild(s);
  }, [scriptSrc]);

  return (
    <div ref={ref} className="w-full flex flex-col items-center gap-3">
      <a
        href={buyHref}
        className="inline-block w-full max-w-md transition-transform hover:scale-[1.02] active:scale-100"
      >
        <img
          src={buttonImg}
          alt={alt}
          className="w-full h-auto rounded-md mx-auto"
          loading="lazy"
        />
      </a>
      <div className="wplus_spdisclaimer w-full text-center text-[11px] text-muted-foreground" />
      {trackingUrl && (
        <img
          src={trackingUrl}
          alt=""
          width={1}
          height={1}
          style={{ position: "absolute", left: -9999, opacity: 0 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default WarriorPlusButton;