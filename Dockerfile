FROM node:22.16.0 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:stable-alpine
COPY --from=builder /dist/FrontLibrary /usr/share/nginx/html
COPY frontend.conf /etc/nginx/conf.d/frontend.conf
EXPOSE 80
