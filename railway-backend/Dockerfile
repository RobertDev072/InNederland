# Ollama + FastAPI auth-proxy for InNederland.ai — deploy on Railway (root directory: railway-backend).
FROM ollama/ollama:latest

# Python + curl for the FastAPI proxy and the startup healthcheck.
RUN apt-get update && apt-get install -y python3 python3-pip curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

COPY . .

# Ollama must listen on all interfaces inside the container.
ENV OLLAMA_HOST=0.0.0.0
# The model is pulled at startup (see start.sh); override via the OLLAMA_MODEL env var on Railway.
ENV OLLAMA_MODEL=llama3.2:3b

# The base image sets ENTRYPOINT ["/bin/ollama"]; reset it so our CMD (bash) runs.
ENTRYPOINT []
CMD ["bash", "start.sh"]
