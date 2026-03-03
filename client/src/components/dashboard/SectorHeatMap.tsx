interface SectorData {
  name: string;
  change: number;
  marketCap: number;
}

const mockSectors: SectorData[] = [
  { name: "Technology", change: 1.24, marketCap: 15.2 },
  { name: "Healthcare", change: -0.45, marketCap: 7.8 },
  { name: "Financials", change: 0.87, marketCap: 9.1 },
  { name: "Consumer Discretionary", change: -1.12, marketCap: 6.3 },
  { name: "Communication", change: 0.56, marketCap: 5.4 },
  { name: "Industrials", change: 0.23, marketCap: 5.9 },
  { name: "Consumer Staples", change: -0.18, marketCap: 4.1 },
  { name: "Energy", change: 2.34, marketCap: 4.5 },
  { name: "Utilities", change: 0.12, marketCap: 1.8 },
  { name: "Real Estate", change: -0.67, marketCap: 1.5 },
  { name: "Materials", change: 0.89, marketCap: 2.1 },
];

function getHeatColor(change: number): string {
  const intensity = Math.min(Math.abs(change) / 3, 1);
  if (change > 0) {
    const r = Math.round(5 + (16 - 5) * (1 - intensity));
    const g = Math.round(46 + (185 - 46) * intensity);
    const b = Math.round(22 + (30 - 22) * (1 - intensity));
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const r = Math.round(69 + (239 - 69) * intensity);
    const g = Math.round(10 + (68 - 10) * (1 - intensity));
    const b = Math.round(10 + (68 - 10) * (1 - intensity));
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export default function SectorHeatMap() {
  const totalMarketCap = mockSectors.reduce((s, d) => s + d.marketCap, 0);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Sector Heat Map</h2>
        <span className="text-xs text-surface-500">Sized by market cap</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {mockSectors
          .sort((a, b) => b.marketCap - a.marketCap)
          .map((sector) => {
            const widthPct = (sector.marketCap / totalMarketCap) * 100;
            const isPositive = sector.change >= 0;

            return (
              <div
                key={sector.name}
                className="rounded-lg p-3 flex flex-col justify-between cursor-pointer
                           hover:ring-1 hover:ring-white/20 transition-all"
                style={{
                  backgroundColor: getHeatColor(sector.change),
                  width: `calc(${Math.max(widthPct, 8)}% - 4px)`,
                  minHeight: widthPct > 12 ? "80px" : "60px",
                }}
              >
                <span className="text-[10px] font-medium text-white/80 leading-tight">
                  {sector.name}
                </span>
                <span className={`text-sm font-bold font-mono ${isPositive ? "text-white" : "text-white"}`}>
                  {isPositive ? "+" : ""}{sector.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-surface-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: getHeatColor(-2) }} />
          <span>Strong Loss</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: getHeatColor(-0.5) }} />
          <span>Loss</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded-sm bg-surface-700" />
          <span>Flat</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: getHeatColor(0.5) }} />
          <span>Gain</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: getHeatColor(2) }} />
          <span>Strong Gain</span>
        </div>
      </div>
    </div>
  );
}
