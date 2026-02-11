# Telemetric Monitoring Service

Backend-система для сбора, хранения и визуализации логов и метрик, разработанная для внутреннего использования в компании и внедрённая в рабочую инфраструктуру.

## О проекте

Сервис предназначен для мониторинга микросервисных приложений:
- централизованный сбор логов
- сбор технических метрик
- экспорт в Prometheus
- визуализация в Grafana
- WebSocket-уведомления
- сервисная авторизация

## Технологии
- Node.js / NestJS
- TypeScript
- PostgreSQL
- TypeORM
- Docker / Docker Compose
- Prometheus
- Grafana
- Loki
- WebSocket

## Запуск
### Требования
1. Docker
2. Docker Compose

### Старт
```bash 
git clone <repo-url>
cd telemetric-monitoring

cp .env.example .env
docker-compose up -d
```

## Сервисы
|Service	|Address              |
|-----------|---------------------|
|API	    |http://localhost:3000|
|Grafana	|http://localhost:3001|
|Prometheus	|http://localhost:9090|

## Архитектура
```
Client Systems
      ↓
  NestJS API
      ↓
 PostgreSQL
      ↓
Monitoring Stack
(Prometheus / Loki / Grafana)
```

## Безопасность
- Авторизация через сервисные токены
- Ограничение доступа к API
- Разделение прав доступа

## API (основное)
1. Логи
```bash
POST /logs
GET  /logs
```
2. Метрики
```bash
GET /metrics
```

## Мониторинг
Метрики и логи собираются и отображаются в Grafana через Prometheus и Loki.

Поддерживаются:
- latency
- error rate
- throughput
- DB metrics
- custom metrics

## Хранение данных
Используется PostgreSQL.
- Миграции
- Версионирование схемы
- Индексация

## Тестирование
```bash
npm run test
npm run test:e2e
```

## Author
Boyarshinov Artem

## License
MIT