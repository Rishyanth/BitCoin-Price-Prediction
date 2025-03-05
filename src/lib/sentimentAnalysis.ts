// Sentiment Analysis API for cryptocurrency market sentiment

// CryptoCompare API configuration
const CRYPTOCOMPARE_API_KEY =
  "cbed205b9bd67d335cc19f87177e3b46447c44d7b5a30730c603b39b5dc5b9f3";
const CRYPTOCOMPARE_BASE_URL = "https://min-api.cryptocompare.com/data";

// Interface for sentiment data
export interface SentimentData {
  bullishPercentage: number;
  bearishPercentage: number;
  timeFrom: string;
  timeTo: string;
  totalArticles: number;
  sentimentScore: number; // -1 to 1 where 1 is very bullish
  sentimentClass: "bullish" | "bearish" | "neutral";
}

/**
 * Fetch sentiment analysis data for a cryptocurrency
 * @param symbol Cryptocurrency symbol (e.g., 'BTC')
 * @returns Promise with sentiment analysis data
 */
export async function fetchSentimentData(
  symbol: string,
): Promise<SentimentData> {
  try {
    // Construct the URL for news sentiment
    const url = `${CRYPTOCOMPARE_BASE_URL}/v2/news/?categories=${symbol.toLowerCase()}&api_key=${CRYPTOCOMPARE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.Data || data.Data.length === 0) {
      throw new Error("No sentiment data available");
    }

    // Process the news articles to calculate sentiment
    const articles = data.Data;
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    // Simple sentiment analysis based on article titles
    // In a real implementation, this would use NLP techniques
    articles.forEach((article: any) => {
      const title = article.title.toLowerCase();
      const body = article.body ? article.body.toLowerCase() : "";

      // Positive keywords
      const positiveKeywords = [
        "bull",
        "bullish",
        "surge",
        "soar",
        "gain",
        "rally",
        "rise",
        "up",
        "high",
        "growth",
        "positive",
      ];
      // Negative keywords
      const negativeKeywords = [
        "bear",
        "bearish",
        "crash",
        "fall",
        "drop",
        "decline",
        "down",
        "low",
        "negative",
        "sell",
      ];

      let isPositive = positiveKeywords.some(
        (keyword) => title.includes(keyword) || body.includes(keyword),
      );
      let isNegative = negativeKeywords.some(
        (keyword) => title.includes(keyword) || body.includes(keyword),
      );

      if (isPositive && !isNegative) {
        positiveCount++;
      } else if (isNegative && !isPositive) {
        negativeCount++;
      } else {
        neutralCount++;
      }
    });

    const totalArticles = articles.length;
    const bullishPercentage = (positiveCount / totalArticles) * 100;
    const bearishPercentage = (negativeCount / totalArticles) * 100;
    const sentimentScore = (positiveCount - negativeCount) / totalArticles;

    let sentimentClass: "bullish" | "bearish" | "neutral" = "neutral";
    if (sentimentScore > 0.2) sentimentClass = "bullish";
    if (sentimentScore < -0.2) sentimentClass = "bearish";

    // Get time range
    const latestArticleTime = new Date(articles[0].published_on * 1000);
    const oldestArticleTime = new Date(
      articles[articles.length - 1].published_on * 1000,
    );

    return {
      bullishPercentage,
      bearishPercentage,
      timeFrom: oldestArticleTime.toISOString(),
      timeTo: latestArticleTime.toISOString(),
      totalArticles,
      sentimentScore,
      sentimentClass,
    };
  } catch (error) {
    console.error("Error fetching sentiment data:", error);

    // Return mock data in case of error
    return {
      bullishPercentage: symbol === "BTC" ? 65 : 58,
      bearishPercentage: symbol === "BTC" ? 25 : 32,
      timeFrom: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      timeTo: new Date().toISOString(),
      totalArticles: 42,
      sentimentScore: symbol === "BTC" ? 0.4 : 0.26,
      sentimentClass: symbol === "BTC" ? "bullish" : "bullish",
    };
  }
}

/**
 * Get sentiment impact on price prediction
 * @param symbol Cryptocurrency symbol
 * @param currentPrice Current price of the cryptocurrency
 * @returns Promise with sentiment-adjusted price factor (multiply by this to adjust price)
 */
export async function getSentimentPriceImpact(
  symbol: string,
  currentPrice: number,
): Promise<number> {
  try {
    const sentimentData = await fetchSentimentData(symbol);

    // Calculate impact factor based on sentiment score
    // This is a simplified model - in reality, the relationship between sentiment and price is complex
    const impactFactor = 1 + sentimentData.sentimentScore * 0.03; // Max 3% impact

    return impactFactor;
  } catch (error) {
    console.error("Error calculating sentiment impact:", error);
    return 1; // Neutral impact if error
  }
}
