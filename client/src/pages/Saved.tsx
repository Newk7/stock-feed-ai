import { useEffect, useState } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import { api } from "../services/api";

export default function Saved() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSavedArticles();
        setArticles(data.articles);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bookmark className="w-6 h-6 text-wire-400" />
        <h1 className="text-2xl font-bold text-white">Saved Articles</h1>
      </div>

      <div className="card">
        {loading ? (
          <div className="p-12 text-center text-surface-500 text-sm">
            Loading saved articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <Bookmark className="w-8 h-8 text-surface-600 mx-auto mb-3" />
            <p className="text-surface-400 text-sm">
              No saved articles yet. Bookmark articles from the news feed to
              save them here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-800/50">
            {articles.map((article: any) => (
              <div
                key={article.id}
                className="p-4 hover:bg-surface-800/30 transition-colors flex items-start gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-surface-200 mb-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-surface-400 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-surface-500">
                      {article.source}
                    </span>
                    {article.tickers?.map((t: string) => (
                      <span
                        key={t}
                        className="text-[9px] font-mono font-bold text-wire-400/70"
                      >
                        ${t}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-500 hover:text-loss transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
