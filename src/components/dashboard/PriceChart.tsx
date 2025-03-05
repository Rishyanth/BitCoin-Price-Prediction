import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  RefreshCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { fetchHistoricalPrices } from "../../lib/api";

interface PriceData {
  date: string;
  btcPrice: number;
  ethPrice: number;
  btcVolume?: number;
  ethVolume?: number;
}

interface PriceChartProps {
  data?: PriceData[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onDateRangeChange?: (range: string) => void;
  onCurrencyChange?: (currency: string) => void;
}

// Now using fetchHistoricalPrices from api.ts instead of generating mock data

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  isLoading = false,
  onRefresh = () => {},
  onDateRangeChange = () => {},
  onCurrencyChange = () => {},
}) => {
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("BTC");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Fetch historical price data when component mounts or when dependencies change
  useEffect(() => {
    if (data) {
      setChartData(data);
    } else {
      fetchHistoricalData();
    }
  }, [data, selectedCurrency, dateRange]);

  // Function to fetch historical price data
  const fetchHistoricalData = async () => {
    try {
      setFetchError(null);
      const days = dateRange === "7d" ? 7 : dateRange === "14d" ? 14 : 30;

      // Fetch BTC data
      const btcData = await fetchHistoricalPrices("BTC", days);

      // If ETH is selected or both are selected, fetch ETH data
      let ethData: any[] = [];
      if (selectedCurrency === "ETH" || selectedCurrency === "BOTH") {
        ethData = await fetchHistoricalPrices("ETH", days);
      }

      // Combine the data
      const combinedData = btcData.map((btcItem) => {
        const ethItem = ethData.find((e) => e.date === btcItem.date);
        return {
          date: btcItem.date,
          btcPrice: btcItem.price,
          ethPrice: ethItem ? ethItem.price : 0,
          btcVolume: btcItem.volume,
          ethVolume: ethItem ? ethItem.volume : 0,
        };
      });

      setChartData(combinedData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setFetchError("Failed to fetch historical price data");

      // Fallback to mock data if API fails
      const days = dateRange === "7d" ? 7 : dateRange === "14d" ? 14 : 30;
      const mockData = [];
      const today = new Date();
      let btcPrice = 65000;
      let ethPrice = 3500;

      for (let i = days; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Add some random fluctuation
        btcPrice = btcPrice * (1 + (Math.random() - 0.5) * 0.03);
        ethPrice = ethPrice * (1 + (Math.random() - 0.5) * 0.04);

        mockData.push({
          date: date.toISOString().split("T")[0],
          btcPrice: btcPrice,
          ethPrice: ethPrice,
          btcVolume: Math.floor(Math.random() * 10000) + 20000,
          ethVolume: Math.floor(Math.random() * 20000) + 10000,
        });
      }

      setChartData(mockData);
    }
  };

  const handleRefresh = useCallback(() => {
    fetchHistoricalData();
    if (onRefresh) onRefresh();
  }, [dateRange, selectedCurrency, onRefresh]);

  const handleDateRangeChange = useCallback(
    (range: string) => {
      setDateRange(range);
      if (onDateRangeChange) onDateRangeChange(range);
      // Data will be fetched in the useEffect
    },
    [onDateRangeChange],
  );

  const handleCurrencyChange = useCallback(
    (currency: string) => {
      setSelectedCurrency(currency);
      onCurrencyChange(currency);
    },
    [onCurrencyChange],
  );

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleCustomRangeClick = () => {
    // In a real implementation, this would open a date picker component
    alert(
      "Custom date range feature: You would select start and end dates here",
    );
    // For demonstration purposes, we'll just show an alert
    // setShowDatePicker(true);
  };

  const handleExportData = () => {
    if (chartData.length === 0) {
      alert("No data to export");
      return;
    }

    // Create CSV content
    const headers = "Date,BTC Price,ETH Price,BTC Volume,ETH Volume\n";
    const csvContent =
      headers +
      chartData
        .map(
          (row) =>
            `${row.date},${row.btcPrice || ""},${row.ethPrice || ""},${row.btcVolume || ""},${row.ethVolume || ""}`,
        )
        .join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `crypto_prices_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getChartHeight = () => {
    return 300 * zoomLevel;
  };

  return (
    <Card className="w-full h-full bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Historical Price Chart
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Historical price data with interactive controls</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Select
              value={selectedCurrency}
              onValueChange={handleCurrencyChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin</SelectItem>
                <SelectItem value="ETH">Ethereum</SelectItem>
                <SelectItem value="BOTH">BTC & ETH</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={dateRange}
              onValueChange={handleDateRangeChange}
              className="w-[250px]"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="14d">14D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCustomRangeClick}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Custom Range
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-1" />
              Export
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
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="animate-pulse text-center">
              <p className="mb-2">Loading price data...</p>
            </div>
          </div>
        ) : (
          <div style={{ height: getChartHeight() }} className="mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f7931a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f7931a" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#627eea" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#627eea" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={formatCurrency}
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                />
                <RechartsTooltip
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
                <Legend />

                {(selectedCurrency === "BTC" ||
                  selectedCurrency === "BOTH") && (
                  <Area
                    type="monotone"
                    dataKey="btcPrice"
                    name="Bitcoin"
                    stroke="#f7931a"
                    fillOpacity={1}
                    fill="url(#colorBtc)"
                    strokeWidth={2}
                  />
                )}

                {(selectedCurrency === "ETH" ||
                  selectedCurrency === "BOTH") && (
                  <Area
                    type="monotone"
                    dataKey="ethPrice"
                    name="Ethereum"
                    stroke="#627eea"
                    fillOpacity={1}
                    fill="url(#colorEth)"
                    strokeWidth={2}
                  />
                )}

                <Brush
                  dataKey="date"
                  height={30}
                  stroke="#8884d8"
                  tickFormatter={formatDate}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span>Drag chart to pan</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Use brush below chart to select range</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
