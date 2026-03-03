import { Flame, ArrowUpRight } from "lucide-react";

interface TopStory {
  rank: number;
  title: string;
  source: string;
  tickers: string[];
  time: string;
}

const mockStories: TopStory[] = [
  { rank: 1, title: "AI Infrastructure Spending to Exceed $500B by 2027", source: "Goldman Sachs", tickers: ["NVDA", "MSFT", "GOOGL"], time: "2h" },
  { rank: 2, title: "Fed Minutes Reveal Debate Over Inflation Risks", source: "Reuters", tickers: ["SPY", "TLT"], time: "3h" },
  { rank: 3, title: "Apple Vision Pro Sales Disappoint in Q1", source: "Bloomberg", tickers: ["AAPL"], time: "4h" },
  { rank: 4, title: "Amazon Web Services Growth Reaccelerates to 19%", source: "CNBC", tickers: ["AMZN"], time: "5h" },
  { rank: 5, title: "Bitcoin ETFs See Record Weekly Inflows of $7.5B", source: "CoinDesk", tickers: ["IBIT", "FBTC"], time: "6h" },
  { rank: 6, title: "China Stimulus Package Boosts Emerging Market Sentiment", source: "FT", tickers: ["EEM", "FXI"], time: "7h" },
  { rank: 7, title: "Semiconductor Supply Chain Concerns Resurface", source: "Nikkei", tickers: ["TSM", "ASML"], time: "8h" },
  { rank: 8, title: "Pharma M&A Wave: Pfizer Eyes $10B Deal", source: "WSJ", tickers: ["PFE", "XBI"], time: "9h" },
];

export default function TopStories() {
  return (
    <div className="card">
      <div className="flex items-center gap-2 p-4 border-b border-surface-800">
        <Flame className="w-4 h-4 text-orange-400" />
        <h2 className="section-title">Top Stories</h2>
      </div>

      <div className="divide-y divide-surface-800/50">
        {mockStories.map((story) => (
          <div
            key={story.rank}
            className="flex items-start gap-3 p-3 hover:bg-surface-800/30 transition-colors cursor-pointer group"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-800 text-[10px] font-bold text-surface-400 shrink-0 mt-0.5">
              {story.rank}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-surface-200 leading-snug group-hover:text-wire-300 transition-colors">
                {story.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-surface-500">
                  {story.source}
                </span>
                <span className="text-[10px] text-surface-600">{story.time}</span>
                <div className="flex gap-1">
                  {story.tickers.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-mono font-bold text-wire-400/70"
                    >
                      ${t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
