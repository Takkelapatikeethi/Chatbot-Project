import React, { useState, useEffect, useRef } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const getTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔽 Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        sender: "user",
        time: getTime(),
      },
    ]);

    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });

      const data = await response.json();

      // Delay for typing effect
      setTimeout(() => {
        setIsTyping(false);

        setMessages((prev) => [
          ...prev,
          {
            text: data.reply,
            sender: "bot",
            time: getTime(),
          },
        ]);
      }, 1500);

    } catch (error) {
      setIsTyping(false);

      setMessages((prev) => [
        ...prev,
        {
          text: "Server error ❌",
          sender: "bot",
          time: getTime(),
        },
      ]);
    }

    setMessage("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>

        {/* Header */}
        <div style={styles.header}>ChatBot 🤖</div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                alignItems: "center",
              }}
            >
              {/* Bot Icon */}
              {msg.sender === "bot" && (
                <div style={styles.icon}>🤖</div>
              )}

              {/* Message */}
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor:
                    msg.sender === "user" ? "#007bff" : "#f1f1f1",
                  color: msg.sender === "user" ? "#fff" : "#000",
                }}
              >
                <div>{msg.text}</div>
                <div style={styles.time}>{msg.time}</div>
              </div>

              {/* User Icon */}
              {msg.sender === "user" && (
                <div style={styles.icon}>👤</div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
              <div style={styles.icon}>🤖</div>
              <div style={{ ...styles.messageBubble, backgroundColor: "#f1f1f1" }}>
                <div className="typing">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </div>
            </div>
          )}

          {/* Auto Scroll Anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <textarea
            style={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
            rows={1}
          />

          <button style={styles.button} onClick={handleSend}>
            Send
          </button>
        </div>

      </div>

      {/* Typing Animation */}
      <style>
        {`
          .typing span {
            font-size: 20px;
            animation: blink 1.4s infinite;
          }

          .typing span:nth-child(2) {
            animation-delay: 0.2s;
          }

          .typing span:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes blink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#ece5dd",
  },
  chatBox: {
    width: "400px",
    height: "600px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
  },
  header: {
    padding: "15px",
    backgroundColor: "#075e54",
    color: "#fff",
    fontWeight: "bold",
  },
  messages: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
  },
  messageRow: {
    display: "flex",
    marginBottom: "10px",
  },
  messageBubble: {
    padding: "10px 15px",
    borderRadius: "20px",
    maxWidth: "70%",
    whiteSpace: "pre-wrap",
  },
  time: {
    fontSize: "10px",
    marginTop: "5px",
    textAlign: "right",
    opacity: 0.7,
  },
  icon: {
    fontSize: "20px",
    margin: "0 8px",
  },
  inputArea: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    resize: "none",
  },
  button: {
    marginLeft: "10px",
    padding: "10px 15px",
    border: "none",
    backgroundColor: "#075e54",
    color: "#fff",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default App;