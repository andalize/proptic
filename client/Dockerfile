# Use official Node.js image with smaller footprint
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package files first for better caching
COPY --chown=nextjs:nodejs package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy the rest of the application
COPY --chown=nextjs:nodejs . .

# Build the application
RUN npm run build

# Switch to non-root user
USER nextjs

# Create necessary directories
RUN mkdir -p .next/cache

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Start the application
CMD ["npm", "start"]