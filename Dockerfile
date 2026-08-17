FROM node:20-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY ola-sync/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt fastapi uvicorn pydantic psycopg2-binary
COPY . .
COPY --from=frontend-builder /app/dist ./dist

ENV PORT=8080
CMD exec uvicorn api:app --host 0.0.0.0 --port ${PORT}
