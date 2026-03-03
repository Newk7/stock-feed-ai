import { TrendingUp, TrendingDown } from "lucide-react";

interface IndexData {
  symbol: string;
  name: string;
  price: string;
  change: number;
  changePercent: number;
}

const mockIndices: IndexData[] = [
  { symbol: "SPX", name: "S&P 500", price: "6,012.45", change: 24.67, changePercent: 0.41 },
  { symbol: "DJI", name: "Dow Jones", price: "44,893.12", change: 138.42, changePercent: 0.31 },
  { symbol: "IXIC", name: "NASDAQ", price: "19,456.78", change: -35.21, changePercent: -0.18 },
  { symbol: "RUT", name: "Russell 2000", price: "2,287.34", change: 12.56, changePercent: 0.55 },
  { symbol: "VIX", name: "VIX", price: "14.23", change: -0.87, changePercent: -5.76 },
];

export default function MarketIndices() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Market Overview</h2>
        <div className="flex gap-1">
          {["1D", "5D", "1M", "YTD"].map((period) => (
            <button
              key={period}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-colors
                ${period === "1D"
                  ? "bg-wire-600/20 text-wire-400"
                  : "text-surface-500 hover:text-surface-300 hover:bg-surface-800"
                }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {mockIndices.map((idx) => {
          const isPositive = idx.change >= 0;
          return (
            <div
              key={idx.symbol}
              className={`p-3 rounded-lg border transition-all cursor-pointer hover:scale-[1.02]
                ${isPositive
                  ? "bg-gain-bg/30 border-gain/10 hover:border-gain/30"
                  : "bg-loss-bg/30 border-loss/10 hover:border-loss/30"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-surface-300">{idx.symbol}</span>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 text-gain" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-loss" />
                )}
              </div>
              <div className="text-sm font-semibold text-surface-100 font-mono">{idx.price}</div>
              <div className={`text-xs font-mono font-medium mt-0.5 ${isPositive ? "text-gain" : "text-loss"}`}>
                {isPositive ? "+" : ""}{idx.change.toFixed(2)} ({isPositive ? "+" : ""}{idx.changePercent.toFixed(2)}%)
              </div>
              <div className="text-[10px] text-surface-500 mt-1">{idx.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
