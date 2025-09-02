import React from 'react';

interface ZodiacWheelIconProps {
  className?: string;
  size?: number;
}

const ZodiacWheelIcon: React.FC<ZodiacWheelIconProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--border))"
        strokeWidth="0.5"
      />
      
      {/* Inner sections for zodiac signs */}
      <g fill="white" fontSize="2.5" textAnchor="middle" dominantBaseline="middle">
        {/* Zodiac symbols positioned around the circle */}
        <text x="12" y="3" transform="rotate(0 12 12)">♈</text>
        <text x="18.5" y="6" transform="rotate(30 12 12)">♉</text>
        <text x="21" y="12" transform="rotate(60 12 12)">♊</text>
        <text x="18.5" y="18" transform="rotate(90 12 12)">♋</text>
        <text x="12" y="21" transform="rotate(120 12 12)">♌</text>
        <text x="5.5" y="18" transform="rotate(150 12 12)">♍</text>
        <text x="3" y="12" transform="rotate(180 12 12)">♎</text>
        <text x="5.5" y="6" transform="rotate(210 12 12)">♏</text>
        <text x="12" y="3" transform="rotate(240 12 12)">♐</text>
        <text x="18.5" y="6" transform="rotate(270 12 12)">♑</text>
        <text x="21" y="12" transform="rotate(300 12 12)">♒</text>
        <text x="18.5" y="18" transform="rotate(330 12 12)">♓</text>
      </g>
      
      {/* Center circle */}
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--destructive))"
        strokeWidth="1"
      />
      
      {/* Dividing lines */}
      <g stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.3">
        <line x1="12" y1="1" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="23" />
        <line x1="1" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="23" y2="12" />
        <line x1="4.9" y1="4.9" x2="9.9" y2="9.9" />
        <line x1="14.1" y1="14.1" x2="19.1" y2="19.1" />
        <line x1="19.1" y1="4.9" x2="14.1" y2="9.9" />
        <line x1="9.9" y1="14.1" x2="4.9" y2="19.1" />
      </g>
    </svg>
  );
};

export default ZodiacWheelIcon;