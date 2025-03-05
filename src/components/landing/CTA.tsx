import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CTA: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Ready to predict cryptocurrency prices with AI?
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
          Get started with our advanced prediction dashboard and gain insights
          into future price movements.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="gap-2">
              Try Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTA;
