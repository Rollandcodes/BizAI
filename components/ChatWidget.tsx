'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Analytics } from '@/lib/analytics';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatWidgetProps {
  businessId: string;
  businessName: string;
  primaryColor: string;
  welcomeMessage: string;
  whatsappUrl?: string;
  businessType?: string;
  embedded?: boolean;
}

function ChatWidget({
  businessId,
  businessName,
  primaryColor,
  welcomeMessage,
  whatsappUrl,
  businessType = 'default',
  embedded = false,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: welcomeMessage,
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [degradedMode, setDegradedMode] = useState(false);
  const [leadCapturedToast, setLeadCapturedToast] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrLinkCopied, setQrLinkCopied] = useState(false);
  const [sessionId] = useState<string>(() => crypto.randomUUID());
  const [feedbackState, setFeedbackState] = useState<'idle' | 'prompt' | 'done'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (embedded) {
      Analytics.chatOpened(businessType);
      setIsOpen(true);
    }
  }, [businessType, embedded]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let startY = 0;
    const panel = chatRef.current;

    if (!panel || !isMobile || embedded) {
      return;
    }

    const onTouchStart = (event: TouchEvent) => {
      startY = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const endY = event.changedTouches[0]?.clientY ?? 0;
      if (endY - startY > 100) {
        setIsOpen(false);
      }
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchend', onTouchEnd);
    };
  }, [isMobile, embedded]);

  // Inactivity timer: show feedback poll after 5 min of no messages
  useEffect(() => {
    if (feedbackState !== 'idle') return;
    if (messages.length <= 1) return; // no real conversation yet
    if (isLoading) return;
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => setFeedbackState('prompt'), 5 * 60 * 1000);
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [messages, isLoading, feedbackState]);

  async function submitFeedback(rating: number) {
    setFeedbackState('done');
    try {
      await fetch('/api/chat/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, sessionId, rating }),
      });
    } catch {
      // silently ignore — UI already shows thank-you
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // If the feedback prompt was visible, user chose to keep chatting — reset it
    if (feedbackState === 'prompt') setFeedbackState('idle');

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    const conversationHistory = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          sessionId,
          message: inputValue,
          conversationHistory,
          messages: [...conversationHistory, { role: 'user', content: inputValue }],
          businessType,
        }),
      });

      const data = await response.json() as {
        message?: string;
        reply?: string;
        response?: string;
        leadCaptured?: boolean;
        degraded?: boolean;
      };

      const assistantText = data.message ?? data.reply ?? data.response ?? 'Sorry, something went wrong.';
      setDegradedMode(Boolean(data.degraded));
      if (data.leadCaptured || assistantText.includes('[LEAD_CAPTURED]')) {
        Analytics.leadCaptured(businessType);
        setLeadCapturedToast(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: assistantText,
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setDegradedMode(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I could not connect. Please try again.',
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!leadCapturedToast) return;
    const timer = setTimeout(() => setLeadCapturedToast(false), 3500);
    return () => clearTimeout(timer);
  }, [leadCapturedToast]);

  useEffect(() => {
    if (!showQrModal) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowQrModal(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showQrModal]);

  useEffect(() => {
    if (!qrLinkCopied) return;
    const timer = setTimeout(() => setQrLinkCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [qrLinkCopied]);

  const hasWhatsApp = Boolean(whatsappUrl);
  const qrImageSrc = whatsappUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(whatsappUrl)}`
    : '';

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={chatRef}
          className={
            embedded
              ? 'flex h-full w-full flex-col overflow-hidden bg-white'
              : isMobile
                ? 'fixed inset-0 z-50 flex h-[100vh] w-[100vw] flex-col bg-white'
                : 'fixed bottom-4 right-4 z-50 flex w-96 max-h-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl'
          }
          style={{ '--bizai-color': primaryColor } as React.CSSProperties}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--bizai-color)]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
              <span className="font-semibold text-white text-sm">{businessName}</span>
            </div>
            <div className="flex items-center gap-2">
              {embedded && isMobile && hasWhatsApp && (
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="rounded-md bg-white/15 px-2 py-1 text-xs font-semibold text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  aria-label="Show WhatsApp QR"
                >
                  QR
                </button>
              )}
              <button
                onClick={() => {
                  if (embedded && typeof window !== 'undefined') {
                    window.parent.postMessage('cypai:close', '*');
                  }
                  setIsOpen(false);
                }}
                className="rounded-md text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                aria-label="Close chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {degradedMode ? (
            <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700" data-testid="chat-degraded-badge">
              Fallback mode active: AI provider issue detected.
            </div>
          ) : null}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 bg-white p-4">
            {leadCapturedToast ? (
              <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700" role="status" aria-live="polite">
                Lead captured successfully. We will follow up shortly.
              </div>
            ) : null}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={
                    message.sender === 'user'
                      ? 'max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed bg-[var(--bizai-color)] text-white'
                      : 'max-w-[75%] rounded-2xl bg-gray-100 px-3 py-2 text-sm leading-relaxed text-gray-900'
                  }
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Feedback poll */}
            {feedbackState === 'prompt' && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-gray-100 px-3 py-2 text-sm leading-relaxed text-gray-900">
                    Before you go — how was your experience today? Your feedback helps us improve! 😊
                  </div>
                </div>
                <div className="flex justify-start gap-1 ml-1">
                  {(['😡', '😕', '😐', '😊', '😍'] as const).map((emoji, idx) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => void submitFeedback(idx + 1)}
                      className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xl transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bizai-color)] active:scale-95"
                      title={`Rate ${idx + 1} out of 5`}
                      aria-label={`Rate ${idx + 1} out of 5`}
                    >
                      <span>{emoji}</span>
                      <span className="text-[10px] font-medium text-gray-400">{idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thank-you after rating */}
            {feedbackState === 'done' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-gray-100 px-3 py-2 text-sm leading-relaxed text-gray-900">
                    Thank you! ⭐ We appreciate your feedback.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl bg-gray-100 px-3 py-2 text-sm leading-relaxed text-gray-900">
                    Feel free to contact us anytime.
                  </div>
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-200 bg-white p-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--bizai-color)]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bizai-color)] text-white transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bizai-color)] focus-visible:ring-offset-2 disabled:opacity-40"
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5.25L12 18.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.75 12L12 5.25L5.25 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!embedded && (
        <button
          onClick={() => {
            setIsOpen((prev) => {
              const next = !prev;
              if (next) {
                Analytics.chatOpened(businessType);
              }
              return next;
            });
          }}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bizai-color)] shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bizai-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 active:scale-95"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      )}

      {embedded && showQrModal && hasWhatsApp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-950 p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100">Scan WhatsApp QR</h3>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="rounded-md px-2 py-1 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
            <div className="rounded-xl bg-white p-3">
              <img src={qrImageSrc} alt="WhatsApp QR code" className="mx-auto h-[250px] w-[250px]" />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-500"
              >
                Open WhatsApp
              </a>
              <button
                type="button"
                onClick={() => {
                  if (!whatsappUrl) return;
                  void navigator.clipboard.writeText(whatsappUrl);
                  setQrLinkCopied(true);
                }}
                className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold text-zinc-100 hover:bg-zinc-800"
              >
                {qrLinkCopied ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ChatWidget, (prev, next) =>
  prev.businessId === next.businessId &&
  prev.businessName === next.businessName &&
  prev.primaryColor === next.primaryColor &&
  prev.welcomeMessage === next.welcomeMessage &&
  prev.whatsappUrl === next.whatsappUrl &&
  prev.embedded === next.embedded
);

