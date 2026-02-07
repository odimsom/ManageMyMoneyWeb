# Build Stage
FROM node:22-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Accept VITE_API_URL as a build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
# Copy config as a template to a custom location to avoid auto-processing by the nginx entrypoint
COPY nginx.conf /etc/nginx/nginx.conf.template

EXPOSE 80

# Explicitly substitute only $PORT to avoid breaking $uri and other Nginx variables
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
