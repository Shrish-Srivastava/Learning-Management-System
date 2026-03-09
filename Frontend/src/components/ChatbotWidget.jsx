import { Bot, LoaderCircle, MessageSquare, Send, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../lib/api";

const starterPrompts = [
  "Which course should I start with",
  "What can I learn from the Java course",
  "Help me understand the admin section",
];

function ChatbotWidget() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello. I am SkillUp AI. I can help you understand courses, guide your next learning step, and explain how to use the platform.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const recentHistory = useMemo(
    () => messages.slice(-6).map(({ role, content }) => ({ role, content })),
    [messages]
  );

  if (!isAuthenticated) {
    return null;
  }

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chatbot/message", {
        message: trimmed,
        page: location.pathname,
        history: recentHistory,
      });

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "SkillUp AI is unavailable right now. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <div className="chatbot-shell">
      {isOpen && (
        <section className="chatbot-panel glass-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-badge">
                <Bot size={16} />
              </span>
              <div>
                <strong>SkillUp AI</strong>
                <span>{user?.role === "ADMIN" ? "Admin guidance" : "Learning guidance"}</span>
              </div>
            </div>
            <button
              className="chatbot-icon-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chatbot-message ${message.role === "user" ? "user" : "assistant"}`}
              >
                <p>{message.content}</p>
              </div>
            ))}
            {loading && (
              <div className="chatbot-message assistant typing">
                <LoaderCircle size={16} className="spin" />
                <p>SkillUp AI is thinking</p>
              </div>
            )}
          </div>

          <div className="chatbot-prompts">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                className="chatbot-prompt"
                onClick={() => sendMessage(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="chatbot-form" onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about courses learning flow or admin usage"
              rows={2}
            />
            <button className="button primary-button" type="submit" disabled={loading || !input.trim()}>
              <Send size={16} />
              Send
            </button>
          </form>
        </section>
      )}

      <button className="chatbot-toggle button primary-button" onClick={() => setIsOpen((open) => !open)}>
        <MessageSquare size={18} />
        {isOpen ? "Hide SkillUp AI" : "SkillUp AI"}
      </button>
    </div>
  );
}

export { ChatbotWidget };
