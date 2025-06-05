# Use official Node.js image as a base
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Change ownership of the working directory first
RUN chown node:node /app

# Switch to node user early
USER node

# Copy package.json and package-lock.json first
COPY --chown=node:node package*.json ./

# Install dependencies (as node user)
RUN npm install

# Copy the rest of the application (excluding node_modules via .dockerignore)
COPY --chown=node:node . .

# Create necessary directories with proper permissions
RUN mkdir -p /app/.next /app/.next/types /app/.next/cache

# Start the application
CMD ["npm", "run", "dev"]