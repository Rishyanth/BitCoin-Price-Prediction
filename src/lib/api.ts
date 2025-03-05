// API utilities for fetching cryptocurrency data

// CoinGecko API configuration
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// Interface for token price data
export interface TokenPriceData {
  symbol: string;
  name: string;
  price: number;
  change24h?: number;
  change7d?: number;
  marketCap?: number;
  volume24h?: number;
  lastUpdated: string;
}

// Map of symbols to CoinGecko IDs
const coinGeckoIds: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDC: "usd-coin",
};

/**
 * Fetch cryptocurrency prices from CoinGecko API
 * @param symbols Array of cryptocurrency symbols to fetch (e.g., ['BTC', 'ETH'])
 * @returns Promise with token price data
 */
export async function fetchTokenPrices(
  symbols: string[] = ["BTC", "ETH", "USDC"],
): Promise<TokenPriceData[]> {
  try {
    // Convert symbols to CoinGecko IDs
    const ids = symbols
      .map((symbol) => coinGeckoIds[symbol])
      .filter((id) => id)
      .join(",");

    // Fetch data from CoinGecko
    const url = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h,7d`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Transform the response into our TokenPriceData format
    return symbols.map((symbol) => {
      // Find the corresponding data from CoinGecko
      const coinId = coinGeckoIds[symbol];
      const coinData = data.find((coin: any) => coin.id === coinId);

      if (!coinData) {
        return {
          symbol,
          name: symbol,
          price: 0,
          lastUpdated: new Date().toISOString(),
        };
      }

      return {
        symbol,
        name: coinData.name,
        price: coinData.current_price,
        change24h: coinData.price_change_percentage_24h,
        change7d: coinData.price_change_percentage_7d_in_currency,
        marketCap: coinData.market_cap,
        volume24h: coinData.total_volume,
        lastUpdated: coinData.last_updated || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching token prices:", error);

    // Return mock data in case of error
    return symbols.map((symbol) => ({
      symbol,
      name:
        symbol === "BTC" ? "Bitcoin" : symbol === "ETH" ? "Ethereum" : symbol,
      price: symbol === "BTC" ? 65432.18 : symbol === "ETH" ? 3521.67 : 1.0,
      change24h: symbol === "BTC" ? 2.34 : symbol === "ETH" ? -0.87 : 0.01,
      change7d: symbol === "BTC" ? -1.2 : symbol === "ETH" ? 3.45 : 0.0,
      marketCap:
        symbol === "BTC"
          ? 1250000000000
          : symbol === "ETH"
            ? 420000000000
            : 50000000000,
      volume24h:
        symbol === "BTC"
          ? 28500000000
          : symbol === "ETH"
            ? 15700000000
            : 5000000000,
      lastUpdated: new Date().toISOString(),
    }));
  }
}

/**
 * Fetch historical price data for a cryptocurrency
 * @param symbol Cryptocurrency symbol (e.g., 'BTC')
 * @param days Number of days of historical data to fetch
 * @returns Promise with historical price data
 */
export async function fetchHistoricalPrices(
  symbol: string,
  days: number = 30,
): Promise<any[]> {
  try {
    // Convert symbol to CoinGecko ID
    const coinId = coinGeckoIds[symbol];
    if (!coinId) {
      throw new Error(`Unknown symbol: ${symbol}`);
    }

    // Fetch historical data from CoinGecko
    const url = `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Transform the response into our expected format
    // CoinGecko returns prices as [timestamp, price] pairs
    const formattedData = data.prices.map(
      (item: [number, number], index: number) => {
        const timestamp = item[0];
        const price = item[1];
        const date = new Date(timestamp);

        // Get volume from the volumes array if available
        const volume =
          data.total_volumes && data.total_volumes[index]
            ? data.total_volumes[index][1]
            : Math.floor(
                Math.random() * (symbol === "BTC" ? 30000000000 : 15000000000),
              );

        return {
          date: date.toISOString().split("T")[0],
          price,
          volume,
        };
      },
    );

    return formattedData;
  } catch (error) {
    console.error("Error fetching historical prices:", error);

    // Fallback to mock data
    const mockData = [];
    const today = new Date();
    let price = symbol === "BTC" ? 65000 : 3500;
    const volatility = symbol === "BTC" ? 0.03 : 0.04; // ETH slightly more volatile

    // Generate data points from most recent to oldest
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Add some randomness to create realistic price movements
      price = price * (1 + (Math.random() - 0.5) * volatility);

      // Ensure price doesn't go negative or too low
      price = Math.max(price, symbol === "BTC" ? 10000 : 500);

      mockData.push({
        date: date.toISOString().split("T")[0],
        price,
        volume: Math.floor(
          Math.random() * (symbol === "BTC" ? 30000000000 : 15000000000),
        ),
      });
    }

    return mockData;
  }
}
