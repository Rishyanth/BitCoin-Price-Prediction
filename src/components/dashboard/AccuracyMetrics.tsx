import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BarChart3Icon,
  TrendingUpIcon,
  AlertCircleIcon,
} from "lucide-react";

interface AccuracyMetricsProps {
  maeValue?: number;
  rmseValue?: number;
  accuracyPercentage?: number;
  directionAccuracy?: number;
  confidenceScore?: number;
  predictionTimeframe?: string;
}

const AccuracyMetrics = ({
  maeValue = 198.42,
  rmseValue = 267.35,
  accuracyPercentage = 92,
  directionAccuracy = 96,
  confidenceScore = 85,
  predictionTimeframe = "7-day",
}: AccuracyMetricsProps) => {
  return (
    <Card className="h-full w-full bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Ensemble Model Accuracy Metrics</span>
          <Badge variant="secondary">{predictionTimeframe}</Badge>
        </CardTitle>
      </CardHeader>
      <div className="px-6 -mt-2 mb-2">
        <p className="text-sm text-muted-foreground">
          Using MAE, RMSE, Direction Accuracy & Confidence Score
        </p>
      </div>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Overall Accuracy</span>
            </div>
            <span className="font-bold">{accuracyPercentage}%</span>
          </div>
          <Progress value={accuracyPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Direction Accuracy</span>
            </div>
            <span className="font-bold">{directionAccuracy}%</span>
          </div>
          <Progress value={directionAccuracy} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Confidence Score</span>
            </div>
            <span className="font-bold">{confidenceScore}%</span>
          </div>
          <Progress value={confidenceScore} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">
              Mean Absolute Error
            </div>
            <div className="mt-1 flex items-center">
              <span className="text-lg font-semibold">${maeValue}</span>
              <ArrowDownIcon className="ml-2 h-4 w-4 text-green-500" />
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">
              Root Mean Square Error
            </div>
            <div className="mt-1 flex items-center">
              <span className="text-lg font-semibold">${rmseValue}</span>
              <ArrowUpIcon className="ml-2 h-4 w-4 text-red-500" />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-3 text-sm">
          <p className="text-center text-muted-foreground">
            Based on historical data from the past 90 days
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccuracyMetrics;
