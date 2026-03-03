import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { api } from "../services/api";

interface SectorGroup {
  sector: string;
  articles: any[];
}

const mockSectorPerformance = [
  { name: "Technology", change: 1.24, companies: 485 },
  { name: "Healthcare", change: -0.45, companies: 392 },
  { name: "Financials", change: 0.87, companies: 517 },
  { name: "Consumer Discretionary", change: -1.12, companies: 248 },
  { name: "Communication Services", change: 0.56, companies: 112 },
  { name: "Industrials", change: 0.23, companies: 301 },
  { name: "Consumer Staples", change: -0.18, companies: 156 },
  { name: "Energy", change: 2.34, companies: 178 },
  { name: "Utilities", change: 0.12, companies: 98 },
  { name: "Real Estate", change: -0.67, companies: 145 },
  { name: "Materials", change: 0.89, companies: 121 },
];

export default function Sectors() {
  const [sectorNews, setSectorNews] = useState<SectorGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getNewsBySector();
        setSectorNews(data.sectors);
      } catch {
        setSectorNews([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-wire-400" />
        <h1 className="text-2xl font-bold text-white">Sector Performance</h1>
      </div>

      {/* Sector performance bars */}
      <div className="card p-4">
        <div className="space-y-2">
          {mockSectorPerformance
            .sort((a, b) => b.change - a.change)
            .map((sector) => {
              const isPositive = sector.change >= 0;
              const barWidth = Math.min(Math.abs(sector.change) * 20, 100);
              return (
                <div
                  key={sector.name}
                  className="flex items-center gap-4 py-2 hover:bg-surface-800/30 rounded-lg px-3 cursor-pointer transition-colors"
                >
                  <span className="text-sm font-medium text-surface-200 w-56 shrink-0">
                    {sector.name}
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-5 bg-surface-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isPositive ? "bg-gain/60" : "bg-loss/60"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                  <div className={`text-sm font-mono font-medium w-20 text-right flex items-center justify-end gap-1 ${isPositive ? "text-gain" : "text-loss"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? "+" : ""}{sector.change.toFixed(2)}%
                  </div>
                  <span className="text-xs text-surface-500 w-16 text-right">
                    {sector.companies} cos.
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Sector news */}
      {sectorNews.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-surface-200">
            Sector News
          </h2>
          {sectorNews.map((group) => (
            <div key={group.sector} className="card p-4">
              <h3 className="text-sm font-semibold text-wire-400 mb-3">
                {group.sector}
              </h3>
              <div className="space-y-2">
                {group.articles.slice(0, 5).map((article: any, i: number) => (
                  <div
                    key={i}
                    className="text-xs text-surface-300 hover:text-wire-300 cursor-pointer transition-colors"
                  >
                    {article.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center text-surface-500 text-sm py-8">
          Loading sector data...
        </div>
      )}
    </div>
  );
}
