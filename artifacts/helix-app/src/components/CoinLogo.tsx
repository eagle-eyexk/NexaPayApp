interface CoinLogoProps {
  currency: string;
  size?: number;
  className?: string;
}

const COIN_CONFIG: Record<string, { bg: string; fg: string; symbol: string; gradient?: [string, string] }> = {
  BTC: { bg: "#F7931A", fg: "#ffffff", symbol: "₿", gradient: ["#F7931A", "#FF6B00"] },
  ETH: { bg: "#627EEA", fg: "#ffffff", symbol: "Ξ", gradient: ["#627EEA", "#4C3CCE"] },
  SOL: { bg: "#9945FF", fg: "#ffffff", symbol: "◎", gradient: ["#9945FF", "#14F195"] },
  USDC: { bg: "#2775CA", fg: "#ffffff", symbol: "$", gradient: ["#2775CA", "#1A56A0"] },
  USDT: { bg: "#26A17B", fg: "#ffffff", symbol: "₮", gradient: ["#26A17B", "#1A7A5C"] },
  USD: { bg: "#22C55E", fg: "#ffffff", symbol: "$", gradient: ["#22C55E", "#16A34A"] },
  MATIC: { bg: "#8247E5", fg: "#ffffff", symbol: "⬡", gradient: ["#8247E5", "#5E30B5"] },
  AVAX: { bg: "#E84142", fg: "#ffffff", symbol: "A", gradient: ["#E84142", "#C01F20"] },
  ARB: { bg: "#28A0F0", fg: "#ffffff", symbol: "◈", gradient: ["#28A0F0", "#1A7ABD"] },
  BNB: { bg: "#F3BA2F", fg: "#ffffff", symbol: "Ƀ", gradient: ["#F3BA2F", "#D4991A"] },
};

export default function CoinLogo({ currency, size = 36, className = "" }: CoinLogoProps) {
  const config = COIN_CONFIG[currency] ?? { bg: "#6366F1", fg: "#ffffff", symbol: currency[0], gradient: ["#6366F1", "#4F46E5"] };
  const id = `coin-grad-${currency}-${size}`;
  const r = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.gradient?.[0] ?? config.bg} />
          <stop offset="100%" stopColor={config.gradient?.[1] ?? config.bg} />
        </linearGradient>
        <filter id={`shadow-${currency}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor={config.bg} floodOpacity="0.35" />
        </filter>
      </defs>
      <circle cx={r} cy={r} r={r} fill={`url(#${id})`} filter={`url(#shadow-${currency})`} />
      <text
        x={r}
        y={r}
        textAnchor="middle"
        dominantBaseline="central"
        fill={config.fg}
        fontSize={size * 0.42}
        fontWeight="700"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        {config.symbol}
      </text>
    </svg>
  );
}

export function CoinLogoEth({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id="eth-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#627EEA" />
          <stop offset="100%" stopColor="#4C3CCE" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill="url(#eth-g)" />
      <polygon points="18,6 11,18 18,22 25,18" fill="rgba(255,255,255,0.9)" />
      <polygon points="18,22 11,18 18,30 25,18" fill="rgba(255,255,255,0.6)" />
    </svg>
  );
}

export const COIN_PRICES: Record<string, number> = {
  BTC: 97240,
  ETH: 3480,
  SOL: 165,
  USDC: 1,
  USDT: 1,
  USD: 1,
  MATIC: 0.52,
  AVAX: 38.4,
  ARB: 1.12,
};

export const COIN_SPARKLINES: Record<string, number[]> = {
  BTC: [91200, 93800, 95100, 94200, 96500, 95800, 97240],
  ETH: [3180, 3290, 3410, 3380, 3450, 3490, 3480],
  SOL: [148, 155, 162, 158, 167, 163, 165],
  USDC: [1, 1, 1, 1, 1, 1, 1],
  USDT: [1, 1, 1, 1, 1, 1, 1],
  USD: [1, 1, 1, 1, 1, 1, 1],
  MATIC: [0.48, 0.51, 0.50, 0.53, 0.52, 0.51, 0.52],
  AVAX: [35.1, 36.8, 37.9, 37.2, 38.8, 38.1, 38.4],
  ARB: [1.05, 1.09, 1.11, 1.08, 1.13, 1.10, 1.12],
};
