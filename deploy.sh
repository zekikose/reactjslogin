#!/bin/bash

echo "🚀 React.js Login Dashboard Deployment Script"
echo "=============================================="

# Build React app
echo "📦 Building React app..."
npm run build

# Install production dependencies
echo "📥 Installing production dependencies..."
npm install --production

# Start the server
echo "🚀 Starting server..."
npm start
