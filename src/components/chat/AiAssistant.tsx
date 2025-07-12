import { useEffect, useState, useCallback, RefObject } from "react";
import API from "@/lib/axios";
import { v4 as uuidv4 } from "uuid";
import ChatSidebar from "./ChatSidebar";
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PaperAirplaneIcon, UserCircleIcon, ChatBubbleLeftRightIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface Source {
  source: string;
  page: string;
  content: string;
  exact_page: string | number;
}

interface ChatSession {
  id: string;
  messages: Message[];
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface UploadProps {
  fileInputRef: RefObject<HTMLInputElement>;
  selectedFile: File | null;
  uploading: boolean;
  uploadMessage: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}

const AiAssistant = ({ uploadProps }: { uploadProps?: UploadProps }) => {
  const [sessionId, setSessionId] = useState<string>(() => uuidv4());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize chat when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      try {
        console.log("Attempting to initialize chat...");
        const response = await API.post("/chat/initialize");
        console.log("Chat initialization response:", response.data);
        setInitialized(true);
      } catch (error: any) {
        console.error("Failed to initialize chat:", error);
        alert("Failed to initialize chat. Please try refreshing the page.");
      }
    };
    initializeChat();
  }, []);

  const saveSession = useCallback((sessionId: string, messages: Message[]) => {
    if (messages.length > 0) {
      const sessionData: ChatSession = {
        id: sessionId,
        messages,
        title: messages[0]?.content?.slice(0, 30) + '...' || 'New Chat',
        lastMessage: messages[messages.length - 1]?.content?.slice(0, 30) + '...' || '',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`chat_session_${sessionId}`, JSON.stringify(sessionData));
    } else {
      localStorage.removeItem(`chat_session_${sessionId}`);
    }
  }, []);

  const loadSession = useCallback((sessionId: string): Message[] => {
    const storedSession = localStorage.getItem(`chat_session_${sessionId}`);
    if (storedSession) {
      const sessionData: ChatSession = JSON.parse(storedSession);
      return sessionData.messages;
    }
    return [];
  }, []);

  // Load chat history when session changes
  useEffect(() => {
    if (sessionId && initialized) {
      const loadedMessages = loadSession(sessionId);
      setMessages(loadedMessages);
    }
  }, [sessionId, initialized, loadSession]);

  // Save chat history when messages change
  useEffect(() => {
    if (sessionId) {
      saveSession(sessionId, messages);
    }
  }, [sessionId, messages, saveSession]);

  const handleNewChat = useCallback(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    setInput("");
  }, []);

  const handleSessionSelect = useCallback((selectedSessionId: string) => {
    const loadedMessages = loadSession(selectedSessionId);
    if (loadedMessages.length > 0) {
      setSessionId(selectedSessionId);
      setMessages(loadedMessages);
    }
  }, [loadSession]);

  const handleSend = async () => {
    if (!input.trim() || !initialized) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/chat/query", {
        question: input,
        session_id: sessionId
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response,
        sources: response.data.sources || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === "user";
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`inline-flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
          <UserCircleIcon className={`w-8 h-8 ${isUser ? "text-primary" : "text-muted"}`} />
          <div className={`max-w-[80%] rounded-lg p-4 font-sans shadow-soft ${isUser ? "bg-primary text-white" : "bg-muted/50 text-primary"}`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-semibold mb-2 flex items-center gap-1"><ChatBubbleLeftRightIcon className="w-4 h-4 text-primary" />References:</h4>
                <div className="flex flex-wrap gap-2">
                  {message.sources.map((source, index) => (
                    <div key={index} className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full text-sm border border-muted">
                      <span className="font-medium">{source.source}</span>
                      <span className="text-muted">({source.page})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen" style={{width: '100%'}}>
      <ChatSidebar
        currentSessionId={sessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={`${sessionId}-${index}`}>{renderMessage(message)}</div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="animate-pulse">Thinking...</div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex gap-2 max-w-4xl mx-auto items-center">
            {uploadProps && (
              <>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  ref={uploadProps.fileInputRef}
                  onChange={uploadProps.handleFileChange}
                  className="hidden"
                  disabled={uploadProps.uploading}
                  aria-label="Upload file"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<ArrowUpTrayIcon className="w-5 h-5" />}
                  onClick={() => uploadProps.fileInputRef.current?.click()}
                  disabled={uploadProps.uploading}
                  aria-label="Upload HR Policy File"
                  title="Upload HR Policy File"
                >
                  {""}
                </Button>
                {uploadProps.selectedFile && (
                  <Button
                    onClick={uploadProps.handleUpload}
                    disabled={uploadProps.uploading}
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowUpTrayIcon className="w-4 h-4" />}
                    className="text-xs"
                  >
                    {uploadProps.uploading ? "Uploading..." : `Upload: ${uploadProps.selectedFile.name}`}
                  </Button>
                )}
                {uploadProps.uploadMessage && <div className="text-success ml-2 font-semibold bg-surface px-2 py-1 rounded shadow text-xs">{uploadProps.uploadMessage}</div>}
              </>
            )}
            <Input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 text-black"
              disabled={!initialized || loading}
              aria-label="Ask a question"
            />
            <Button
              onClick={handleSend}
              disabled={!initialized || loading || !input.trim()}
              variant="primary"
              size="md"
              rightIcon={<PaperAirplaneIcon className="w-5 h-5" />}
              aria-label="Send message"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
