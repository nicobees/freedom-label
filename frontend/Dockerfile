# syntax=docker/dockerfile:1

# Builder stage
FROM node:20.11.0-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Runtime stage
FROM nginx:1.25.3-alpine as runtime

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]