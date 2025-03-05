import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download, Info, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  generatePredictionData,
  getModelContributions,
} from "../../lib/predictionModels";
import { fetchHistoricalPrices } from "../../lib/api";

interface PredictionData {
  date: string;
  actual: number;
  predicted: number;
  upperBound: number;
  lowerBound: number;
}

interface PredictionChartProps {
  data?: PredictionData[];
  currency?: "BTC" | "ETH";
  timeframe?: "1d" | "7d" | "30d";
  isLoading?: boolean;
  useSentimentAnalysis?: boolean;
  sentimentImpact?: number;
}

// Using the ensemble model from predictionModels.ts instead of this function

const PredictionChart: React.FC<PredictionChartProps> = ({
  data,
  currency = "BTC",
  timeframe = "7d",
  isLoading = false,
  useSentimentAnalysis = false,
  sentimentImpact = 1,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showModels, setShowModels] = useState(false);

  // Get model contributions for the pie chart
  const modelContributions = getModelContributions();

  const [chartData, setChartData] = useState<PredictionData[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch historical data and generate predictions
  useEffect(() => {
    if (data) {
      setChartData(data);
    } else {
      fetchDataAndPredict();
    }
  }, [data, currency, timeframe]);

  // Function to fetch historical data and generate predictions
  const fetchDataAndPredict = async () => {
    try {
      setFetchError(null);
      // Fetch historical prices for the selected currency
      const historyDays = timeframe === "1d" ? 7 : timeframe === "7d" ? 14 : 30;
      const historicalData = await fetchHistoricalPrices(currency, historyDays);

      if (historicalData.length === 0) {
        throw new Error("No historical data available");
      }

      // Get the current price from the most recent data point
      const currentPrice = historicalData[historicalData.length - 1].price;

      // Generate prediction data using the ensemble model
      const predictionData = generatePredictionData(
        historyDays,
        currentPrice,
        currency,
        timeframe,
        useSentimentAnalysis,
        sentimentImpact,
      );

      setChartData(predictionData);
    } catch (error) {
      console.error("Error fetching data for predictions:", error);
      setFetchError("Failed to fetch data for predictions");

      // Fallback to mock data
      const mockData = generatePredictionData(
        timeframe === "1d" ? 7 : timeframe === "7d" ? 14 : 30,
        currency === "BTC" ? 65000 : 3500,
        currency,
        timeframe,
        useSentimentAnalysis,
        sentimentImpact,
      );

      setChartData(mockData);
    }
  };

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Find today's index to separate historical from prediction
  const today = new Date().toISOString().split("T")[0];
  const todayIndex = chartData.findIndex((item) => item.date === today);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  // Function to export predictions to CSV
  const exportPredictionsToCSV = () => {
    if (chartData.length === 0) {
      alert("No prediction data to export");
      return;
    }

    // Create CSV content
    const headers =
      "Date,Actual Price,Predicted Price,Lower Bound,Upper Bound\n";
    const csvContent =
      headers +
      chartData
        .map(
          (row) =>
            `${row.date},${row.actual || ""},${row.predicted || ""},${row.lowerBound || ""},${row.upperBound || ""}`,
        )
        .join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${currency}_predictions_${timeframe}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full h-full bg-white dark:bg-gray-800 shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {currency} Price Prediction
            </h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Showing {timeframe} price prediction with confidence
                    intervals using ensemble learning
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModels(!showModels)}
            >
              {showModels ? "Hide Models" : "Show Models"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportPredictionsToCSV}
            >
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4 mr-1" /> Zoom Out
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : fetchError ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="text-red-500 text-center">
              <p className="mb-2">{fetchError}</p>
              <Button variant="outline" size="sm" onClick={fetchDataAndPredict}>
                Try Again
              </Button>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-center">
              <p className="mb-2">Generating predictions...</p>
            </div>
          </div>
        ) : (
          <div style={{ height: 300 * zoomLevel }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
              >
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="colorPredicted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="colorConfidence"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), ""]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />

                {/* Confidence interval area */}
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="none"
                  fillOpacity={1}
                  fill="url(#colorConfidence)"
                />

                {/* Actual price line */}
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorActual)"
                  fillOpacity={0.3}
                />

                {/* Predicted price line */}
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray={todayIndex > -1 ? "0" : "5 5"}
                  fill="url(#colorPredicted)"
                  fillOpacity={0.3}
                />

                {/* Reference line for today */}
                {todayIndex > -1 && (
                  <ReferenceLine
                    x={chartData[todayIndex].date}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                    label={{
                      value: "Today",
                      position: "insideTopRight",
                      fill: "#6b7280",
                      fontSize: 12,
                    }}
                  />
                )}

                <Brush
                  dataKey="date"
                  height={30}
                  stroke="#8884d8"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex flex-col mt-4">
          <div className="flex justify-center gap-6 mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Historical Price</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Predicted Price</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-200 mr-2"></div>
              <span className="text-sm">Confidence Interval</span>
            </div>
          </div>

          {showModels && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2 text-center">
                Ensemble Model Contributions
              </h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelContributions}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="weight"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {modelContributions.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Predictions are generated using an ensemble of Transformer,
                Random Forest, XGBoost, VADER Sentiment, and BERT models
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionChart;
