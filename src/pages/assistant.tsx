// src/pages/assistant.tsx
import AiAssistant from "@/components/chat/AiAssistant";

export default function AssistantPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-4xl bg-white/80 rounded-2xl shadow-2xl p-6 backdrop-blur-lg">
        <AiAssistant />
      </div>
    </div>
  );
}
