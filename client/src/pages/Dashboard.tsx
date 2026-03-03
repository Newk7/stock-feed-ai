import MarketIndices from "../components/dashboard/MarketIndices";
import SectorHeatMap from "../components/dashboard/SectorHeatMap";
import NewsFeed from "../components/dashboard/NewsFeed";
import TrendingTickers from "../components/dashboard/TrendingTickers";
import TopStories from "../components/dashboard/TopStories";
import MarketBreadth from "../components/dashboard/MarketBreadth";
import EarningsCalendar from "../components/dashboard/EarningsCalendar";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Market indices bar */}
      <MarketIndices />

      {/* Main grid: news + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: news feed */}
        <div className="xl:col-span-2 space-y-6">
          <SectorHeatMap />
          <NewsFeed />
          <TrendingTickers />
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <MarketBreadth />
          <TopStories />
          <EarningsCalendar />
        </div>
      </div>
    </div>
  );
}
