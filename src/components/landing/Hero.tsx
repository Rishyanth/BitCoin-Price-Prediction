import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, TrendingUp, BarChart, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
      <div className="absolute h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)] opacity-50" />

      <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:flex lg:items-center lg:px-8">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="block">Predict Crypto Prices</span>
            <span className="block text-blue-400">With AI Precision</span>
          </h1>
          <p className="mt-6 max-w-lg text-xl text-slate-300 sm:max-w-3xl">
            Our advanced Transformer-based AI model delivers up to 96% accurate
            cryptocurrency price predictions using ensemble learning and
            real-time market sentiment analysis.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Try Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-white border-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <p className="mt-2 text-center font-semibold">96%</p>
              <p className="text-center text-sm text-slate-400">
                Direction Accuracy
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <BarChart className="h-6 w-6 text-blue-400" />
              </div>
              <p className="mt-2 text-center font-semibold">5 Models</p>
              <p className="text-center text-sm text-slate-400">
                Ensemble Learning
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <p className="mt-2 text-center font-semibold">Real-time</p>
              <p className="text-center text-sm text-slate-400">
                Market Sentiment
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-0 lg:w-1/2">
          <div className="relative mx-auto w-full max-w-lg lg:max-w-md xl:max-w-lg">
            <div className="relative rounded-lg bg-slate-800 p-2 shadow-2xl shadow-blue-500/20">
              <div className="overflow-hidden rounded-md">
                <img
                  src="https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&q=80"
                  alt="Cryptocurrency dashboard"
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                <div className="text-center">
                  <div className="text-xl font-bold">BTC</div>
                  <div className="text-xs">Predictions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
