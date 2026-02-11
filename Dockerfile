##################################################
#              INSTALL DEPENDENCIES              #
##################################################
FROM node:18-alpine AS nodemodules

WORKDIR /app

# Установка Nest CLI глобально
RUN npm install -g @nestjs/cli

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install && \
    npm install ts-node && \
    chmod -R 777 /app/node_modules/.bin

##################################################
#              BUILD FOR PRODUCTION              #
##################################################
FROM node:18-alpine AS build

WORKDIR /app

# Копируем исходный код
COPY . .

# Копируем node_modules
COPY --from=nodemodules /app/node_modules ./node_modules

# Собираем приложение
RUN npm run build

##################################################
#                   DEVELOPMENT                  #
##################################################
FROM node:18-alpine AS development

WORKDIR /app

# Установка Nest CLI глобально
RUN npm install -g @nestjs/cli

# Копируем все файлы
COPY . .

# Устанавливаем зависимости
RUN npm install && \
    chmod -R 777 /app/node_modules/.bin

CMD ["npm", "run", "start:dev"]

##################################################
#                   PRODUCTION                   #
##################################################
FROM node:18-alpine AS production

WORKDIR /app

# Устанавливаем bash
RUN apk update && apk add bash

# Копируем node_modules
COPY --from=nodemodules /app/node_modules ./node_modules

# Копируем собранный код
COPY --from=build /app/dist ./dist

# Копируем файлы для миграций
RUN mkdir -p ./src/config && \
    mkdir -p ./src/migrations
COPY src/config/typeorm.ts ./src/config/typeorm.ts
COPY src/migrations ./src/migrations

# Копируем entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

CMD ["node", "--max-old-space-size=8192", "/app/dist/main.js"]