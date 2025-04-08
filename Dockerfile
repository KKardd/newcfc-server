# Use a minimal Node.js Alpine image as builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install --global pnpm

# Copy package.json and pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --production

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

RUN if [ -n "$SENTRY_ORG" ] && [ -n "$SENTRY_PROJECT" ] && [ -n "$SENTRY_AUTH_TOKEN" ]; then \
  npm install --global @sentry/cli && \
  sentry-cli sourcemaps inject --quiet ./dist && \
  sentry-cli sourcemaps upload --quiet ./dist; \
  else \
  echo "SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN is not set. Skip sentry-cli sourcemaps upload."; \
  fi

# Start a new stage for the final production image
FROM node:20-alpine AS production

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install pm2 globally
RUN npm install --global pm2

# Copy built files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/ecosystem.config.js ./

# Expose port
EXPOSE 3000

# Start the application using pm2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
