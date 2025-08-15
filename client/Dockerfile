# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy the rest of the app
COPY . .

# Build Next.js
RUN npm run build

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what's needed for runtime
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
