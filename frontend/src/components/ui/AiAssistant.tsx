import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { api } from '../../api/axios';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  isError?: boolean;
}

export const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userQuestion = question.trim();

    // Add user message immediately
    const userMsg: ChatMessage = { role: 'user', text: userQuestion };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setIsLoading(true);

    try {
      // Build conversation history for backend
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.text,
      }));

      const response = await api.post('/ai/ask', {
        question: userQuestion,
        history,
      });

      const responseText =
        response.data?.answer ||
        response.data?.response ||
        response.data ||
        'Received an empty response.';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: typeof responseText === 'string' ? responseText : JSON.stringify(responseText),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: "Sorry, I didn't understand that. Please try rephrasing your question.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-200"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 transition-all duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6" />
              <h3 className="font-semibold text-lg">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
            {/* Welcome message */}
            <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm inline-block self-start max-w-[85%]">
              <p className="text-sm text-gray-700">Hello! How can I help you today?</p>
            </div>

            {/* Message history */}
            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <div key={i} className="bg-indigo-600 text-white rounded-lg p-3 shadow-sm inline-block self-end max-w-[85%]">
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
              ) : (
                <div
                  key={i}
                  className={`rounded-lg p-3 shadow-sm inline-block self-start max-w-[85%] ${
                    msg.isError
                      ? 'bg-red-50 text-red-700 border border-red-100'
                      : 'bg-white text-gray-700 border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
              )
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm inline-block self-start max-w-[85%] flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="bg-indigo-600 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
