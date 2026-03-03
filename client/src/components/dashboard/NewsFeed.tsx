import { useEffect, useState } from "react";
import {
  Clock,
  ExternalLink,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { api } from "../../services/api";

interface Article {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  sector: string;
  tickers: string[];
  sentiment: string;
  sentiment_score: number;
  published_at: string;
  image_url: string;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "NVIDIA Reports Record Q4 Revenue Driven by AI Chip Demand",
    summary:
      "NVIDIA Corporation reported fourth-quarter revenue of $22.1 billion, up 265% year-over-year, fueled by unprecedented demand for its AI and data center products.",
    source: "Reuters",
    category: "Earnings",
    sector: "Technology",
    tickers: ["NVDA"],
    sentiment: "bullish",
    sentiment_score: 0.89,
    published_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    image_url: "",
  },
  {
    id: "2",
    title: "Federal Reserve Signals Potential Rate Cuts in Second Half of 2025",
    summary:
      "Fed Chair Jerome Powell indicated the central bank is nearing confidence that inflation is moving sustainably toward the 2% target.",
    source: "Bloomberg",
    category: "Macro",
    sector: "Financials",
    tickers: ["SPY", "TLT"],
    sentiment: "bullish",
    sentiment_score: 0.72,
    published_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    image_url: "",
  },
  {
    id: "3",
    title: "Tesla Faces Increased Competition as Chinese EV Makers Expand Globally",
    summary:
      "BYD and NIO are accelerating international expansion plans, putting pressure on Tesla's market share in key European and Asian markets.",
    source: "Financial Times",
    category: "Analysis",
    sector: "Consumer Discretionary",
    tickers: ["TSLA", "NIO"],
    sentiment: "bearish",
    sentiment_score: -0.45,
    published_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    image_url: "",
  },
  {
    id: "4",
    title: "Healthcare Sector Rally Led by Biotech M&A Surge",
    summary:
      "Major pharmaceutical companies are actively pursuing acquisitions of smaller biotech firms, driving sector-wide gains.",
    source: "MarketWatch",
    category: "Sector Update",
    sector: "Healthcare",
    tickers: ["XBI", "IBB"],
    sentiment: "bullish",
    sentiment_score: 0.65,
    published_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    image_url: "",
  },
  {
    id: "5",
    title: "Oil Prices Climb on Middle East Supply Concerns",
    summary:
      "Crude oil futures rose 2.3% as geopolitical tensions in the Middle East raised concerns about potential supply disruptions.",
    source: "CNBC",
    category: "Commodities",
    sector: "Energy",
    tickers: ["USO", "XLE"],
    sentiment: "neutral",
    sentiment_score: 0.15,
    published_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    image_url: "",
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function SentimentIcon({ sentiment }: { sentiment: string }) {
  if (sentiment === "bullish")
    return <TrendingUp className="w-3.5 h-3.5 text-gain" />;
  if (sentiment === "bearish")
    return <TrendingDown className="w-3.5 h-3.5 text-loss" />;
  return <Minus className="w-3.5 h-3.5 text-surface-500" />;
}

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await api.getTrendingNews(20);
        if (data.articles.length > 0) setArticles(data.articles);
      } catch {
        // Fall back to mock data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between p-4 border-b border-surface-800">
        <h2 className="section-title">Latest News</h2>
        <a
          href="/news"
          className="text-xs text-wire-400 hover:text-wire-300 font-medium"
        >
          See all news
        </a>
      </div>

      <div className="divide-y divide-surface-800/50">
        {articles.map((article) => (
          <article
            key={article.id}
            className="p-4 hover:bg-surface-800/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                {/* Meta row */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-medium text-wire-400 bg-wire-600/10 px-1.5 py-0.5 rounded">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-surface-500">
                    {article.source}
                  </span>
                  <span className="text-[10px] text-surface-600 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {timeAgo(article.published_at)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-surface-100 leading-snug mb-1 group-hover:text-wire-300 transition-colors">
                  {article.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-surface-400 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                {/* Bottom row */}
                <div className="flex items-center gap-3 mt-2">
                  {/* Tickers */}
                  <div className="flex gap-1">
                    {article.tickers.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono font-bold text-wire-300 bg-surface-800 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Sentiment */}
                  <div className="flex items-center gap-1">
                    <SentimentIcon sentiment={article.sentiment} />
                    <span
                      className={`text-[10px] font-medium capitalize ${
                        article.sentiment === "bullish"
                          ? "text-gain"
                          : article.sentiment === "bearish"
                          ? "text-loss"
                          : "text-surface-500"
                      }`}
                    >
                      {article.sentiment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-500 hover:text-surface-300">
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-500 hover:text-surface-300">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {loading && (
        <div className="p-4 text-center text-xs text-surface-500">
          Loading articles...
        </div>
      )}
    </div>
  );
}
