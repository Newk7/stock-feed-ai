import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerData {
  symbol: string;
  name: string;
  price: string;
  change: number;
  changePercent: number;
  volume: string;
  signal?: string;
}

const mockTrending: TickerData[] = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: "875.28", change: 12.45, changePercent: 1.44, volume: "52.3M", signal: "New High" },
  { symbol: "AAPL", name: "Apple Inc", price: "189.12", change: 2.34, changePercent: 1.25, volume: "41.2M" },
  { symbol: "MSFT", name: "Microsoft", price: "415.67", change: -3.21, changePercent: -0.77, volume: "22.1M" },
  { symbol: "META", name: "Meta Platforms", price: "502.34", change: 8.76, changePercent: 1.78, volume: "18.4M", signal: "Overbought" },
  { symbol: "AMZN", name: "Amazon.com", price: "178.92", change: 1.23, changePercent: 0.69, volume: "35.8M" },
  { symbol: "TSLA", name: "Tesla Inc", price: "205.45", change: -5.67, changePercent: -2.69, volume: "89.1M", signal: "High Volume" },
  { symbol: "GOOGL", name: "Alphabet", price: "148.56", change: 0.89, changePercent: 0.60, volume: "25.6M" },
  { symbol: "AMD", name: "AMD Inc", price: "178.34", change: -2.12, changePercent: -1.18, volume: "44.3M" },
];

const mockActive: TickerData[] = [
  { symbol: "PLTR", name: "Palantir", price: "24.56", change: 1.89, changePercent: 8.34, volume: "112.4M", signal: "Unusual Volume" },
  { symbol: "SOFI", name: "SoFi Tech", price: "9.87", change: 0.45, changePercent: 4.77, volume: "98.2M" },
  { symbol: "NIO", name: "NIO Inc", price: "7.23", change: -0.34, changePercent: -4.49, volume: "87.6M" },
  { symbol: "RIVN", name: "Rivian", price: "18.45", change: 0.78, changePercent: 4.41, volume: "76.3M" },
  { symbol: "MARA", name: "Marathon Digital", price: "22.78", change: 2.34, changePercent: 11.45, volume: "65.4M", signal: "Top Gainer" },
];

function TickerTable({ title, data }: { title: string; data: TickerData[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-surface-300 mb-3">{title}</h3>
      <div className="space-y-0.5">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-medium text-surface-500 uppercase tracking-wider">
          <div className="col-span-4">Ticker</div>
          <div className="col-span-2 text-right">Price</div>
          <div className="col-span-2 text-right">Change</div>
          <div className="col-span-2 text-right">Volume</div>
          <div className="col-span-2 text-right">Signal</div>
        </div>

        {data.map((ticker) => {
          const isPositive = ticker.change >= 0;
          return (
            <div
              key={ticker.symbol}
              className="grid grid-cols-12 gap-2 px-3 py-2 rounded-lg hover:bg-surface-800/50 cursor-pointer transition-colors items-center"
            >
              <div className="col-span-4 flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-wire-300">
                  {ticker.symbol}
                </span>
                <span className="text-[10px] text-surface-500 truncate hidden xl:block">
                  {ticker.name}
                </span>
              </div>
              <div className="col-span-2 text-right text-xs font-mono text-surface-200">
                ${ticker.price}
              </div>
              <div className={`col-span-2 text-right text-xs font-mono font-medium flex items-center justify-end gap-1 ${isPositive ? "text-gain" : "text-loss"}`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isPositive ? "+" : ""}{ticker.changePercent.toFixed(2)}%
              </div>
              <div className="col-span-2 text-right text-[10px] font-mono text-surface-400">
                {ticker.volume}
              </div>
              <div className="col-span-2 text-right">
                {ticker.signal && (
                  <span className="text-[9px] font-medium bg-surface-800 text-surface-300 px-1.5 py-0.5 rounded">
                    {ticker.signal}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrendingTickers() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Trending & Most Active</h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TickerTable title="Trending" data={mockTrending} />
        <TickerTable title="Most Active" data={mockActive} />
      </div>
    </div>
  );
}
