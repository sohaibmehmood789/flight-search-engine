import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatPrice } from "../../utils/helpers";
import "./PriceGraph.css";

const CustomTooltip = ({ active, payload, priceHistory }) => {
  if (active && payload && payload.length) {
    return (
      <div className="price-tooltip">
        <p className="tooltip-date">{payload[0].payload.fullDate}</p>
        <p className="tooltip-price">
          {formatPrice(payload[0].value)} {priceHistory?.currency || "USD"}
        </p>
      </div>
    );
  }
  return null;
};

const PriceGraph = ({ priceHistory, loading }) => {
  const chartData = useMemo(() => {
    if (!priceHistory || !priceHistory.prices) return [];

    return priceHistory.prices.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: parseFloat(item.price),
      fullDate: item.date,
    }));
  }, [priceHistory]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const prices = chartData.map((item) => item.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { min, max, avg };
  }, [chartData]);

  if (loading) {
    return (
      <div className="price-graph-container">
        <div className="graph-header">
          <h3 className="graph-title">Price Trends</h3>
        </div>
        <div className="graph-loading">
          <div className="loading-spinner"></div>
          <p>Loading price history...</p>
        </div>
      </div>
    );
  }

  if (!priceHistory || chartData.length === 0) {
    return null;
  }

  return (
    <div className="price-graph-container">
      <div className="graph-header">
        <h3 className="graph-title">Price Trends</h3>
        {stats && (
          <div className="price-stats">
            <div className="stat">
              <span className="stat-label">Lowest</span>
              <span className="stat-value stat-low">
                {formatPrice(stats.min)}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Average</span>
              <span className="stat-value">{formatPrice(stats.avg)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Highest</span>
              <span className="stat-value stat-high">
                {formatPrice(stats.max)}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="graph-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: "0.875rem" }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "0.875rem" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#667eea"
              strokeWidth={3}
              fill="url(#colorPrice)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="graph-note">
        💡 Prices are based on historical data and may vary
      </p>
    </div>
  );
};

export default PriceGraph;
