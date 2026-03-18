"use client";

import Link from "next/link";
import { 
  MessageCircle, 
  Users, 
  Calendar,
  BarChart3,
  Smartphone,
  Brain,
  Send,
  QrCode,
} from "lucide-react";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && (
        <div className="mt-6">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#e8a020] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d09010]"
            >
              {actionLabel}
            </Link>
          ) : onAction ? (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#e8a020] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d09010]"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

/**
 * Pre-configured empty states for common dashboard pages
 */

export function ConversationsEmpty() {
  return (
    <EmptyState
      icon={MessageCircle}
      title="No conversations yet"
      description="When customers start chatting with your AI, their conversations will appear here. Share your chat link to start getting inquiries."
      actionLabel="Go to Settings"
      actionHref="/dashboard/settings"
    />
  );
}

export function LeadsEmpty() {
  return (
    <EmptyState
      icon={Users}
      title="No leads captured"
      description="Leads will appear here when customers provide their contact information. Make sure your AI is configured to ask for leads in conversations."
      actionLabel="Configure AI Training"
      actionHref="/dashboard/training"
    />
  );
}

export function BookingsEmpty() {
  return (
    <EmptyState
      icon={Calendar}
      title="No bookings yet"
      description="When customers book appointments through your AI, their bookings will appear here. Make sure to configure your business hours in Settings."
      actionLabel="Configure Business Hours"
      actionHref="/dashboard/settings"
    />
  );
}

export function AnalyticsEmpty() {
  return (
    <EmptyState
      icon={BarChart3}
      title="No data available"
      description="Analytics will become available as customers interact with your AI. Check back later to see insights about your conversations and leads."
    />
  );
}

export function WhatsAppEmpty() {
  return (
    <EmptyState
      icon={Smartphone}
      title="WhatsApp not connected"
      description="Connect your WhatsApp Business account to receive messages directly in WhatsApp. Your AI will automatically respond to inquiries 24/7."
      actionLabel="Connect WhatsApp"
      actionHref="/dashboard/settings"
    />
  );
}

export function TrainingEmpty() {
  return (
    <EmptyState
      icon={Brain}
      title="Customize your AI"
      description="Train your AI assistant to better understand your business, services, and how to respond to customers."
      actionLabel="Start Training"
      actionHref="/dashboard/training"
    />
  );
}

export function FollowUpsEmpty() {
  return (
    <EmptyState
      icon={Send}
      title="No follow-ups scheduled"
      description="Follow-ups help you reconnect with potential customers who haven't booked yet. This feature is available on Pro and Business plans."
      actionLabel="Upgrade Plan"
      actionHref="/dashboard/settings"
    />
  );
}

export function QREmpty() {
  return (
    <EmptyState
      icon={QrCode}
      title="Generate your QR codes"
      description="Create QR codes for your business to let customers easily start conversations with your AI assistant."
      actionLabel="Generate QR Codes"
      actionHref="/dashboard/qr"
    />
  );
}

export default EmptyState;
