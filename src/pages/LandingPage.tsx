import React from "react";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold">CryptoPredict</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="hover:text-blue-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="hover:text-blue-400 transition-colors"
            >
              Testimonials
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              About
            </a>
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features">
        <Features />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* Call to Action */}
      <CTA />

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CryptoPredict</h3>
              <p className="text-slate-400">
                Advanced cryptocurrency price prediction powered by transformer
                neural networks and ensemble learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Transformer AI Model</li>
                <li>Ensemble Learning</li>
                <li>Sentiment Analysis</li>
                <li>Interactive Charts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Model Performance</li>
                <li>Research Papers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
            <p>
              © {new Date().getFullYear()} CryptoPredict. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
