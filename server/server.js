require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 5000;
const apiBaseUrl = process.env.OPENAI_BASE_URL;
const providerName = apiBaseUrl ? "AI provider" : "OpenAI";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  ...(apiBaseUrl ? { baseURL: apiBaseUrl } : {}),
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));

function getOpenAIErrorReply(error) {
  if (error.code === "insufficient_quota") {
    return {
      status: 429,
      reply:
        `${providerName} quota exceeded. Please check your billing or credits.`,
    };
  }

  if (error.status === 401 || error.code === "invalid_api_key") {
    return {
      status: 401,
      reply: `${providerName} API key is invalid. Please check server/.env.`,
    };
  }

  if (error.status === 429) {
    return {
      status: 429,
      reply: `${providerName} is rate limiting requests. Please try again shortly.`,
    };
  }

  return {
    status: 500,
    reply: `Sorry, I could not get a response from ${providerName} right now.`,
  };
}

function isOpenRouter() {
  return apiBaseUrl && apiBaseUrl.includes("openrouter.ai");
}

function buildUserInput(userMessage, fileContext) {
  if (!fileContext?.content) {
    return userMessage;
  }

  return [
    "Use the uploaded file information as context when it is relevant.",
    `Uploaded file: ${fileContext.name || "uploaded-file"}`,
    "",
    fileContext.content,
    "",
    `User question: ${userMessage}`,
  ].join("\n");
}

async function createChatbotReply(userMessage, fileContext) {
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const instructions = "You are a helpful, friendly chatbot. Keep replies concise.";
  const input = buildUserInput(userMessage, fileContext);

  if (isOpenRouter()) {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: input },
      ],
    });

    return response.choices?.[0]?.message?.content;
  }

  const response = await openai.responses.create({
    model,
    instructions,
    input,
  });

  return response.output_text;
}

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/message", async (req, res) => {
  const userMessage = req.body.text;
  const fileContext = req.body.fileContext;

  if (!userMessage || userMessage.trim() === "") {
    return res.status(400).json({ reply: "Please send a message." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      reply: "API key is missing. Add OPENAI_API_KEY to server/.env.",
    });
  }

  try {
    const reply = await createChatbotReply(userMessage, fileContext);

    res.json({
      reply:
        reply ||
        `I received your message, but ${providerName} returned an empty response.`,
    });
  } catch (error) {
    console.error(`${providerName} API error:`, error);

    const { status, reply } = getOpenAIErrorReply(error);
    res.status(status).json({ reply });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
