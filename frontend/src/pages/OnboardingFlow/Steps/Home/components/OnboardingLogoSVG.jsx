import { useTheme } from "@/hooks/useTheme";

export function OnboardingLogoSVG() {
  const { isLight } = useTheme();
  const op = isLight ? 0.35 : 0.18;
  const c1 = "#2F6BFF";
  const c2 = "#5A9EFF";

  return (
    <svg
      viewBox="0 0 900 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <defs>
        <linearGradient id="hvrcai_g" x1="0" y1="0" x2="900" y2="520" gradientUnits="userSpaceOnUse">
          <stop stopColor={c1} stopOpacity={op} />
          <stop offset="0.5" stopColor={c2} stopOpacity={op * 0.55} />
          <stop offset="1" stopColor={c1} stopOpacity={op} />
        </linearGradient>
      </defs>

      {/* H — left bar */}
      <rect x="30" y="60" width="72" height="380" rx="24" fill="url(#hvrcai_g)" />
      {/* H — crossbar */}
      <rect x="30" y="196" width="220" height="72" rx="22" fill="url(#hvrcai_g)" />
      {/* H — right bar */}
      <rect x="178" y="60" width="72" height="380" rx="24" fill="url(#hvrcai_g)" />

      {/* V — left leg */}
      <rect x="298" y="60" width="66" height="310" rx="22" fill="url(#hvrcai_g)"
        transform="rotate(16 298 60)" />
      {/* V — right leg */}
      <rect x="398" y="60" width="66" height="310" rx="22" fill="url(#hvrcai_g)"
        transform="rotate(-16 464 60)" />

      {/* R — vertical bar */}
      <rect x="530" y="60" width="72" height="380" rx="24" fill="url(#hvrcai_g)" />
      {/* R — bowl arc */}
      <path d="M602 60 Q720 60 720 172 Q720 280 602 280 L530 280 L530 60 Z"
        fill="url(#hvrcai_g)" />
      {/* R — bowl cutout */}
      <ellipse cx="648" cy="168" rx="50" ry="56"
        fill={isLight ? "rgba(248,250,252,0.9)" : "rgba(9,9,18,0.9)"} />
      {/* R — diagonal leg */}
      <rect x="595" y="255" width="66" height="210" rx="22" fill="url(#hvrcai_g)"
        transform="rotate(20 628 350)" />

      {/* . dot */}
      <circle cx="762" cy="420" r="30" fill="url(#hvrcai_g)" />

      {/* A — left leg */}
      <rect x="786" y="120" width="62" height="320" rx="22" fill="url(#hvrcai_g)"
        transform="rotate(-14 817 280)" />
      {/* A — right leg */}
      <rect x="842" y="120" width="62" height="320" rx="22" fill="url(#hvrcai_g)"
        transform="rotate(14 873 280)" />
      {/* A — crossbar */}
      <rect x="788" y="280" width="120" height="52" rx="18" fill="url(#hvrcai_g)" />

      {/* I — top serif */}
      <rect x="898" y="80" width="60" height="24" rx="10" fill="url(#hvrcai_g)" />
      {/* I — stem */}
      <rect x="913" y="104" width="30" height="280" rx="14" fill="url(#hvrcai_g)" />
      {/* I — bottom serif */}
      <rect x="898" y="384" width="60" height="24" rx="10" fill="url(#hvrcai_g)" />
    </svg>
  );
}
