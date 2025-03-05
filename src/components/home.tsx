import React, { useState, useEffect } from "react";
import { fetchTokenPrices, TokenPriceData } from "../lib/api";
import Header from "./dashboard/Header";
import PriceDisplay from "./dashboard/PriceDisplay";
import PriceChart from "./dashboard/PriceChart";
import PredictionSection from "./dashboard/PredictionSection";
import ModelControls from "./dashboard/ModelControls";
import ModelPerformance from "./dashboard/ModelPerformance";

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [priceData, setPriceData] = useState<TokenPriceData[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<"BTC" | "ETH">(
    "BTC",
  );
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString(),
  );

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const tokens = await fetchTokenPrices(["BTC", "ETH"]);
      setPriceData(tokens);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    // Apply dark mode to document
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency as "BTC" | "ETH");
  };

  const [modelParameters, setModelParameters] = useState(null);

  const handleParametersChange = (parameters: any) => {
    setModelParameters(parameters);
  };

  const handleGeneratePrediction = () => {
    setIsLoading(true);
    // Simulate prediction generation
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(new Date().toLocaleTimeString());
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        onRefresh={handleRefresh}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
        lastUpdated={lastUpdated}
      />

      <main className="container mx-auto py-6 px-4 space-y-8">
        <PriceDisplay
          data={priceData}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />

        <div className="grid grid-cols-1 gap-8">
          <PriceChart
            isLoading={isLoading}
            onRefresh={handleRefresh}
            onCurrencyChange={handleCurrencyChange}
          />

          <PredictionSection
            isLoading={isLoading}
            currency={selectedCurrency}
            modelParameters={modelParameters}
          />

          <ModelControls
            isLoading={isLoading}
            currency={selectedCurrency}
            onGeneratePrediction={handleGeneratePrediction}
            onParametersChange={handleParametersChange}
          />

          <ModelPerformance />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Transformer Price Forecasting Engine © {new Date().getFullYear()} |
            Powered by Machine Learning
          </p>
          <p className="text-center text-gray-400 dark:text-gray-500 text-xs mt-2">
            Disclaimer: Predictions are for informational purposes only. Past
            performance is not indicative of future results.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
