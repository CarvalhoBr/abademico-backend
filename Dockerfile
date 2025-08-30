FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for development)
RUN npm ci

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the working directory
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

# Use dev script for development with hot reload
CMD ["npm", "run", "dev"]
