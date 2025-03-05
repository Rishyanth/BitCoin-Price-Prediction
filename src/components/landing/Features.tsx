import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Brain,
  LineChart,
  BarChart,
  TrendingUp,
  Zap,
  RefreshCw,
} from "lucide-react";

const Features: React.FC = () => {
  const features = [
    {
      icon: <Brain className="h-10 w-10 text-blue-500" />,
      title: "Transformer Neural Networks",
      description:
        "Our model leverages state-of-the-art transformer architecture to capture complex patterns in cryptocurrency price movements.",
    },
    {
      icon: <LineChart className="h-10 w-10 text-blue-500" />,
      title: "Interactive Price Charts",
      description:
        "Visualize historical prices and predictions with confidence intervals using interactive charts with zoom and pan capabilities.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-blue-500" />,
      title: "Ensemble Learning",
      description:
        "Combines predictions from multiple models including Transformer, Random Forest, XGBoost, VADER, and BERT for superior accuracy.",
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-blue-500" />,
      title: "Multiple Timeframes",
      description:
        "Generate predictions for 1-day, 7-day, and 30-day horizons with detailed accuracy metrics for each timeframe.",
    },
    {
      icon: <Zap className="h-10 w-10 text-blue-500" />,
      title: "Sentiment Analysis",
      description:
        "Incorporates real-time market sentiment from news and social media to improve prediction accuracy during market events.",
    },
    {
      icon: <RefreshCw className="h-10 w-10 text-blue-500" />,
      title: "Real-time Updates",
      description:
        "Continuously updated price data and predictions with the latest market information for Bitcoin and Ethereum.",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Advanced Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our cryptocurrency price prediction platform combines cutting-edge
            AI with comprehensive market analysis tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
