import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  LineChart,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ModelPerformanceProps {
  modelName?: string;
  lastTrainingDate?: string;
  trainingStatus?: "completed" | "in_progress" | "scheduled";
  trainingProgress?: number;
  historicalAccuracy?: {
    date: string;
    btcAccuracy: number;
    ethAccuracy: number;
  }[];
  modelComparison?: {
    name: string;
    accuracy: number;
    speed: number;
    complexity: number;
  }[];
  dataPoints?: number;
  trainingTime?: string;
  nextTrainingDate?: string;
}

const ModelPerformance: React.FC<ModelPerformanceProps> = ({
  modelName = "Transformer Price Forecaster v4.2",
  lastTrainingDate = "2025-03-05",
  trainingStatus = "completed",
  trainingProgress = 100,
  historicalAccuracy = [
    { date: "Jan", btcAccuracy: 82, ethAccuracy: 78 },
    { date: "Feb", btcAccuracy: 85, ethAccuracy: 80 },
    { date: "Mar", btcAccuracy: 83, ethAccuracy: 79 },
    { date: "Apr", btcAccuracy: 87, ethAccuracy: 82 },
    { date: "May", btcAccuracy: 90, ethAccuracy: 85 },
  ],
  modelComparison = [
    { name: "Transformer", accuracy: 96, speed: 82, complexity: 85 },
    { name: "GRU", accuracy: 87, speed: 90, complexity: 65 },
    { name: "LSTM", accuracy: 90, speed: 85, complexity: 70 },
  ],
  dataPoints = 1250000,
  trainingTime = "4h 32m",
  nextTrainingDate = "2025-06-15",
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "scheduled":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      case "scheduled":
        return "Scheduled";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="w-full h-full bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Model Performance Metrics
          </CardTitle>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${getStatusColor(
              trainingStatus,
            )} text-white px-2 py-1`}
          >
            <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
            {getStatusText(trainingStatus)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Historical Accuracy</TabsTrigger>
            <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Server className="h-4 w-4" />
                  <span>Model Information</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Model Name:</span>
                    <span className="font-medium">{modelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Training:</span>
                    <span className="font-medium">
                      {formatDate(lastTrainingDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Next Training:</span>
                    <span className="font-medium">
                      {formatDate(nextTrainingDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  <span>Training Statistics</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Data Points:</span>
                    <span className="font-medium">
                      {dataPoints.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Training Time:</span>
                    <span className="font-medium">{trainingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Training Status:</span>
                    <div className="flex items-center gap-1">
                      {trainingStatus === "in_progress" ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : trainingStatus === "completed" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Calendar className="h-3 w-3 text-yellow-500" />
                      )}
                      <span className="font-medium">
                        {getStatusText(trainingStatus)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {trainingStatus === "in_progress" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Training Progress</span>
                  <span>{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Estimated time remaining: 1h 23m
                </p>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Current Performance</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">BTC Prediction Accuracy:</span>
                    <span className="font-medium">
                      {
                        historicalAccuracy[historicalAccuracy.length - 1]
                          .btcAccuracy
                      }
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      historicalAccuracy[historicalAccuracy.length - 1]
                        .btcAccuracy
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">ETH Prediction Accuracy:</span>
                    <span className="font-medium">
                      {
                        historicalAccuracy[historicalAccuracy.length - 1]
                          .ethAccuracy
                      }
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      historicalAccuracy[historicalAccuracy.length - 1]
                        .ethAccuracy
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LineChart className="h-4 w-4" />
                  <span>Accuracy Trends (Last 5 Months)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>BTC</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>ETH</span>
                  </div>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={historicalAccuracy}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="btcAccuracy"
                      name="BTC Accuracy"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ethAccuracy"
                      name="ETH Accuracy"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  <span>Average Accuracy</span>
                </div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    historicalAccuracy.reduce(
                      (acc, curr) => acc + curr.btcAccuracy + curr.ethAccuracy,
                      0,
                    ) /
                      (historicalAccuracy.length * 2),
                  )}
                  %
                </div>
                <div className="text-xs text-muted-foreground">
                  Across all cryptocurrencies
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Best Prediction Window</span>
                </div>
                <div className="text-2xl font-bold">7 Days</div>
                <div className="text-xs text-muted-foreground">
                  Highest accuracy timeframe
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  <span>Model Iterations</span>
                </div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-xs text-muted-foreground">
                  Total training cycles
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                <span>Ensemble Model Comparison</span>
              </div>

              <div className="space-y-6">
                {modelComparison.map((model) => (
                  <div key={model.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{model.name}</span>
                      <Badge
                        variant={
                          model.name === "Transformer" ? "default" : "outline"
                        }
                        className={model.name === "Transformer" ? "" : ""}
                      >
                        {model.name === "Transformer"
                          ? "Current"
                          : "Alternative"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Accuracy</span>
                          <span>{model.accuracy}%</span>
                        </div>
                        <Progress value={model.accuracy} className="h-1.5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Processing Speed</span>
                          <span>{model.speed}%</span>
                        </div>
                        <Progress value={model.speed} className="h-1.5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Model Complexity</span>
                          <span>{model.complexity}%</span>
                        </div>
                        <Progress value={model.complexity} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-center text-muted-foreground">
                Our ensemble approach combines the strengths of multiple models.
                Transformer captures complex patterns with attention mechanisms,
                Random Forest provides stability, XGBoost handles non-linear
                relationships, while VADER and BERT incorporate sentiment
                analysis from news and social media.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ModelPerformance;
