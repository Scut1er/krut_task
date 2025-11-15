#!/bin/bash

# Bash script to start the Student Portal application

echo "🎓 Starting Student Portal..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✓ Docker is running"
echo ""
echo "Building and starting containers..."
echo ""

# Build and start containers
docker-compose up --build

echo ""
echo "🎉 Application started successfully!"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8080"
echo "  Database: localhost:5432"
echo ""
echo "Test accounts:"
echo "  Teacher: teacher@example.com / teacher123"
echo "  Student: student@example.com / student123"






