interface BreadthItem {
  label: string;
  positive: number;
  negative: number;
}

const mockBreadth: BreadthItem[] = [
  { label: "Advancing / Declining", positive: 287, negative: 213 },
  { label: "New High / New Low", positive: 42, negative: 18 },
  { label: "Above SMA50", positive: 312, negative: 188 },
  { label: "Above SMA200", positive: 345, negative: 155 },
];

export default function MarketBreadth() {
  return (
    <div className="card p-4">
      <h2 className="section-title mb-3">Market Breadth</h2>
      <div className="space-y-3">
        {mockBreadth.map((item) => {
          const total = item.positive + item.negative;
          const positivePct = (item.positive / total) * 100;

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-surface-400">{item.label}</span>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-gain">{item.positive}</span>
                  <span className="text-surface-600">/</span>
                  <span className="text-loss">{item.negative}</span>
                </div>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-surface-800">
                <div
                  className="bg-gain/70 rounded-l-full transition-all"
                  style={{ width: `${positivePct}%` }}
                />
                <div
                  className="bg-loss/70 rounded-r-full transition-all"
                  style={{ width: `${100 - positivePct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
