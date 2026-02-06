import { useState, useEffect, useRef } from 'react';
import { Header } from './Header';
import { ChevronLeft, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'friend';
  timestamp: Date;
}

interface Friend {
  id: string;
  name: string;
}

interface ChatProps {
  friend: Friend;
  onBack: () => void;
  onLogout: () => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export function Chat({ friend, onBack, onLogout, messages, setMessages }: ChatProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { ripples: backRipples, flashes: backFlashes, addRipple: addBackRipple } = useRipple();
  const { ripples: sendRipples, flashes: sendFlashes, addRipple: addSendRipple } = useRipple();

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.MouseEvent) => {
    addSendRipple(e);
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageInput.trim(),
        sender: 'me',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset hours for comparison
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);
    const todayDate = new Date(today);
    todayDate.setHours(0, 0, 0, 0);
    const yesterdayDate = new Date(yesterday);
    yesterdayDate.setHours(0, 0, 0, 0);

    if (messageDate.getTime() === todayDate.getTime()) {
      return 'Today';
    } else if (messageDate.getTime() === yesterdayDate.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const shouldShowDateHeader = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp);
    const previousDate = new Date(previousMessage.timestamp);
    
    currentDate.setHours(0, 0, 0, 0);
    previousDate.setHours(0, 0, 0, 0);
    
    return currentDate.getTime() !== previousDate.getTime();
  };

  return (
    <div className="relative h-full flex flex-col bg-[#f5f1e8]">
      <Header onLogout={onLogout} />
      
      {/* Chat Header */}
      <div className="px-4 py-3 bg-white border-b-2 border-black flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            addBackRipple(e);
            onBack();
          }}
          className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
        >
          <ChevronLeft className="w-5 h-5 relative z-10" />
          <Ripple ripples={backRipples} flashes={backFlashes} />
        </motion.button>
        
        {/* Friend Avatar and Name */}
        <div className="w-10 h-10 rounded-full bg-[#6b5ce7] flex items-center justify-center text-white border-2 border-black">
          {friend.name.charAt(0)}
        </div>
        <h2>{friend.name}</h2>
      </div>

      {/* Messages Area */}
      <main className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : undefined;
          return (
            <>
              {shouldShowDateHeader(message, previousMessage) && (
                <div className="text-center text-gray-500 text-sm mb-2">
                  {formatDate(message.timestamp)}
                </div>
              )}
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === 'me'
                      ? 'bg-[#6b5ce7] text-white border-2 border-black'
                      : 'bg-white border-2 border-black'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Message Input */}
      <div className="p-4 bg-white border-t-2 border-black">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e as any);
              }
            }}
            className="flex-1 px-4 py-2 border-2 border-black rounded-lg bg-white"
          />
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="w-12 h-12 bg-[#6b5ce7] text-white border-2 border-black rounded-lg flex items-center justify-center hover:bg-[#5a4bc6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            <Send className="w-5 h-5 relative z-10" />
            <Ripple ripples={sendRipples} flashes={sendFlashes} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}