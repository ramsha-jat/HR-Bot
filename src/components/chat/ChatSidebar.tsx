import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaComments } from 'react-icons/fa';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatSidebarProps {
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

const ChatSidebar = ({ currentSessionId, onSessionSelect, onNewChat }: ChatSidebarProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Get all sessions from localStorage that have messages
        const storedSessions = Object.keys(localStorage)
          .filter(key => key.startsWith('chat_session_'))
          .map(key => {
            try {
              const sessionData = JSON.parse(localStorage.getItem(key) || '{}');
              // Only include sessions that have messages
              if (sessionData.messages && sessionData.messages.length > 0) {
                return {
                  id: key.replace('chat_session_', ''),
                  title: sessionData.title || sessionData.messages[0]?.content?.slice(0, 30) + '...',
                  lastMessage: sessionData.lastMessage || sessionData.messages[sessionData.messages.length - 1]?.content?.slice(0, 30) + '...',
                  timestamp: sessionData.timestamp || new Date().toISOString()
                };
              }
              return null;
            } catch (error) {
              console.error('Error parsing session data:', error);
              return null;
            }
          })
          .filter((session): session is ChatSession => session !== null)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setSessions(storedSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [currentSessionId]); // Refresh when current session changes

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        // Remove from localStorage
        localStorage.removeItem(`chat_session_${sessionId}`);
        // Update state
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        // If the deleted session was the current one, create a new chat
        if (sessionId === currentSessionId) {
          onNewChat();
        }
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="m-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <FaPlus /> New Chat
      </button>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading chats...</div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No chat history</div>
        ) : (
          <div className="space-y-1 p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group ${
                  session.id === currentSessionId
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FaComments className="flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-medium truncate">{session.title}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {session.lastMessage}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar; 