#!/bin/bash

# Test script for Mack AI macOS application

echo "Starting Mack AI macOS test process..."

# Check if the application can start
echo "Testing application startup..."
npm start -- --test-mode &
APP_PID=$!

# Wait for the app to initialize
echo "Waiting for application to initialize..."
sleep 5

# Check if the process is still running
if ps -p $APP_PID > /dev/null; then
  echo "✅ Application started successfully"
  
  # Kill the application process
  kill $APP_PID
else
  echo "❌ Application failed to start"
  exit 1
fi

# Test build configuration
echo "Testing build configuration..."
if [ -f "package.json" ] && grep -q "electron-builder" "package.json"; then
  echo "✅ Build configuration is valid"
else
  echo "❌ Build configuration is invalid"
  exit 1
fi

# Check for required files
echo "Checking for required files..."
REQUIRED_FILES=("main.js" "preload.js" "src/index.html" "src/css/styles.css" "src/css/themes.css" "src/js/app.js" "build/entitlements.mac.plist")
MISSING_FILES=0

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file is missing"
    MISSING_FILES=$((MISSING_FILES+1))
  fi
done

if [ $MISSING_FILES -eq 0 ]; then
  echo "All required files are present"
else
  echo "$MISSING_FILES required files are missing"
  exit 1
fi

echo "Test process completed successfully!"
echo "The application is ready for packaging into a .dmg installer."
