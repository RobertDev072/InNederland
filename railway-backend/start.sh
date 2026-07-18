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

# Pull the model if it isn't already present (persisted via a Railway volume on /root/.ollama).
if ! ollama list | grep -q "${MODEL%%:*}"; then
  echo "Model ${MODEL} downloaden..."
  ollama pull "${MODEL}"
fi

# Start the FastAPI proxy on Railway's assigned port.
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"
