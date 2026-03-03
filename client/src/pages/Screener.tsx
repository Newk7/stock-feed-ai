import { useState } from "react";
import { Grid3x3, Search, SlidersHorizontal } from "lucide-react";

const mockScreenerResults = [
  { symbol: "NVDA", company: "NVIDIA Corp", sector: "Technology", marketCap: "$2.1T", pe: "65.4", price: "$875.28", change: 1.44, volume: "52.3M" },
  { symbol: "AAPL", company: "Apple Inc", sector: "Technology", marketCap: "$2.9T", pe: "28.7", price: "$189.12", change: 1.25, volume: "41.2M" },
  { symbol: "MSFT", company: "Microsoft Corp", sector: "Technology", marketCap: "$3.1T", pe: "36.2", price: "$415.67", change: -0.77, volume: "22.1M" },
  { symbol: "AMZN", company: "Amazon.com Inc", sector: "Consumer Discretionary", marketCap: "$1.8T", pe: "58.3", price: "$178.92", change: 0.69, volume: "35.8M" },
  { symbol: "GOOGL", company: "Alphabet Inc", sector: "Communication", marketCap: "$1.9T", pe: "24.1", price: "$148.56", change: 0.60, volume: "25.6M" },
  { symbol: "META", company: "Meta Platforms", sector: "Communication", marketCap: "$1.3T", pe: "28.9", price: "$502.34", change: 1.78, volume: "18.4M" },
  { symbol: "TSLA", company: "Tesla Inc", sector: "Consumer Discretionary", marketCap: "$650B", pe: "48.5", price: "$205.45", change: -2.69, volume: "89.1M" },
  { symbol: "AMD", company: "AMD Inc", sector: "Technology", marketCap: "$285B", pe: "45.2", price: "$178.34", change: -1.18, volume: "44.3M" },
  { symbol: "PLTR", company: "Palantir Technologies", sector: "Technology", marketCap: "$52B", pe: "220.5", price: "$24.56", change: 8.34, volume: "112.4M" },
  { symbol: "CRM", company: "Salesforce Inc", sector: "Technology", marketCap: "$270B", pe: "52.3", price: "$278.45", change: 0.92, volume: "7.8M" },
];

export default function Screener() {
  const [search, setSearch] = useState("");

  const filtered = mockScreenerResults.filter(
    (r) =>
      r.symbol.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Grid3x3 className="w-6 h-6 text-wire-400" />
        <h1 className="text-2xl font-bold text-white">Stock Screener</h1>
      </div>

      {/* Filters bar */}
      <div className="card p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticker or company..."
              className="input pl-10"
            />
          </div>
          {["Sector", "Market Cap", "P/E Range", "Volume"].map((filter) => (
            <button
              key={filter}
              className="btn-secondary text-xs gap-1.5"
            >
              <SlidersHorizontal className="w-3 h-3" />
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-surface-500 uppercase tracking-wider border-b border-surface-800 bg-surface-900/50">
                <th className="text-left px-4 py-3 font-medium">Symbol</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Sector</th>
                <th className="text-right px-4 py-3 font-medium">Mkt Cap</th>
                <th className="text-right px-4 py-3 font-medium">P/E</th>
                <th className="text-right px-4 py-3 font-medium">Price</th>
                <th className="text-right px-4 py-3 font-medium">Change %</th>
                <th className="text-right px-4 py-3 font-medium">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-800/50">
              {filtered.map((stock) => {
                const isPositive = stock.change >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-surface-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-wire-300">
                        {stock.symbol}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-300">
                      {stock.company}
                    </td>
                    <td className="px-4 py-3 text-surface-400 text-xs">
                      {stock.sector}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-surface-300">
                      {stock.marketCap}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-surface-300">
                      {stock.pe}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-surface-200">
                      ${stock.price}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-mono font-medium ${
                        isPositive ? "text-gain" : "text-loss"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {stock.change.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-surface-400 text-xs">
                      {stock.volume}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
