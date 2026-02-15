export const DEFAULT_YAML = `version: '3.8'

services:
  # Frontend Application
  frontend:
    image: node:18-alpine
    container_name: yamlens-web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=http://backend:8000
    depends_on:
      - backend
    networks:
      - app-net

  # Backend API
  backend:
    image: python:3.9-slim
    command: uvicorn main:app --host 0.0.0.0 --port 8000
    ports:
      - "8000:8000"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
    networks:
      - app-net

  # Database
  db:
    image: postgres:14
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=app_db
    networks:
      - app-net

  # Cache
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    networks:
      - app-net

  # Monitoring
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - app-net

networks:
  app-net:
    driver: bridge

volumes:
  db_data:
`;
