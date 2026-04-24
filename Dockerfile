# Stage 1: Build static frontend
FROM node:20-alpine AS node-builder
WORKDIR /app
# Copy templates first — page.tsx reads them at build time via fs.readFileSync
COPY templates/ ./templates/
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Stage 2: Python runtime serving API + static files
FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app/backend
# Install dependencies (cached layer — only re-runs if pyproject.toml changes)
COPY backend/pyproject.toml backend/uv.lock* ./
RUN uv sync --frozen --no-dev 2>/dev/null || uv sync --no-dev
# Copy backend source
COPY backend/app ./app
# Copy templates and catalog for runtime serving
COPY templates/ /app/templates/
COPY catalog.json /app/catalog.json
# Copy compiled frontend static files
COPY --from=node-builder /app/frontend/out /app/static
RUN mkdir -p /data
EXPOSE 8000
HEALTHCHECK CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')" || exit 1
CMD [".venv/bin/python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
