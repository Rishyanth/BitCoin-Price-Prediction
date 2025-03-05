import React from "react";
import { Card, CardContent } from "../ui/card";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote:
        "The transformer-based prediction model has significantly improved our trading strategy. The 96% direction accuracy for short-term predictions is remarkable.",
      author: "Sri Lakshmi",
      role: "Crypto Fund Manager",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=srilakshmi&gender=female",
    },
    {
      quote:
        "I've tried many prediction tools, but this platform's ensemble approach combining multiple models provides the most reliable forecasts I've seen.",
      author: "Ram",
      role: "Day Trader",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ram&gender=male",
    },
    {
      quote:
        "The sentiment analysis feature is a game-changer. Being able to see how market sentiment affects price predictions gives me an edge in volatile markets.",
      author: "Manikanta Reddy",
      role: "Blockchain Analyst",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=manikanta&gender=male",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trusted by traders, analysts, and cryptocurrency enthusiasts
            worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <p className="text-gray-700 dark:text-gray-300 italic mb-6">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="flex-shrink-0 mr-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="h-12 w-12 rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
