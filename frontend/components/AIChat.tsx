import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  time: string;
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>(() => {
    const saved = localStorage.getItem("ai_chat_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const formatTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const createMessage = (role: Role, content: string): Message => ({
    id: crypto.randomUUID(),
    role,
    content,
    time: formatTime(),
  });

  /* ================= Welcome Message ================= */
  useEffect(() => {
    if (open && chat.length === 0) {
      const timer = setTimeout(() => {
        setChat([
          createMessage(
            "assistant",
            `👋 **Welcome to Rohit's AI Resume Assistant**

You can ask about:

- 💼 Projects & Architecture  
- 🚀 Technologies & Stack  
- 🧠 Experience & Internships  
- 📊 System Design Decisions  

How can I assist you today?`
          ),
        ]);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [open]);

  /* ================= Persist Chat ================= */
  useEffect(() => {
    localStorage.setItem("ai_chat_history", JSON.stringify(chat));
  }, [chat]);

  /* ================= Auto Scroll ================= */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  /* ================= Auto Resize ================= */
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [message]);

  /* ================= ESC Close ================= */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ================= Send Message ================= */
  const sendMessage = useCallback(async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage("");
    setLoading(true);

    setChat((prev) => [...prev, createMessage("user", userMessage)]);

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

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        createMessage(
          "assistant",
          data.response || "No response available."
        ),
      ]);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setChat((prev) => [
          ...prev,
          createMessage(
            "assistant",
            "⚠ Unable to connect to AI service."
          ),
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [message, loading]);

  const clearChat = () => {
    setChat([]);
    localStorage.removeItem("ai_chat_history");
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  /* ================= Render ================= */
  return (
    <>
      {/* Floating Button */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50
          bg-gradient-to-br from-indigo-600 to-purple-600
          text-white p-4 rounded-full shadow-2xl
          focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <MessageCircle size={22} />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Chat Container */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="
              fixed bottom-0 sm:bottom-6 right-0 sm:right-6
              w-full sm:w-[440px]
              h-full sm:h-[650px]
              bg-white dark:bg-slate-900
              border-t sm:border border-slate-200 dark:border-slate-700
              rounded-none sm:rounded-3xl
              shadow-2xl flex flex-col overflow-hidden z-50"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-5 py-4
              bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <Bot size={18} />
                  <div>
                    <h3 className="font-semibold">
                      AI Resume Assistant
                    </h3>
                    <p className="text-xs opacity-80">
                      Intelligent • Structured • Secure
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={clearChat}
                    className="hover:opacity-80 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="hover:opacity-80 transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                {chat.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-600
                          text-white px-4 py-2 rounded-2xl rounded-br-sm
                          max-w-[80%] text-sm shadow-md">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            {msg.content}
                          </div>
                          <div className="text-[10px] opacity-70 mt-1 text-right">
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start relative">
                        <div className="bg-slate-100 dark:bg-slate-800
                          text-slate-900 dark:text-slate-100
                          px-5 py-3 rounded-2xl rounded-bl-sm
                          max-w-[85%] shadow-md relative">

                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                          <button
                            onClick={() =>
                              copyToClipboard(msg.id, msg.content)
                            }
                            className="absolute top-2 right-2 opacity-40 hover:opacity-100 transition"
                          >
                            {copiedId === msg.id ? (
                              <Check size={14} />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>

                          <div className="text-[10px] opacity-60 mt-2">
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-100">•</span>
                    <span className="animate-bounce delay-200">•</span>
                    <span>AI is typing...</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-900 flex gap-3">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask about projects, skills, or experience..."
                  rows={1}
                  className="flex-1 resize-none px-4 py-2 text-sm rounded-xl
                  border border-slate-300 dark:border-slate-700
                  bg-white dark:bg-slate-800
                  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                  onClick={sendMessage}
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