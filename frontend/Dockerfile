# Stage 1 - Build
FROM node:22-alpine as builder

WORKDIR /app

# 1. Копируем только файлы зависимостей
COPY package.json package-lock.json ./

# 2. Устанавливаем зависимости
RUN npm ci --silent

# 3. Копируем остальные файлы (с исключением через .dockerignore)
COPY . .

# 4. Сборка проекта
RUN npm run build

# Stage 2 - Serve
FROM nginx:alpine

# 5. Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# 6. Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]