# Stage 1: Build Frontend
FROM node:20-slim AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend Runtime
FROM python:3.12-slim

# Install system dependencies (FFmpeg is required)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend Code
COPY backend/ ./backend

# Copy Built Frontend Assets from Stage 1
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 8000

# Run command
# We run from /app, so the module is backend.main
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
