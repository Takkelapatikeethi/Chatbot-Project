# Chatbot Project

React chatbot frontend with an Express backend that calls the OpenAI API.

## Setup

1. Install backend dependencies:

```bash
cd server
npm install
```

2. Create `server/.env` from `server/.env.example`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
OPENAI_BASE_URL=
PORT=5000
```

3. Install frontend dependencies:

```bash
cd ../chat_bot
npm install
```

## Run

Start the backend:

```bash
cd server
npm start
```

Start the frontend in another terminal:

```bash
cd chat_bot
npm start
```

Open `http://localhost:3000`. The React app sends messages to
`http://localhost:5000/message`, and the backend keeps your OpenAI API key out
of the browser.

## Current OpenAI Notes

- The OpenAI integration lives in `server/server.js`.
- Keep `OPENAI_API_KEY` only in `server/.env`; `.env` files are ignored by Git.
- If the bot replies that quota is exceeded, the API key is working but the
  OpenAI account or project needs billing/credits.

## OpenRouter Option

OpenRouter keys usually start with `sk-or-v1-`. To use one, set your
`server/.env` like this:

```env
OPENAI_API_KEY=your_openrouter_key_here
OPENAI_MODEL=openai/gpt-5.4-nano
OPENAI_BASE_URL=https://openrouter.ai/api/v1
PORT=5000
```

The server will use the OpenAI Responses API for direct OpenAI keys and the
OpenAI-compatible chat endpoint when `OPENAI_BASE_URL` points to OpenRouter.
