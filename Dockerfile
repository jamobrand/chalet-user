FROM node:20.14-bullseye-slim AS build

# Specify working directory other than /
WORKDIR /usr/src/app

# Copy only files required to install
# dependencies (better layer caching)
COPY package*.json ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm ci

# Copy .env file
COPY .env ./

COPY . .

RUN npm run build 

# Use separate stage for deployable image
FROM nginxinc/nginx-unprivileged:1.23-alpine-perl

# Use COPY --link to avoid breaking cache if we change the second stage base image
COPY --link nginx.conf /etc/nginx/conf.d/default.conf

COPY --link --from=build usr/src/app/dist/ /usr/share/nginx/html

# Copy .env file to the nginx html directory
COPY --link --from=build usr/src/app/.env /usr/share/nginx/html/.env

EXPOSE 4600

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]