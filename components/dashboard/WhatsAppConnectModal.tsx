"use client";

import { useState } from "react";
import { X, Phone, ExternalLink, HelpCircle, Loader2 } from "lucide-react";

interface WhatsAppConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (phoneNumber: string) => Promise<void>;
  currentNumber?: string;
}

export default function WhatsAppConnectModal({
  isOpen,
  onClose,
  onConnect,
  currentNumber
}: WhatsAppConnectModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(currentNumber || "");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async () => {
    // Validate phone number
    const cleaned = phoneNumber.replace(/[^\d+]/g, "");
    if (cleaned.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      await onConnect(phoneNumber);
      onClose();
    } catch (err) {
      setError("Failed to connect. Please try again or contact support.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Connect WhatsApp
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-500">
            Enter your WhatsApp Business phone number to start receiving messages from customers.
          </p>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError(null);
                }}
                placeholder="+90 532 123 4567"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Use international format (e.g., +90 for Turkey)
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {/* Help link */}
          <div className="rounded-xl bg-slate-50 p-4">
            <a
              href="https://faq.whatsapp.com/591012899409066"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <HelpCircle className="h-4 w-4" />
              Need help setting up WhatsApp Business?
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={connecting || !phoneNumber}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#20bd5a] disabled:opacity-50"
          >
            {connecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
