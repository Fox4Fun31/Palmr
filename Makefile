.PHONY: help build start clean logs stop restart

# Default target
help:
	@echo "🚀 Palmr - Available Commands:"
	@echo ""
	@echo "  make build     - Build Docker image with multi-platform support"
	@echo "  make start     - Start the application using docker-compose"
	@echo "  make stop      - Stop all running containers"
	@echo "  make logs      - Show application logs"
	@echo "  make clean     - Clean up containers and images"
	@echo "  make shell     - Access the application container shell"
	@echo ""
	@echo "📁 Scripts location: ./infra/"

# Build Docker image using the build script
build:
	@echo "🏗️  Building Palmr Docker image..."
	@chmod +x ./infra/build-docker.sh
	@./infra/build-docker.sh

# Start the application
start:
	@echo "🚀 Starting Palmr application..."
	@docker-compose up -d

# Stop the application
stop:
	@echo "🛑 Stopping Palmr application..."
	@docker-compose down

# Show logs
logs:
	@echo "📋 Showing Palmr logs..."
	@docker-compose logs -f

# Clean up containers and images
clean:
	@echo "🧹 Cleaning up Docker containers and images..."
	@docker-compose down -v
	@docker system prune -f
	@echo "✅ Cleanup completed!"

# Access container shell
shell:
	@echo "🐚 Accessing Palmr container shell..."
	@docker-compose exec palmr /bin/sh