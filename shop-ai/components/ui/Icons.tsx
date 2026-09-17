import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true as const,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.25" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  );
}

export function HeartIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(props)} fill={filled ? "currentColor" : "none"}>
      <path
        d="M12 19.25s-6.75-4.18-8.4-8.12C2.4 8.4 4.1 5.75 7.05 5.75c1.7 0 3.05.9 3.95 2.2.9-1.3 2.25-2.2 3.95-2.2 2.95 0 4.65 2.65 3.45 5.38-1.65 3.94-8.4 8.12-8.4 8.12Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.5 8.5h11l-.7 10.2a1.5 1.5 0 0 1-1.5 1.4H8.7a1.5 1.5 0 0 1-1.5-1.4L6.5 8.5Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 18.5c1.4-2.6 3.7-4 6.5-4s5.1 1.4 6.5 4" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 7h15M4.5 12h15M4.5 17h15" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.4}
      {...props}
    >
      <path d="m10 2.4 2.2 4.46 4.92.72-3.56 3.47.84 4.9L10 13.64 5.6 15.95l.84-4.9L2.88 7.58l4.92-.72L10 2.4Z" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 5.5 6v6.2c0 3.3 2.4 5.7 6.5 7.3 4.1-1.6 6.5-4 6.5-7.3V6L12 3.5Z" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 7.5h10v8h-10z" />
      <path d="M13.5 10.5h4.2l2.3 3v2h-6.5" />
      <circle cx="7" cy="17.5" r="1.4" />
      <circle cx="16.5" cy="17.5" r="1.4" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5 13.2 8 17.5 9.2 13.2 10.4 12 14.5 10.8 10.4 6.5 9.2 10.8 8 12 3.5Z" />
      <path d="M17.5 13.5 18.1 15.4 20 16 18.1 16.6 17.5 18.5 16.9 16.6 15 16 16.9 15.4 17.5 13.5Z" />
    </svg>
  );
}

export function ReturnIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7.5 8.5 4.5 11.5 7.5 14.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 11.5h8.2a5.3 5.3 0 1 1 0 10.6H8" strokeLinecap="round" />
    </svg>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 16.5v-2A4 4 0 0 1 12 10.5v0a4 4 0 0 1 4 4v2" />
      <rect x="5.5" y="14.5" width="3.5" height="5" rx="1.2" />
      <rect x="15" y="14.5" width="3.5" height="5" rx="1.2" />
      <path d="M12 4.5a6 6 0 0 1 6 6" />
      <path d="M6 10.5a6 6 0 0 1 6-6" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.4" cy="7.6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M10.8 18.2 12.2 12c.4-1.5-.3-2.4-1.6-2.4-1.8 0-2.8 1.7-2.8 3.6 0 1.3.5 2.2 1.6 2.2.6 0 .9-.3 1.1-.8" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 8.5h2.2V5.8H14c-2.4 0-4 1.5-4 4.1V12H7.8v2.6H10V20h3v-5.4h2.3l.4-2.6H13v-1.6c0-.8.3-1.4 1-1.4Z" />
    </svg>
  );
}
