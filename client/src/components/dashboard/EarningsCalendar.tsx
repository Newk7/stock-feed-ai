interface EarningsEntry {
  symbol: string;
  company: string;
  date: string;
  time: string;
  epsEstimate: string;
  epsActual?: string;
  revenue: string;
}

const mockEarnings: EarningsEntry[] = [
  { symbol: "CRM", company: "Salesforce", date: "Feb 26", time: "AMC", epsEstimate: "$2.26", revenue: "$9.22B" },
  { symbol: "COST", company: "Costco", date: "Feb 27", time: "AMC", epsEstimate: "$3.78", revenue: "$60.1B" },
  { symbol: "DELL", company: "Dell Technologies", date: "Feb 27", time: "AMC", epsEstimate: "$2.52", revenue: "$24.6B" },
  { symbol: "ZS", company: "Zscaler", date: "Feb 27", time: "AMC", epsEstimate: "$0.68", revenue: "$606M" },
  { symbol: "HPQ", company: "HP Inc", date: "Feb 28", time: "AMC", epsEstimate: "$0.83", revenue: "$13.8B" },
  { symbol: "OKTA", company: "Okta Inc", date: "Mar 4", time: "AMC", epsEstimate: "$0.71", revenue: "$680M" },
];

export default function EarningsCalendar() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title">Upcoming Earnings</h2>
        <span className="text-xs text-surface-500">This Week</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[10px] text-surface-500 uppercase tracking-wider border-b border-surface-800">
              <th className="text-left py-2 font-medium">Symbol</th>
              <th className="text-left py-2 font-medium">Company</th>
              <th className="text-left py-2 font-medium">Date</th>
              <th className="text-right py-2 font-medium">EPS Est.</th>
              <th className="text-right py-2 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/50">
            {mockEarnings.map((e) => (
              <tr
                key={e.symbol}
                className="hover:bg-surface-800/30 transition-colors cursor-pointer"
              >
                <td className="py-2">
                  <span className="font-mono font-bold text-wire-300">
                    {e.symbol}
                  </span>
                </td>
                <td className="py-2 text-surface-300">{e.company}</td>
                <td className="py-2 text-surface-400">
                  {e.date}{" "}
                  <span className="text-surface-600">{e.time}</span>
                </td>
                <td className="py-2 text-right font-mono text-surface-200">
                  {e.epsEstimate}
                </td>
                <td className="py-2 text-right font-mono text-surface-300">
                  {e.revenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
