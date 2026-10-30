# ==========================================
# Multi-stage Dockerfile for Personal Dashboard
# Full-Stack: React 18 (Vite) + Express + SQLite
# ==========================================

# Stage 1: Build the Frontend Static Assets
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies (including devDependencies for Vite & Tailwind)
RUN npm install

# Copy application source code
COPY . .

# Build production frontend bundle into /app/dist
RUN npm run build

# Stage 2: Production Runtime Image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy package definitions and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server code and shared modules
COPY server ./server
COPY src/constants/initialData.js ./src/constants/initialData.js
COPY src/utils/linkClassifier.js ./src/utils/linkClassifier.js

# Create directory for persistent SQLite database
RUN mkdir -p /app/data

# Persistent storage volume for SQLite
VOLUME ["/app/data"]

EXPOSE 5000

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server/server.js"]
