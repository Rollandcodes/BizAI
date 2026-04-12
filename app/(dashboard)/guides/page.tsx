'use client';

import { useState } from 'react';
import { ChevronDown, FileText, Video, Zap, BookOpen, HelpCircle } from 'lucide-react';

type GuideTopic = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  sections: {
    heading: string;
    content: string;
    steps?: string[];
  }[];
};

const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: 'calendar-setup',
    title: 'Getting Started with Calendar',
    description: 'Learn how to set up and manage your business calendar',
    icon: <Zap className="h-6 w-6" />,
    sections: [
      {
        heading: 'Why Calendar Management?',
        content:
          'Your calendar helps CypAI know when you are available to take bookings. This ensures customers can only book during times when you can actually serve them.',
        steps: [
          'Display real-time availability to customers',
          'Prevent double bookings',
          'Sync across multiple calendars (Google, Outlook)',
          'Set buffer times and working hours',
        ],
      },
      {
        heading: 'Step 1: Connect Your Calendar',
        content: 'First, connect your existing calendar so CypAI can read your availability.',
        steps: [
          'Go to Calendar → Connections',
          'Click "Connect Calendar" and choose your provider (Google/Outlook)',
          'Authorize CypAI to access your calendar',
          'Select which calendar to sync',
          'Enable auto-sync to keep it updated',
        ],
      },
      {
        heading: 'Step 2: Set Your Working Hours',
        content: 'Define when you are available to work and accept bookings.',
        steps: [
          'Go to Calendar → Availability',
          'Click "Add Hours" to define your schedule',
          'Select the day of the week',
          'Set start and end times (e.g., 9:00 AM - 5:00 PM)',
          'Mark as Active and save',
          'Repeat for each day you work',
        ],
      },
      {
        heading: 'Step 3: Configure Preferences',
        content: 'Fine-tune how your calendar works with CypAI.',
        steps: [
          'Go to Calendar → Preferences',
          'Enable "Auto-sync" to automatically check availability',
          'Set sync frequency (how often to check)',
          'Add buffer time before/after each booking',
          'Set how far ahead customers can book',
          'Require minimum notice (e.g., 2 hours ahead)',
        ],
      },
    ],
  },
  {
    id: 'marketplace-apps',
    title: 'Installing Apps from Marketplace',
    description: 'Discover and install powerful integrations',
    icon: <BookOpen className="h-6 w-6" />,
    sections: [
      {
        heading: 'What are Apps?',
        content:
          'Apps extend your AI assistant with new capabilities like sending WhatsApp messages, email marketing, SMS alerts, and more.',
        steps: [
          'WhatsApp Sync - Send confirmations and reminders',
          'Email Marketing - Send newsletters and updates',
          'SMS Alerts - Text notifications',
          'Google Sheets - Export bookings automatically',
          'Slack - Get notifications in your workspace',
          'Payment Gateway - Accept payments for bookings',
        ],
      },
      {
        heading: 'How to Install an App',
        content: 'Adding a new app is simple and takes just a few seconds.',
        steps: [
          'Go to Marketplace in the dashboard',
          'Browse apps by category or search',
          'Click on an app to see details, reviews, and features',
          'Click "Install" to activate it',
          'Go to Settings to configure the app',
        ],
      },
      {
        heading: 'Featured Free Apps',
        content:
          'Start with these popular free integrations to automate your customer communication.',
      },
    ],
  },
  {
    id: 'booking-flow',
    title: 'How Booking Automation Works',
    description: 'End-to-end booking flow with calendar sync',
    icon: <FileText className="h-6 w-6" />,
    sections: [
      {
        heading: 'The Complete Flow',
        content: 'Here is what happens when a customer books with you:',
        steps: [
          '1️⃣ Customer sends a message to your AI (WhatsApp, web, etc.)',
          '2️⃣ AI understands their booking intent (date, time, service)',
          '3️⃣ AI checks your connected calendar for availability',
          '4️⃣ If available, booking is confirmed and saved',
          '5️⃣ Confirmation is sent (SMS, email, WhatsApp)',
          '6️⃣ Event is created in your calendar automatically',
          '7️⃣ You receive a notification in your preferred app',
        ],
      },
      {
        heading: 'Required Setup',
        content: 'To enable end-to-end booking automation:',
        steps: [
          'Set up your calendar (Connections + Working Hours)',
          'Install WhatsApp Sync app (for confirmations)',
          'Optionally install Email, SMS, or Slack apps',
          'Test by booking something on your demo page',
        ],
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and how to fix them',
    icon: <HelpCircle className="h-6 w-6" />,
    sections: [
      {
        heading: '"Calendar not syncing"',
        content:
          'If your calendar is not updating availability, try these steps:',
        steps: [
          'Check if auto-sync is enabled in Preferences',
          'Verify your calendar is connected in Connections tab',
          'Disconnect and reconnect the calendar',
          'Check if you have permission for the calendar',
          'Try refreshing the page',
        ],
      },
      {
        heading: '"Bookings not creating calendar events"',
        content: 'Make sure your calendar is connected and syncing is enabled.',
        steps: [
          'Go to Calendar → Connections',
          'Verify the calendar shows "✓ Syncing"',
          'If not, click the status toggle to enable it',
          'Try making a new booking to test',
        ],
      },
      {
        heading: '"App not sending messages"',
        content: 'If an app like WhatsApp is not working:',
        steps: [
          'Verify the app is installed (Marketplace)',
          'Go to App Settings to configure credentials',
          'Test the connection',
          'Check if you have enough credits/balance',
          'Review app documentation for requirements',
        ],
      },
    ],
  },
];

export default function GuidePage() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>('calendar-setup');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (topicId: string, sectionIndex: number) => {
    const key = `${topicId}-${sectionIndex}`;
    const updated = new Set(expandedSections);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    setExpandedSections(updated);
  };

  const currentTopic = GUIDE_TOPICS.find((t) => t.id === expandedTopic);

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Help & Guides
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Learn how to set up your calendar, install apps, and automate your bookings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-2">
            {GUIDE_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setExpandedTopic(topic.id);
                  setExpandedSections(new Set());
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition flex items-start gap-3 ${
                  expandedTopic === topic.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                <span className="mt-1">{topic.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{topic.title}</p>
                  <p className={`text-xs ${expandedTopic === topic.id ? 'text-blue-100' : 'text-slate-600'}`}>
                    {topic.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          {currentTopic && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                  {currentTopic.icon}
                  {currentTopic.title}
                </h2>
                <p className="text-slate-600">{currentTopic.description}</p>
              </div>

              <div className="space-y-3">
                {currentTopic.sections.map((section, idx) => {
                  const isExpanded = expandedSections.has(`${currentTopic.id}-${idx}`);
                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 bg-white overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(currentTopic.id, idx)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
                      >
                        <h3 className="font-semibold text-slate-900">{section.heading}</h3>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-600 transition ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-4 border-t border-slate-200">
                          <p className="text-slate-600 mb-4">{section.content}</p>

                          {section.steps && section.steps.length > 0 && (
                            <ol className="space-y-2">
                              {section.steps.map((step, stepIdx) => (
                                <li key={stepIdx} className="flex gap-3 text-sm">
                                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs flex-shrink-0">
                                    {stepIdx + 1}
                                  </span>
                                  <span className="text-slate-700 pt-0.5">{step}</span>
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Quick Tips
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">💡</span>
            <span className="text-slate-700 text-sm">
              <strong>Test your setup:</strong> Visit your demo chat to try a booking with your calendar connected
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">💡</span>
            <span className="text-slate-700 text-sm">
              <strong>Enable auto-sync:</strong> Keep auto-sync on so availability updates in real-time
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">💡</span>
            <span className="text-slate-700 text-sm">
              <strong>Set buffer times:</strong> Add minutes before/after bookings for travel or prep
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">💡</span>
            <span className="text-slate-700 text-sm">
              <strong>Install WhatsApp Sync:</strong> Send booking confirmations directly to customer phones
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
