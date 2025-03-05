import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { fetchTokenPrices, TokenPriceData } from "../../lib/api";

// Using TokenPriceData interface from api.ts

interface PriceDisplayProps {
  data?: TokenPriceData[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  data,
  isLoading = false,
  onRefresh = () => {},
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("all");
  const [prices, setPrices] = useState<TokenPriceData[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch data from API or use provided data
  useEffect(() => {
    if (data) {
      setPrices(data);
    } else {
      fetchPrices();
    }
  }, [data]);

  // Function to fetch prices from Alchemy API
  const fetchPrices = async () => {
    try {
      setFetchError(null);
      const tokenPrices = await fetchTokenPrices(["BTC", "ETH"]);
      setPrices(tokenPrices);
    } catch (error) {
      console.error("Error fetching prices:", error);
      setFetchError("Failed to fetch cryptocurrency prices");
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchPrices();
    if (onRefresh) onRefresh();
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number): string => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return formatCurrency(value);
  };

  const filteredPrices =
    selectedCurrency === "all"
      ? prices
      : prices.filter((price) => price.symbol === selectedCurrency);

  return (
    <div className="w-full bg-background">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-bold">Cryptocurrency Prices</h2>
        <div className="flex items-center gap-4">
          <Tabs
            defaultValue="all"
            value={selectedCurrency}
            onValueChange={setSelectedCurrency}
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="BTC">Bitcoin</TabsTrigger>
              <TabsTrigger value="ETH">Ethereum</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCwIcon
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="px-4 py-3 mb-4 text-sm text-red-800 bg-red-100 rounded-md">
          {fetchError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {isLoading
          ? // Loading skeleton
            Array(2)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-card shadow-sm">
                  <CardContent className="p-6">
                    <div className="h-24 animate-pulse bg-muted rounded-md"></div>
                  </CardContent>
                </Card>
              ))
          : filteredPrices.map((crypto) => (
              <Card
                key={crypto.symbol}
                className="bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold">{crypto.symbol}</h3>
                        <Badge variant="outline">{crypto.name}</Badge>
                      </div>
                      <p className="text-3xl font-bold mt-2">
                        {formatCurrency(crypto.price)}
                      </p>

                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-1">
                            24h:
                          </span>
                          <span
                            className={`flex items-center ${crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {crypto.change24h >= 0 ? (
                              <TrendingUpIcon className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDownIcon className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(crypto.change24h).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-1">
                            7d:
                          </span>
                          <span
                            className={`flex items-center ${crypto.change7d >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {crypto.change7d >= 0 ? (
                              <TrendingUpIcon className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDownIcon className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(crypto.change7d).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex flex-col gap-1">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Volume (24h)
                          </span>
                          <p className="font-medium">
                            {formatLargeNumber(crypto.volume24h)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Market Cap
                          </span>
                          <p className="font-medium">
                            {formatLargeNumber(crypto.marketCap)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default PriceDisplay;
