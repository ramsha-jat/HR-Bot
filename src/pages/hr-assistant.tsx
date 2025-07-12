import React, { useEffect, useState, useRef } from "react";
import hrLogo from "@/assets/hr.jpg";
import {
  getThreads,
  createThread,
  deleteThread,
  getMessages,
  sendMessage,
  uploadFile,
} from "@/services/hrAssistantService";
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PlusIcon, TrashIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const HrAssistantPage = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [newThreadName, setNewThreadName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getThreads().then((data) => {
      setThreads(data);
      if (data.length && !activeId) setActiveId(data[0].id);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activeId) {
      getMessages(activeId).then(setMessages);
    }
  }, [activeId]);

  const handleCreateThread = async () => {
    if (!newThreadName.trim()) return;
    const thread = await createThread(newThreadName);
    setThreads((prev) => [...prev, thread]);
    setActiveId(thread.id);
    setNewThreadName("");
    setMessages([]);
  };

  const handleDeleteThread = async (id: string) => {
    await deleteThread(id);
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;
    setLoading(true);
    const msgs = await sendMessage(activeId, input);
    setMessages(msgs);
    setInput("");
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeId || !e.target.files || !e.target.files[0]) return;
    setLoading(true);
    await uploadFile(activeId, e.target.files[0]);
    setLoading(false);
    alert("File uploaded!");
    e.target.value = "";
  };

  return (
    <div className="relative flex h-screen w-screen bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-surface shadow-2xl rounded-r-2xl flex flex-col p-6 z-10 min-h-screen">
        <div className="flex flex-col items-center mb-8">
          <img src={hrLogo} alt="Ask AI Logo" className="w-16 h-16 rounded-full shadow-lg border-4 border-white mb-2" />
          <h2 className="text-xl font-extrabold text-primary tracking-tight mb-2 font-sans">Ask AI</h2>
          <p className="text-primary/70 text-xs text-center">Chats & Documents</p>
        </div>
        <div className="flex-1 overflow-y-auto mb-4">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer mb-2 transition-colors group ${activeId === thread.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
              onClick={() => setActiveId(thread.id)}
              tabIndex={0}
              aria-label={`Open chat session ${thread.name}`}
              onKeyDown={e => { if (e.key === 'Enter') setActiveId(thread.id); }}
            >
              <span className="truncate font-medium flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary/60" />
                {thread.name}
              </span>
              <Button
                variant="danger"
                size="sm"
                leftIcon={<TrashIcon className="w-4 h-4" />}
                className="ml-2 !p-1 !rounded-full opacity-70 group-hover:opacity-100"
                onClick={e => { e.stopPropagation(); handleDeleteThread(thread.id); }}
                aria-label="Delete chat session"
                title="Delete"
              >
                {""}
              </Button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input
            type="text"
            placeholder="New session name"
            value={newThreadName}
            onChange={e => setNewThreadName(e.target.value)}
            className="flex-1"
            aria-label="New session name"
          />
          <Button
            onClick={handleCreateThread}
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon className="w-4 h-4" />}
            aria-label="Create new chat session"
            title="Create"
          >
            {""}
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-0 px-0 min-h-screen">
        <div className="w-full max-w-3xl bg-surface rounded-2xl shadow-2xl p-6 backdrop-blur-lg min-h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`inline-flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <UserCircleIcon className={`w-8 h-8 text-muted`} />
                  <div className={`inline-block px-4 py-2 rounded-lg shadow-soft font-sans text-black bg-white ml-auto`}>
                    <b>{msg.role === "user" ? "You" : "Assistant"}:</b>
                    <div className="message-body">
                      {msg.text && <p className="message-text whitespace-pre-line">{msg.text}</p>}
                      {msg.images && msg.images.map((url: string, i: number) => (
                        <div key={i} className="image-wrap mt-2">
                          <img
                            src={`http://localhost:8000${url}`}
                            alt={`Assistant Output ${i + 1}`}
                            className="rounded-lg max-w-xs border border-primary/10 shadow"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form className="flex gap-2 items-center mt-2" onSubmit={handleSend}>
            <Input
              type="text"
              placeholder="Type your message or prompt..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!activeId || loading}
              className="flex-1 text-black"
              aria-label="Type your message or prompt"
            />
            <input
              type="file"
              accept=".csv,.pdf,.doc,.docx,.txt"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={!activeId || loading}
              className="hidden"
              aria-label="Upload file"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<PlusIcon className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={!activeId || loading}
              aria-label="Upload file"
              title="Upload file"
            >
              {""}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              rightIcon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              disabled={!activeId || loading}
              aria-label="Send message"
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default HrAssistantPage; 