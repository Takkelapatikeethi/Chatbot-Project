const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Fake AI Chat API
app.post("/message", (req, res) => {
  const userMessage = req.body.text.toLowerCase();

  let reply = "";

  if (userMessage.includes("hello")) {
    reply = "hello";
  } else if (userMessage.includes("react")) {
    reply = "React is a JavaScript library used to build user interfaces.";
  } else if (userMessage.includes("node")) {
    reply = "Node.js is used to build backend servers using JavaScript.";
  } else if (userMessage.includes("how are you")) {
    reply = "I'm just a bot 🤖, but I'm doing great!";
  } else {
    reply = "I’m a demo bot 🤖. You said: " + req.body.text;
  }

  res.json({ reply });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
