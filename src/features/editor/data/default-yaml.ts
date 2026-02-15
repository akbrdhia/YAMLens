export const DEFAULT_YAML = `version: '3.8'
services:
  frontend:
    image: nginx:alpine
    container_name: frontend
    ports:
      - "80:80"
      - "443:443"
    networks:
      - frontend-network
    depends_on:
      - backend
  
  backend:
    build:
      context: ./backend
    ports:
      - "3000:3000"
    networks:
      - frontend-network
      - backend-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
  
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    networks:
      - backend-network
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - backend-network

networks:
  frontend-network:
  backend-network:

volumes:
  postgres-data:
  redis-data:
`;