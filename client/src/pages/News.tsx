import { useEffect, useState } from "react";
import {
  Clock,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Bookmark,
} from "lucide-react";
import { api } from "../services/api";

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
}

const categories = [
  "All",
  "Earnings",
  "Macro",
  "Analysis",
  "Sector Update",
  "Commodities",
  "Tech",
  "IPO",
];

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params: Record<string, string> = { limit: "50" };
        if (selectedCategory !== "All") params.category = selectedCategory;
        const data = await api.getNews(params);
        setArticles(data.articles);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCategory]);

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">News Feed</h1>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-surface-400" />
          <span className="text-sm text-surface-400">Filter by:</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
              ${
                selectedCategory === cat
                  ? "bg-wire-600/20 text-wire-400 border border-wire-600/20"
                  : "text-surface-400 hover:bg-surface-800 hover:text-surface-200 border border-transparent"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles list */}
      <div className="card divide-y divide-surface-800/50">
        {loading ? (
          <div className="p-12 text-center text-surface-500 text-sm">
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-surface-500 text-sm">
            No articles found. Sync manifests from S3 to populate data.
          </div>
        ) : (
          articles.map((article) => (
            <article
              key={article.id}
              className="p-5 hover:bg-surface-800/30 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium text-wire-400 bg-wire-600/10 px-1.5 py-0.5 rounded">
                  {article.category}
                </span>
                {article.sector && (
                  <span className="text-[10px] text-surface-500 bg-surface-800 px-1.5 py-0.5 rounded">
                    {article.sector}
                  </span>
                )}
                <span className="text-[10px] text-surface-500">
                  {article.source}
                </span>
                <span className="text-[10px] text-surface-600 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {timeAgo(article.published_at)}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  {article.sentiment === "bullish" && (
                    <TrendingUp className="w-3.5 h-3.5 text-gain" />
                  )}
                  {article.sentiment === "bearish" && (
                    <TrendingDown className="w-3.5 h-3.5 text-loss" />
                  )}
                  {article.sentiment === "neutral" && (
                    <Minus className="w-3.5 h-3.5 text-surface-500" />
                  )}
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

              <h2 className="text-base font-semibold text-surface-100 mb-1.5 group-hover:text-wire-300 transition-colors">
                {article.title}
              </h2>
              <p className="text-sm text-surface-400 line-clamp-2 mb-2">
                {article.summary}
              </p>

              <div className="flex items-center gap-2">
                {article.tickers?.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono font-bold text-wire-300 bg-surface-800 px-1.5 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
                <button className="ml-auto p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-surface-700 text-surface-500 hover:text-surface-300 transition-all">
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
