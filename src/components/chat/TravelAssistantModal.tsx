import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  Compass, 
  Navigation, 
  Radio, 
  AlertOctagon, 
  ShieldCheck, 
  Train, 
  Accessibility, 
  HelpCircle,
  RotateCcw,
  User,
  ArrowRight,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { 
  processAssistantQuery, 
  ActionChip, 
  AssistantResponse 
} from '../../utils/chatbotEngine';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  actionChips?: ActionChip[];
  isOutOfScope?: boolean;
  source?: 'gemini' | 'knowledge_base';
}

interface TravelAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMap: () => void;
  onOpenScanner: () => void;
  onOpenSOS: () => void;
  onOpenTrust: () => void;
  onOpenTransit: () => void;
  onOpenAccessibility: () => void;
  onOpenProfile: () => void;
  onOpenGuides: () => void;
  onOpenAIPlanner: () => void;
}

export const TravelAssistantModal: React.FC<TravelAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenMap,
  onOpenScanner,
  onOpenSOS,
  onOpenTrust,
  onOpenTransit,
  onOpenAccessibility,
  onOpenProfile,
  onOpenGuides,
  onOpenAIPlanner,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Namaste! 🙏 I am **Sahayak AI**, your encyclopedic Travel & Location Intelligence Guide.\n\nI am trained to provide detailed information about **ANY location's information** and **ANY things related to a particular place**:\n- 🏛️ **Monuments & Heritage**: History, architecture, opening hours, ticket rates (ASI) & closing days\n- 🚆 **How to Reach & Transit**: Express trains (Vande Bharat), flights, metro token fares & auto meter rates\n- 🍛 **Authentic Food**: Must-try regional delicacies, famous sweet shops & safe FSSAI food hygiene practices\n- 🛍️ **Bazaars & GI Crafts**: GI-tagged handlooms, silk, handicrafts & fair bargaining advice\n- 🛕 **Etiquette & Dress Codes**: Temple/mosque/gurdwara protocols, shoe deposit & photography rules\n- 🧭 **App Features**: Live GPS Turn-by-Turn Navigation, Surrounding Radar Scanner, Fair-Price Calculator & Emergency SOS 112\n\nAsk me about any city, monument, beach, hill station, or app tool!`,
      time: 'Just now',
      actionChips: [
        { label: '📍 Tell me about Hampi ruins', action: 'open_map' },
        { label: '🕌 Taj Mahal Friday rules & tickets', action: 'open_map' },
        { label: '🧭 How do I use Live Navigation?', action: 'open_map' },
        { label: '📡 How does the Radar Scanner work?', action: 'open_scanner' }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response: AssistantResponse = await processAssistantQuery(query);
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        actionChips: response.actionChips,
        isOutOfScope: response.isOutOfScope,
        source: response.source
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: 'Namaste! An unexpected error occurred. Please try again.',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionChipClick = (action: ActionChip['action']) => {
    switch (action) {
      case 'open_map':
        onOpenMap();
        onClose();
        break;
      case 'open_scanner':
        onOpenScanner();
        onClose();
        break;
      case 'open_sos':
        onOpenSOS();
        onClose();
        break;
      case 'open_trust':
        onOpenTrust();
        onClose();
        break;
      case 'open_transit':
        onOpenTransit();
        onClose();
        break;
      case 'open_accessibility':
        onOpenAccessibility();
        onClose();
        break;
      case 'open_profile':
        onOpenProfile();
        onClose();
        break;
      case 'open_guides':
        onOpenGuides();
        onClose();
        break;
      case 'open_ai_planner':
        onOpenAIPlanner();
        onClose();
        break;
    }
  };

  // Render markdown-like text
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Header 3
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-serif-display font-bold text-sm text-[#191715] mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Header 4
      if (line.startsWith('#### ')) {
        return (
          <h5 key={idx} className="font-bold text-xs text-[#C84B31] mt-2 mb-0.5 uppercase tracking-wide">
            {line.replace('#### ', '')}
          </h5>
        );
      }
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('• ')) {
        const content = line.replace(/^[-•]\s*/, '');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-[#443E38] my-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="text-xs text-[#443E38] my-0.5 pl-1">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
          </div>
        );
      }
      // Empty line
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      // Normal paragraph
      return (
        <p key={idx} className="text-xs text-[#443E38] leading-relaxed my-0.5">
          <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
        </p>
      );
    });
  };

  // Format bold and italic inline
  const formatInlineMarkdown = (str: string): string => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#191715]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  };

  const samplePrompts = [
    'Tell me about Indore famous places & food (Rajwada, Sarafa & 56 Dukan)',
    'Tell me about Hampi ruins and stone chariot',
    'What are the best things to do in Udaipur?',
    'How do I reach Leh Ladakh and acclimatize?',
    'What is the fair auto meter rate in Delhi?',
    'How do I use live turn-by-turn navigation on map?',
    'Tell me about Varanasi Ganga Aarti and ghats'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="travel-assistant-modal"
        className="bg-[#F7F5F0] rounded-3xl w-full max-w-xl h-[88vh] max-h-[740px] overflow-hidden flex flex-col shadow-2xl border border-[#E5E0D8] relative"
      >
        
        {/* TOP HEADER */}
        <div className="p-3.5 sm:px-5 bg-white border-b border-[#E5E0D8] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C84B31] text-white flex items-center justify-center shadow-md shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif-display font-bold text-sm sm:text-base text-[#191715]">
                  Sahayak AI Assistant
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#66605B] font-medium">
                Trained on All Locations, Places & App Features
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'assistant',
                    text: `Namaste! Chat reset. Ask me about ANY location, city, monument, or how to use the app!`,
                    time: 'Just now'
                  }
                ]);
              }}
              className="p-2 rounded-xl text-[#736A62] hover:bg-[#FAF8F5] hover:text-[#191715] transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-assistant-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-[#736A62] hover:bg-[#FAF8F5] hover:text-[#191715] transition-colors"
              title="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DOMAIN BOUNDARY BANNER */}
        <div className="bg-[#FAF5F0] border-b border-[#F2DFD7] px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[#C84B31] font-bold">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Scope: Any location on earth, places, culture & app tools</span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#F2DFD7] uppercase tracking-wider font-extrabold text-[#C84B31]">
            Active
          </span>
        </div>

        {/* CHAT MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[92%] sm:max-w-[88%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                  isUser 
                    ? 'bg-[#191715] text-white' 
                    : 'bg-[#C84B31] text-white'
                }`}>
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div className={`p-3.5 rounded-2xl shadow-xs border text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-[#191715] text-white border-[#191715] rounded-tr-none' 
                      : msg.isOutOfScope
                      ? 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A] rounded-tl-none'
                      : 'bg-white text-[#191715] border-[#E5E0D8] rounded-tl-none'
                  }`}>
                    {isUser ? msg.text : renderFormattedText(msg.text)}
                    
                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-black/5">
                      {msg.source && (
                        <span className="text-[9px] font-semibold text-[#8C827A] flex items-center gap-1">
                          {msg.source === 'gemini' ? (
                            <>
                              <Sparkles className="w-2.5 h-2.5 text-[#C84B31]" />
                              <span>Gemini 2.5 Flash</span>
                            </>
                          ) : (
                            <>
                              <Compass className="w-2.5 h-2.5 text-[#C84B31]" />
                              <span>Sahayak Knowledge Engine</span>
                            </>
                          )}
                        </span>
                      )}
                      <div className={`text-[9px] font-semibold ml-auto ${
                        isUser ? 'text-white/60' : 'text-[#8C827A]'
                      }`}>
                        {msg.time}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Chips */}
                  {msg.actionChips && msg.actionChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actionChips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionChipClick(chip.action)}
                          className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF5F0] border border-[#E5E0D8] hover:border-[#C84B31] text-[#C84B31] font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>{chip.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#736A62] bg-white p-2 px-3 rounded-2xl border border-[#E5E0D8] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium text-[#736A62] ml-1">Analyzing destination intelligence...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK PROMPT SUGGESTION CHIPS */}
        <div className="px-3.5 py-2 bg-white/70 border-t border-[#E5E0D8] overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF5F0] border border-[#E5E0D8] text-[11px] font-semibold text-[#5A524C] hover:text-[#C84B31] transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM INPUT BAR */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E5E0D8]">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              id="assistant-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ANY city, monument, food, transit, or app feature..."
              className="flex-1 bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl px-3.5 py-2.5 text-xs text-[#191715] placeholder:text-[#8C827A] focus:outline-none focus:ring-1 focus:ring-[#C84B31] font-medium"
            />
            <button
              id="send-assistant-chat-btn"
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 sm:px-4 rounded-2xl bg-[#C84B31] hover:bg-[#B33E26] disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
