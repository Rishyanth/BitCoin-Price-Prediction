import React, { useState } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Moon, Sun, RefreshCw, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  onRefresh?: () => void;
  onThemeToggle?: (isDark: boolean) => void;
  isDarkMode?: boolean;
  lastUpdated?: string;
}

const Header: React.FC<HeaderProps> = ({
  onRefresh = () => {},
  onThemeToggle = () => {},
  isDarkMode = false,
  lastUpdated = new Date().toLocaleTimeString(),
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefresh();
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleThemeToggle = () => {
    onThemeToggle(!isDarkMode);
  };

  return (
    <header className="w-full h-20 px-6 bg-background border-b border-border flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Crypto Price Prediction</h1>
          <p className="text-sm text-muted-foreground">
            Powered by LSTM Machine Learning
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground flex items-center">
          <span>Last updated: {lastUpdated}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              BTC/USD <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>BTC/USD</DropdownMenuItem>
            <DropdownMenuItem>ETH/USD</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>

        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4" />
          <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
          <Moon className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;
