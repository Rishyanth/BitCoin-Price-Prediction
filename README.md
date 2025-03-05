# Cryptocurrency Price Prediction Dashboard

A comprehensive dashboard that displays real-time cryptocurrency price data alongside ML-powered price predictions for Bitcoin and Ethereum, featuring interactive charts and customizable prediction parameters.

## Features

- Real-time cryptocurrency price data from CoinGecko API
- Interactive historical price charts with zoom/pan capabilities
- Price predictions for 1-day, 7-day, and 30-day timeframes
- Confidence intervals and accuracy metrics for predictions
- Customizable model parameters
- Dark/light mode toggle
- Export predictions to CSV
- Model performance metrics and comparison

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Recharts for data visualization
- ShadCN UI components

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd cryptocurrency-prediction-dashboard
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `src/components/dashboard/` - Dashboard components (Header, PriceDisplay, PriceChart, etc.)
- `src/components/landing/` - Landing page components
- `src/components/ui/` - UI components from ShadCN
- `src/lib/` - Utility functions, API calls, and prediction models
- `src/pages/` - Main pages of the application

## API Integration

The application uses the CoinGecko API to fetch real-time cryptocurrency data. No API key is required for basic usage.

## Prediction Models

The application uses an ensemble of models for price prediction:

- Transformer Neural Network
- Random Forest
- XGBoost
- VADER Sentiment Analysis
- BERT NLP

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

MIT
