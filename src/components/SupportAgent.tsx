import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  X, 
  Send, 
  MessageSquare, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  Cpu,
  Loader2,
  Volume2,
  VolumeX
} from "lucide-react";
import { API } from "../lib/api";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export default function SupportAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const cached = localStorage.getItem("james_tech_support_chat");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
      }
    } catch (err) {
      console.error("Error reading support chat from localStorage:", err);
    }
    return [
      {
        id: "welcome",
        sender: "bot",
        text: "Hello! I am James Bot, your automated technical support assistant. How can I help you optimize or deploy your technical project scope today?",
        timestamp: new Date()
      }
    ];
  });
  
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const cached = localStorage.getItem("james_tech_support_muted");
      return cached === "true";
    } catch (err) {
      return false;
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewBadge, setHasNewBadge] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Cache messages on change
  useEffect(() => {
    try {
      localStorage.setItem("james_tech_support_chat", JSON.stringify(messages));
    } catch (err) {
      console.error("Error writing support chat to localStorage:", err);
    }
  }, [messages]);

  // Cache mute preference on change
  useEffect(() => {
    try {
      localStorage.setItem("james_tech_support_muted", String(isMuted));
    } catch (err) {
      console.error("Error writing support mute preference to localStorage:", err);
    }
  }, [isMuted]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewBadge(false);
      // Auto-focus input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, messages, isTyping]);

  // Audio synthesizer for incoming and outgoing notifications
  const playSound = (type: "send" | "receive") => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === "send") {
        // Sent message: soft mechanical sweep
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else {
        // Received message: electronic double-chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      }
    } catch (e) {
      console.warn("AudioContext playback blocked or unsupported:", e);
    }
  };

  // Handle standard quick responses
  const handleQuickReply = async (text: string) => {
    await handleSendMessage(text);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    playSound("send");
    setInputValue("");
    setIsTyping(true);

    try {
      // Create messages list matching support agent API format
      const history = [...messages, userMsg].map((msg) => ({
        sender: msg.sender,
        text: msg.text
      }));

      // Call Gemini API on backend via frontend client proxy
      const replyText = await API.sendSupportChat(history);

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
      playSound("receive");
    } catch (err) {
      console.error("Support chat error:", err);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: "bot",
        text: "I encountered an error connecting to our system cluster. Please contact us directly at phone: 0922067302 or email: yaikobdiriba22@gmail.com.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
      playSound("receive");
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm("Would you like to reset the support conversation?")) {
      setMessages([
        {
          id: "welcome-reset",
          sender: "bot",
          text: "Chat history cleared. How can I assist you with James Tech services today?",
          timestamp: new Date()
        }
      ]);
    }
  };

  const quickReplies = [
    { text: "What are your services?", label: "Our Services" },
    { text: "Direct contact info?", label: "Phone & Email" },
    { text: "Where is Silicon Valley HQ?", label: "Our Location" },
    { text: "How can I submit a project scope?", label: "Submit Scope" }
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="support-agent-trigger-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/20 group"
          aria-label="Toggle Support Chatbot"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
          ) : (
            <div className="relative">
              <Bot className="w-6 h-6 transition-transform group-hover:scale-110 duration-200" />
              {/* Online/Active pulsating indicator */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
          )}

          {/* Toast Notification for First-time user */}
          {hasNewBadge && !isOpen && (
            <span className="absolute -top-1 -left-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="support-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[420px] h-[550px] bg-slate-950 border border-slate-900 rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-900 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-2xl text-white">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">James Bot</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-semibold text-emerald-400 font-mono">SUPPORT ONLINE</span>
                    <span className="text-[9px] text-slate-500 font-mono">• SECURE CHAT</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {/* Mute/Unmute audio button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? "Unmute support sounds" : "Mute support sounds"}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
                {/* Reset Chat button */}
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {/* Close Chat button */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close support window"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Contacts Banner */}
            <div className="bg-blue-950/20 border-b border-slate-900 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <a href="tel:0922067302" className="hover:text-white transition-colors font-semibold">
                  0922067302
                </a>
              </div>
              <div className="h-3.5 w-[1px] bg-slate-900" />
              <div className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <a href="mailto:yaikobdiriba22@gmail.com" className="hover:text-white transition-colors font-semibold">
                  yaikobdiriba22@gmail.com
                </a>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.sender === "bot" && (
                      <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 shrink-0 mt-0.5 text-blue-500">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white rounded-tr-none font-semibold shadow-md"
                            : "bg-slate-900 text-slate-200 border border-slate-900 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className={`text-[9px] text-slate-600 mt-1 block px-1 font-mono ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bot is typing visual cue */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5 max-w-[85%] flex-row">
                    <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 shrink-0 mt-0.5 text-blue-500">
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="bg-slate-900 text-slate-400 px-3.5 py-3 rounded-2xl rounded-tl-none border border-slate-900 flex items-center space-x-1.5 shadow-sm">
                      <span className="text-[10px] text-slate-500 font-medium font-mono mr-1">typing</span>
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies Options */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-slate-950 border-t border-slate-900/50">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 text-left">Quick Topics:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply.text)}
                      className="text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-850 hover:border-blue-500/50 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1 shadow-sm"
                    >
                      <span>{reply.label}</span>
                      <ArrowRight className="w-3 h-3 text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-4 bg-slate-900 border-t border-slate-900/50 flex gap-2 items-center"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your support request..."
                disabled={isTyping}
                className="flex-1 bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-600 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer shadow-md"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
