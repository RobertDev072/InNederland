# InNederland.ai — AI-backend (Ollama op Railway)

Zelf-gehoste, gratis AI (open-source model via [Ollama](https://ollama.com)) achter een kleine
FastAPI-proxy met authenticatie. De Next.js-frontend (op Vercel) praat hier server-side mee, zodat de
AI-coach, schrijf-/spreekfeedback en woorduitleg werken zonder een betaalde API.

## Wat zit hierin

- `Dockerfile` — Ollama-image + Python + de proxy. Reset de ENTRYPOINT en start via `start.sh`.
- `start.sh` — start Ollama, pullt het model (`OLLAMA_MODEL`), start daarna de FastAPI-proxy op `$PORT`.
- `main.py` — proxy met bearer-authenticatie. Endpoints: `/health`, `/generate`, `/chat`, `/api/chat`.
- `requirements.txt` — fastapi, uvicorn, ollama.

## Deployen op Railway

1. Railway → **New Project** → **Deploy from GitHub repo** → kies deze repo (`RobertDev072/InNederland`).
2. In de service-settings: zet **Root Directory** op `railway-backend` (belangrijk — anders pakt Railway de
   Next.js-app in de repo-root).
3. Railway detecteert de `Dockerfile` automatisch.
4. **Variables** (Settings → Variables):
   - `BACKEND_API_KEY` = een zelfgekozen geheim (bijv. een lange willekeurige string). Verplicht.
   - `OLLAMA_MODEL` = `llama3.2:3b` (snel) of `llama3.1:8b` (beter, maar trager op CPU). Optioneel.
5. **Volume** (aanrader): voeg een volume toe gemount op `/root/.ollama`, zodat het model niet bij elke
   herstart opnieuw wordt gedownload.
6. Deploy. Na afloop krijg je een URL zoals `https://jouw-service.up.railway.app`.
7. Test: open `https://jouw-service.up.railway.app/health` → `{"status":"ok","model":"..."}`.

## Koppelen aan de frontend (Vercel)

Zet in Vercel (Project → Settings → Environment Variables), server-side:

- `OLLAMA_BACKEND_URL` = de Railway-URL (zonder slash op het einde)
- `OLLAMA_BACKEND_KEY` = dezelfde waarde als `BACKEND_API_KEY` op Railway

Zodra deze staan, gebruiken alle AI-functies automatisch jouw Railway-model in plaats van Gemini.
Voor lokaal testen kun je dezelfde twee variabelen in `.env.local` zetten.

## Eerlijk over snelheid (belangrijk)

Railway draait standaard op **CPU (geen GPU)**. Een model draait dan, maar:

- `llama3.2:3b` — snelst; antwoorden van een paar seconden; kwaliteit is prima voor eenvoudige
  taaltutoring, minder sterk bij complexe B1/B2-uitleg. **Aanbevolen om mee te starten.**
- `llama3.1:8b` — betere kwaliteit, maar op CPU merkbaar traag (kan 15-45 sec per antwoord duren) en
  vraagt ~6-8 GB RAM.

Je kunt het model wisselen via de `OLLAMA_MODEL`-variabele (met een volume hoeft dat maar één keer te
downloaden). De cursus-oefeningen zelf (lezen/luisteren met opgeslagen antwoorden) werken sowieso zonder
AI; de AI is alleen voor coach + live feedback + woorduitleg.
