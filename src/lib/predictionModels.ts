// Prediction models for cryptocurrency price forecasting

// Mock implementation of ensemble learning methods
// In a real application, you would use actual ML libraries

interface PredictionResult {
  predicted: number;
  upperBound: number;
  lowerBound: number;
  confidence: number;
}

// Base model interface
interface Model {
  name: string;
  predict: (historicalPrices: number[], days: number) => number[];
  confidence: number; // 0-1 representing model confidence/weight
}

// Transformer-based model (using pre-trained model)
class TransformerModel implements Model {
  name = "Transformer";
  confidence = 0.45; // Higher confidence than LSTM
  private transformerInstance: any = null;
  private isInitialized = false;

  constructor() {
    // Lazy initialization of the transformer model
    this.initTransformer();
  }

  private async initTransformer() {
    try {
      // In a real implementation, we would import the transformer model
      // For now, we'll simulate it with advanced prediction logic
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize transformer model:", error);
    }
  }

  predict(historicalPrices: number[], days: number): number[] {
    const predictions: number[] = [];
    let lastPrice = historicalPrices[historicalPrices.length - 1];

    // Get trend and volatility with more sophisticated analysis
    const trend = this.calculateTrend(historicalPrices);
    const volatility = this.calculateVolatility(historicalPrices);

    // Transformers are better at capturing long-range dependencies
    const longRangeTrend = this.calculateLongRangeTrend(historicalPrices);

    for (let i = 0; i < days; i++) {
      // Transformers can model complex patterns better than LSTM
      const dayOfWeekEffect = Math.sin(((i % 7) * Math.PI) / 3.5) * 0.002; // Weekly cycle
      const momentumFactor = Math.tanh(trend * 10) * 0.005; // Non-linear momentum

      // Combine short and long-range trends with decreasing weight for long-range as days increase
      const trendWeight = Math.max(0.2, 1 - i * 0.05);
      const combinedTrend =
        trend * trendWeight + longRangeTrend * (1 - trendWeight);

      // Add some randomness that decreases with volatility (more confident predictions)
      const randomFactor = (Math.random() - 0.5) * volatility * 0.4;

      const prediction =
        lastPrice *
        (1 + combinedTrend + dayOfWeekEffect + momentumFactor + randomFactor);
      predictions.push(prediction);
      lastPrice = prediction;
    }

    return predictions;
  }

  private calculateTrend(prices: number[]): number {
    if (prices.length < 2) return 0;
    // Use exponential weighting to give more importance to recent data
    const recentPrices = prices.slice(-14); // Two weeks
    let weightedSum = 0;
    let weightSum = 0;

    for (let i = 1; i < recentPrices.length; i++) {
      const weight = Math.exp(0.1 * i); // Exponential weight
      const dailyReturn =
        (recentPrices[i] - recentPrices[i - 1]) / recentPrices[i - 1];
      weightedSum += dailyReturn * weight;
      weightSum += weight;
    }

    return weightedSum / weightSum;
  }

  private calculateLongRangeTrend(prices: number[]): number {
    if (prices.length < 30) return this.calculateTrend(prices);

    // Calculate trend over a longer period
    const longPrices = prices.slice(-30); // Last month
    const firstPrice = longPrices[0];
    const lastPrice = longPrices[longPrices.length - 1];

    return (lastPrice - firstPrice) / firstPrice / 30;
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0.02;

    // Use exponential weighting for volatility too
    const returns = [];
    const weights = [];

    for (let i = 1; i < prices.length; i++) {
      const weight = Math.exp(0.1 * i);
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
      weights.push(weight);
    }

    // Calculate weighted mean
    let weightedSum = 0;
    let weightSum = 0;
    for (let i = 0; i < returns.length; i++) {
      weightedSum += returns[i] * weights[i];
      weightSum += weights[i];
    }
    const mean = weightedSum / weightSum;

    // Calculate weighted variance
    let varianceSum = 0;
    for (let i = 0; i < returns.length; i++) {
      varianceSum += Math.pow(returns[i] - mean, 2) * weights[i];
    }
    const variance = varianceSum / weightSum;

    return Math.sqrt(variance);
  }
}

// Random Forest-like model (simplified mock)
class RandomForestModel implements Model {
  name = "Random Forest";
  confidence = 0.25;

  predict(historicalPrices: number[], days: number): number[] {
    const predictions: number[] = [];
    let lastPrice = historicalPrices[historicalPrices.length - 1];

    // Random Forest tends to be more stable
    const volatility = this.calculateVolatility(historicalPrices) * 0.8; // Less volatile than LSTM
    const trend = this.calculateTrend(historicalPrices);

    for (let i = 0; i < days; i++) {
      const prediction =
        lastPrice * (1 + trend + (Math.random() - 0.5) * volatility);
      predictions.push(prediction);
      lastPrice = prediction;
    }

    return predictions;
  }

  private calculateTrend(prices: number[]): number {
    if (prices.length < 10) return 0;
    const recentPrices = prices.slice(-14); // Last two weeks
    const firstPrice = recentPrices[0];
    const lastPrice = recentPrices[recentPrices.length - 1];
    return (lastPrice - firstPrice) / firstPrice / 14;
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0.02;
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance =
      returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      returns.length;
    return Math.sqrt(variance);
  }
}

// XGBoost-like model (simplified mock)
class XGBoostModel implements Model {
  name = "XGBoost";
  confidence = 0.2;

  predict(historicalPrices: number[], days: number): number[] {
    const predictions: number[] = [];
    let lastPrice = historicalPrices[historicalPrices.length - 1];

    // XGBoost tends to be good at capturing non-linear patterns
    const volatility = this.calculateVolatility(historicalPrices) * 0.9;
    const trend = this.calculateTrend(historicalPrices);

    for (let i = 0; i < days; i++) {
      // Add some non-linearity
      const dayEffect = Math.sin((i * Math.PI) / 7) * 0.005; // Weekly cycle
      const prediction =
        lastPrice *
        (1 + trend + dayEffect + (Math.random() - 0.5) * volatility);
      predictions.push(prediction);
      lastPrice = prediction;
    }

    return predictions;
  }

  private calculateTrend(prices: number[]): number {
    if (prices.length < 10) return 0;
    const recentPrices = prices.slice(-10); // Last 10 days
    const firstPrice = recentPrices[0];
    const lastPrice = recentPrices[recentPrices.length - 1];
    return (lastPrice - firstPrice) / firstPrice / 10;
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0.02;
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance =
      returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      returns.length;
    return Math.sqrt(variance);
  }
}

// Sentiment Analysis model (VADER-like)
class SentimentModel implements Model {
  name = "VADER Sentiment";
  confidence = 0.1;
  sentimentImpact: number = 1;
  useSentimentAPI: boolean = false;

  constructor(useSentimentAPI: boolean = false, sentimentImpact: number = 1) {
    this.useSentimentAPI = useSentimentAPI;
    this.sentimentImpact = sentimentImpact;
  }

  predict(historicalPrices: number[], days: number): number[] {
    const predictions: number[] = [];
    let lastPrice = historicalPrices[historicalPrices.length - 1];

    // If using real sentiment API, apply the sentiment impact factor
    // Otherwise, generate random sentiment scores
    const sentimentFactor = this.useSentimentAPI ? this.sentimentImpact : 1;
    const sentimentScores = Array(days)
      .fill(0)
      .map(() => {
        // If using API, the impact is already factored in via sentimentFactor
        // Otherwise, generate random sentiment with slight positive bias
        return this.useSentimentAPI ? 0 : (Math.random() - 0.4) * 0.02; // Slight positive bias
      });

    for (let i = 0; i < days; i++) {
      // Apply sentiment impact - either from API or random
      const dailySentiment = this.useSentimentAPI
        ? sentimentFactor - 1 // Convert from multiplier to change percentage
        : sentimentScores[i];

      const prediction = lastPrice * (1 + dailySentiment);
      predictions.push(prediction);
      lastPrice = prediction;
    }

    return predictions;
  }
}

// BERT-like model (simplified mock)
class BERTModel implements Model {
  name = "BERT NLP";
  confidence = 0.1;

  predict(historicalPrices: number[], days: number): number[] {
    const predictions: number[] = [];
    let lastPrice = historicalPrices[historicalPrices.length - 1];

    // BERT would analyze text data to predict price movements
    // Here we're just simulating that with some randomness and trend following
    const trend = this.calculateTrend(historicalPrices);

    for (let i = 0; i < days; i++) {
      // BERT might detect patterns that suggest stronger trends
      const prediction =
        lastPrice * (1 + trend * 1.2 + (Math.random() - 0.5) * 0.02);
      predictions.push(prediction);
      lastPrice = prediction;
    }

    return predictions;
  }

  private calculateTrend(prices: number[]): number {
    if (prices.length < 5) return 0;
    const recentPrices = prices.slice(-5); // Last 5 days
    const firstPrice = recentPrices[0];
    const lastPrice = recentPrices[recentPrices.length - 1];
    return (lastPrice - firstPrice) / firstPrice / 5;
  }
}

// Ensemble model that combines predictions from multiple models
export class EnsembleModel {
  models: Model[] = [
    new TransformerModel(), // Replace LSTM with Transformer as main model
    new RandomForestModel(),
    new XGBoostModel(),
    new SentimentModel(),
    new BERTModel(),
  ];

  predict(
    historicalPrices: number[],
    days: number,
    volatilityFactor = 1,
  ): PredictionResult[] {
    // Get predictions from each model
    const modelPredictions = this.models.map((model) => ({
      name: model.name,
      predictions: model.predict(historicalPrices, days),
      confidence: model.confidence,
    }));

    const results: PredictionResult[] = [];

    // For each day, combine the predictions using weighted average
    for (let day = 0; day < days; day++) {
      let weightedSum = 0;
      let totalWeight = 0;

      for (const model of modelPredictions) {
        weightedSum += model.predictions[day] * model.confidence;
        totalWeight += model.confidence;
      }

      const predictedPrice = weightedSum / totalWeight;

      // Calculate confidence interval based on model disagreement
      const predictions = modelPredictions.map((m) => m.predictions[day]);
      const variance = this.calculateVariance(predictions);
      const stdDev = Math.sqrt(variance);

      // Wider confidence interval for longer predictions
      const dayFactor = 1 + day / days;
      const confidenceInterval = stdDev * 1.96 * dayFactor * volatilityFactor; // 95% confidence interval

      results.push({
        predicted: predictedPrice,
        upperBound: predictedPrice + confidenceInterval,
        lowerBound: predictedPrice - confidenceInterval,
        confidence: 1 - stdDev / predictedPrice, // Higher when models agree
      });
    }

    return results;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return (
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length
    );
  }

  getModelContributions(): { name: string; weight: number }[] {
    const totalConfidence = this.models.reduce(
      (sum, model) => sum + model.confidence,
      0,
    );
    return this.models.map((model) => ({
      name: model.name,
      weight: (model.confidence / totalConfidence) * 100,
    }));
  }
}

// Function to generate prediction data for charts
export function generatePredictionData(
  days: number,
  startPrice: number,
  currency: string,
  timeframe: string,
  useSentimentAnalysis: boolean = false,
  sentimentImpact: number = 1,
): any[] {
  const data: any[] = [];
  const today = new Date();
  const volatility = currency === "BTC" ? 0.03 : 0.04; // ETH slightly more volatile

  // Generate historical prices (for the past 'days' days)
  const historicalPrices: number[] = [];
  let currentPrice = startPrice;

  // Past data (actual)
  for (let i = days; i > 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice += change;
    historicalPrices.push(currentPrice);

    data.push({
      date: date.toISOString().split("T")[0],
      actual: currentPrice,
      predicted: currentPrice,
      upperBound: currentPrice,
      lowerBound: currentPrice,
    });
  }

  // Today
  data.push({
    date: today.toISOString().split("T")[0],
    actual: currentPrice,
    predicted: currentPrice,
    upperBound: currentPrice,
    lowerBound: currentPrice,
  });

  // Add today's price to historical data
  historicalPrices.push(currentPrice);

  // Future predictions using ensemble model
  const futureDays = timeframe === "1d" ? 1 : timeframe === "7d" ? 7 : 30;
  const ensemble = new EnsembleModel();

  // Replace the sentiment model with one that uses the API if requested
  if (useSentimentAnalysis) {
    // Find and replace the sentiment model
    const modelIndex = ensemble.models.findIndex(
      (model) => model.name === "VADER Sentiment",
    );
    if (modelIndex !== -1) {
      ensemble.models[modelIndex] = new SentimentModel(true, sentimentImpact);
    }
  }

  const predictions = ensemble.predict(
    historicalPrices,
    futureDays,
    volatility * 30,
  );

  // Add predictions to data
  for (let i = 0; i < futureDays; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);

    data.push({
      date: date.toISOString().split("T")[0],
      actual: 0, // No actual data for future
      predicted: predictions[i].predicted,
      upperBound: predictions[i].upperBound,
      lowerBound: predictions[i].lowerBound,
    });
  }

  return data;
}

// Function to get model contribution data for visualization
export function getModelContributions(): { name: string; weight: number }[] {
  const ensemble = new EnsembleModel();
  return ensemble.getModelContributions();
}
