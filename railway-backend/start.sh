#!/usr/bin/env bash
set -e

MODEL="${OLLAMA_MODEL:-llama3.2:3b}"

# Start Ollama in the background.
ollama serve &

# Wait until the Ollama API is up.
echo "Wachten tot Ollama draait..."
until curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; do
  sleep 1
done

# Pull the model in the BACKGROUND so the web server (and the /health check) come up immediately.
# On the first deploy the download takes a few minutes; the AI endpoints return an error until it
# finishes, then start working. With a volume on /root/.ollama the model is cached for next time.
(
  if ! ollama list | grep -q "${MODEL%%:*}"; then
    echo "Model ${MODEL} downloaden (op de achtergrond)..."
    ollama pull "${MODEL}" && echo "Model ${MODEL} klaar."
  fi
) &

# Start the FastAPI proxy right away on Railway's assigned port (so /health responds quickly).
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"
