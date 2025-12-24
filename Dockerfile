# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.1.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

################################################################################
# Create a stage for building the application.
FROM base as build

# Copy all package.json files first (for yarn workspaces)
COPY package.json yarn.lock ./
COPY packages/client/package.json ./packages/client/
COPY packages/server/package.json ./packages/server/

# Install all dependencies (including devDependencies needed for build)
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Run the build script.
RUN yarn run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Use production node environment by default.
ENV NODE_ENV production

# Copy package.json files for yarn workspaces
COPY package.json yarn.lock ./
COPY packages/server/package.json ./packages/server/

# Install only production dependencies
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

# Copy the built application from the build stage
COPY --from=build /usr/src/app/packages/server/dist ./packages/server/dist
COPY --from=build /usr/src/app/packages/client/build ./packages/client/build

# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 4000

# Run the application with NODE_PATH for TypeScript path aliases
ENV NODE_PATH=/usr/src/app/packages/server/dist
CMD ["node", "packages/server/dist/index.js"]
