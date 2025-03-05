import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Settings,
  BarChart4,
  RefreshCw,
  TrendingUp,
  Calendar,
  Info,
} from "lucide-react";

interface ModelControlsProps {
  onParametersChange?: (parameters: ModelParameters) => void;
  onGeneratePrediction?: () => void;
  isLoading?: boolean;
  currency?: "BTC" | "ETH";
}

interface ModelParameters {
  timeframe: string;
  indicators: string[];
  windowSize: number;
  includeVolume: boolean;
  includeSentiment: boolean;
  confidenceInterval: number;
  models: string[];
}

const ModelControls: React.FC<ModelControlsProps> = ({
  onParametersChange = () => {},
  onGeneratePrediction = () => {},
  isLoading = false,
  currency = "BTC",
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [parameters, setParameters] = useState<ModelParameters>({
    timeframe: "7d",
    indicators: ["SMA", "EMA"],
    windowSize: 14,
    includeVolume: true,
    includeSentiment: true,
    confidenceInterval: 80,
    models: ["LSTM", "Random Forest", "XGBoost", "VADER", "BERT"],
  });

  const handleParameterChange = <K extends keyof ModelParameters>(
    key: K,
    value: ModelParameters[K],
  ) => {
    const newParameters = { ...parameters, [key]: value };
    setParameters(newParameters);
    onParametersChange(newParameters);
  };

  const indicatorOptions = [
    { value: "SMA", label: "Simple Moving Average" },
    { value: "EMA", label: "Exponential Moving Average" },
    { value: "RSI", label: "Relative Strength Index" },
    { value: "MACD", label: "Moving Average Convergence Divergence" },
    { value: "BB", label: "Bollinger Bands" },
  ];

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span>Model Parameters</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onGeneratePrediction}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            {isLoading ? "Generating..." : "Generate Prediction"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="basic"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="basic">Basic Parameters</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Parameters</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Prediction Timeframe
                  </label>
                </div>
                <Select
                  value={parameters.timeframe}
                  onValueChange={(value) =>
                    handleParameterChange("timeframe", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="7d">7 Days</SelectItem>
                    <SelectItem value="30d">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <BarChart4 className="h-4 w-4 text-muted-foreground" />
                    Technical Indicators
                  </label>
                </div>
                <Select
                  value={parameters.indicators[0]}
                  onValueChange={(value) =>
                    handleParameterChange("indicators", [
                      value,
                      ...parameters.indicators.slice(1),
                    ])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select indicator" />
                  </SelectTrigger>
                  <SelectContent>
                    {indicatorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Confidence Interval ({parameters.confidenceInterval}%)
                </label>
              </div>
              <Slider
                value={[parameters.confidenceInterval]}
                min={50}
                max={95}
                step={5}
                onValueChange={(value) =>
                  handleParameterChange("confidenceInterval", value[0])
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50% (Narrow)</span>
                <span>95% (Wide)</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Window Size ({parameters.windowSize} days)
                  </label>
                </div>
                <Slider
                  value={[parameters.windowSize]}
                  min={7}
                  max={30}
                  step={1}
                  onValueChange={(value) =>
                    handleParameterChange("windowSize", value[0])
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>7 days</span>
                  <span>30 days</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">
                      Include Volume Data
                    </label>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Switch
                    checked={parameters.includeVolume}
                    onCheckedChange={(checked) =>
                      handleParameterChange("includeVolume", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">
                      Include Sentiment Analysis
                    </label>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Switch
                    checked={parameters.includeSentiment}
                    onCheckedChange={(checked) =>
                      handleParameterChange("includeSentiment", checked)
                    }
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">
                      Active Models in Ensemble
                    </label>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#0088FE]"></div>
                      <span>LSTM Neural Network</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#00C49F]"></div>
                      <span>Random Forest</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FFBB28]"></div>
                      <span>XGBoost</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF8042]"></div>
                      <span>VADER Sentiment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#8884d8]"></div>
                      <span>BERT NLP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Advanced parameters affect model training and prediction
                accuracy. Changes may require retraining the model which can
                take several minutes.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
          <span>
            Currently predicting: <strong>{currency}</strong>
          </span>
          <span>
            Last model update:{" "}
            <strong>{new Date().toLocaleDateString()}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelControls;
