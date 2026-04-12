'use client';

import { useEffect, useState } from 'react';
import { Package, Download, Check, Star, Users, Code } from 'lucide-react';

type App = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  rating: number;
  downloads: number;
  installed: boolean;
  features: string[];
  developer: string;
  price: 'free' | 'paid';
};

const FEATURED_APPS: App[] = [
  {
    id: 'whatsapp-sync',
    name: 'WhatsApp Sync',
    description: 'Automatically send booking confirmations and reminders via WhatsApp',
    category: 'Communication',
    icon: '💬',
    rating: 4.8,
    downloads: 12400,
    installed: false,
    features: ['Auto confirmations', 'Reminders', 'Customer support'],
    developer: 'CypAI Team',
    price: 'free',
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Send professional emails and newsletters to your customers',
    category: 'Marketing',
    icon: '📧',
    rating: 4.6,
    downloads: 8900,
    installed: false,
    features: ['Email templates', 'Campaigns', 'Analytics'],
    developer: 'CypAI Team',
    price: 'free',
  },
  {
    id: 'sms-alerts',
    name: 'SMS Alerts',
    description: 'Send SMS notifications for bookings and updates',
    category: 'Communication',
    icon: '📱',
    rating: 4.7,
    downloads: 6200,
    installed: false,
    features: ['Auto SMS', 'Reminders', 'Alerts'],
    developer: 'CypAI Team',
    price: 'free',
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets Export',
    description: 'Automatically export bookings to Google Sheets',
    category: 'Integration',
    icon: '📊',
    rating: 4.9,
    downloads: 5100,
    installed: false,
    features: ['Auto export', 'Real-time sync', 'Custom fields'],
    developer: 'CypAI Team',
    price: 'free',
  },
  {
    id: 'slack-integration',
    name: 'Slack Notifications',
    description: 'Get booking notifications in your Slack workspace',
    category: 'Notifications',
    icon: '🔔',
    rating: 4.5,
    downloads: 3800,
    installed: false,
    features: ['Notifications', 'Bookings', 'Custom alerts'],
    developer: 'CypAI Team',
    price: 'free',
  },
  {
    id: 'payment-gateway',
    name: 'Payment Gateway',
    description: 'Accept payments directly for bookings and services',
    category: 'Payment',
    icon: '💳',
    rating: 4.7,
    downloads: 4200,
    installed: false,
    features: ['Card payments', 'Invoices', 'Refunds'],
    developer: 'CypAI Team',
    price: 'paid',
  },
];

const CATEGORIES = ['All', 'Communication', 'Marketing', 'Integration', 'Notifications', 'Payment', 'Tools'];

export default function AppMarketplace({ businessId }: { businessId: string }) {
  const [apps, setApps] = useState<App[]>(FEATURED_APPS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [installedApps, setInstalledApps] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetchInstalledApps();
  }, [businessId]);

  async function fetchInstalledApps() {
    try {
      const res = await fetch(`/api/apps?businessId=${businessId}`);
      if (res.ok) {
        const { apps: installed } = await res.json();
        setInstalledApps(new Set(installed.map((a: { app_id: string }) => a.app_id)));
      }
    } catch (err) {
      console.error('Error fetching installed apps:', err);
    }
  }

  const handleInstallApp = async (app: App) => {
    setLoading(true);
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, appId: app.id }),
      });
      if (res.ok) {
        setInstalledApps((prev) => new Set([...prev, app.id]));
      }
    } catch (err) {
      console.error('Error installing app:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUninstallApp = async (appId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId }),
      });
      if (res.ok) {
        setInstalledApps((prev) => {
          const updated = new Set(prev);
          updated.delete(appId);
          return updated;
        });
      }
    } catch (err) {
      console.error('Error uninstalling app:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = apps.filter((app) => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 px-4">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <Package className="h-8 w-8" />
          App Marketplace
        </h1>
        <p className="text-slate-600">Extend your AI assistant with powerful integrations and tools</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="text-sm font-semibold text-blue-900">Total Apps</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{apps.length}</div>
        </div>
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <div className="text-sm font-semibold text-green-900">Installed</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{installedApps.size}</div>
        </div>
        <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
          <div className="text-sm font-semibold text-purple-900">Free Apps</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{apps.filter((a) => a.price === 'free').length}</div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition"
          >
            {/* Icon and Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{app.icon}</div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                app.price === 'free'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {app.price === 'free' ? 'Free' : 'Paid'}
              </span>
            </div>

            {/* Title and Description */}
            <h3 className="text-lg font-bold text-slate-900 mb-1">{app.name}</h3>
            <p className="text-xs text-slate-600 mb-3">{app.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{app.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{(app.downloads / 1000).toFixed(1)}K downloads</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Key Features:</p>
              <div className="flex flex-wrap gap-1">
                {app.features.map((feature) => (
                  <span key={feature} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Developer */}
            <p className="text-xs text-slate-500 mb-4">Built by {app.developer}</p>

            {/* Install Button */}
            <button
              onClick={() =>
                installedApps.has(app.id)
                  ? handleUninstallApp(app.id)
                  : handleInstallApp(app)
              }
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition ${
                installedApps.has(app.id)
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {installedApps.has(app.id) ? (
                <span className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  Installed
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Install
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">No apps found</h3>
          <p className="text-slate-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}
