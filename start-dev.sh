#!/bin/bash

echo "🧹 Cleaning up ports..."

# Kill any processes on required ports
for port in 1337 3000 8787; do
  pid=$(lsof -ti :$port)
  if [ ! -z "$pid" ]; then
    echo "Killing process on port $port (PID: $pid)"
    kill -9 $pid 2>/dev/null
  fi
done

# Wait a moment for ports to be released
sleep 2

echo "🚀 Starting development servers..."

# Unset any conflicting DATABASE environment variables
unset DATABASE_URL DATABASE_USERNAME DATABASE_PASSWORD DATABASE_HOST DATABASE_NAME DATABASE_PORT DATABASE_SSL

# Start all services
yarn dev