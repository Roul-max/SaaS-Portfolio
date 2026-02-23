import {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  KeyboardEvent,
} from "react";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ============================================================
   Types
============================================================ */

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  status: "sent" | "error";
}

/* ============================================================
   Utility Helpers
============================================================ */

const formatTime = (): string =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const createMessage = (
  role: Role,
  content: string,
  status: "sent" | "error" = "sent"
): Message => ({
  id: crypto.randomUUID(),
  role,
  content,
  timestamp: formatTime(),
  status,
});

/* ============================================================
   Message Bubble (Memoized)
============================================================ */

interface BubbleProps {
  message: Message;
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
}

const MessageBubble = memo(({ message, copiedId, onCopy }: BubbleProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          relative max-w-[85%] rounded-2xl px-5 py-3 shadow-lg
          ${
            isUser
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm"
              : "bg-white/70 dark:bg-slate-800/70 backdrop-blur-md text-slate-900 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-700"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
          {isUser ? <User size={14} /> : <Bot size={14} />}
          <span>{isUser ? "You" : "AI Assistant"}</span>
        </div>

        {/* Markdown Content */}
        <div className="prose prose-sm dark:prose-invert max-w-none
          prose-p:leading-relaxed
          prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400">
          {isUser ? (
            <p className="m-0">{message.content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Copy Button for Assistant */}
        {!isUser && (
          <button
            onClick={() => onCopy(message.id, message.content)}
            className="absolute top-2 right-2 opacity-40 hover:opacity-100 transition"
            aria-label="Copy message"
          >
            {copiedId === message.id ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}

        {/* Timestamp */}
        <div className="text-[10px] opacity-50 mt-2 text-right">
          {message.timestamp}
        </div>
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = "MessageBubble";

/* ============================================================
   Main Component
============================================================ */

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem("ai_chat_history");
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* ============================================================
     Effects
  ============================================================ */

  // Persist messages
  useEffect(() => {
    localStorage.setItem("ai_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [input]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler as any);
    return () => window.removeEventListener("keydown", handler as any);
  }, []);

  /* ============================================================
     Handlers
  ============================================================ */

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setError(null);

    setMessages((prev) => [...prev, createMessage("user", userMessage)]);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
          signal: abortRef.current.signal,
        }
      );

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        createMessage(
          "assistant",
          data.response || "No response received."
        ),
      ]);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError("Failed to connect to AI service.");
        setMessages((prev) => [
          ...prev,
          createMessage(
            "assistant",
            "⚠ Unable to connect to AI service.",
            "error"
          ),
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("ai_chat_history");
  };

  /* ============================================================
     Render
  ============================================================ */

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-6 right-6 z-50
            bg-gradient-to-br from-indigo-600 to-purple-600
            text-white p-4 rounded-full shadow-2xl"
          onClick={() => setOpen(true)}
        >
          <Sparkles size={20} />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-6 right-6
                w-[95%] sm:w-[460px]
                h-[90vh] sm:h-[650px]
                bg-white dark:bg-slate-900
                border border-slate-200 dark:border-slate-700
                rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4
                bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bot size={18} />
                    AI Resume Assistant
                  </h3>
                  <p className="text-xs opacity-80">
                    Intelligent · Structured · Secure
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={clearChat}>
                    <Trash2 size={18} />
                  </button>
                  <button onClick={() => setOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    copiedId={copiedId}
                    onCopy={handleCopy}
                  />
                ))}

                {loading && (
                  <div className="text-sm text-slate-400 animate-pulse">
                    AI is thinking...
                  </div>
                )}

                {error && (
                  <div className="text-xs text-red-500">{error}</div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask about projects, skills, or experience..."
                  className="flex-1 resize-none px-4 py-2 text-sm rounded-xl
                    border border-slate-300 dark:border-slate-700
                    bg-white dark:bg-slate-800
                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl
                    bg-indigo-600 text-white
                    hover:bg-indigo-700 transition
                    disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}