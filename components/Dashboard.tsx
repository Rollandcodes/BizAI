'use client';

import { useEffect, useState } from 'react';
import ChatWidget from './ChatWidget';

interface BusinessSettings {
  name: string;
  niche: string;
  description: string;
  location: string;
}

export default function Dashboard() {
  const [business, setBusiness] = useState<BusinessSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<BusinessSettings>({
    name: '',
    niche: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    // TODO: Fetch business settings from API
    fetchBusinessSettings();
  }, []);

  const fetchBusinessSettings = async () => {
    try {
      const response = await fetch('/api/business');
      const data = await response.json();
      setBusiness(data.data);
      setFormData(data.data);
    } catch (error) {
      console.error('Error fetching business settings:', error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setBusiness(data.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">BizAI Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your AI customer service assistant</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Business Settings</h2>

            {isEditing ? (
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label htmlFor="db-name" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    id="db-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="db-niche" className="block text-sm font-medium text-gray-700">
                    Niche
                  </label>
                  <input
                    id="db-niche"
                    type="text"
                    value={formData.niche}
                    onChange={(e) =>
                      setFormData({ ...formData, niche: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="db-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="db-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {business ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Business Name</p>
                      <p className="text-lg font-semibold">{business.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Niche</p>
                      <p className="text-lg font-semibold">{business.niche}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-sm">{business.description}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">No business settings configured yet</p>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                >
                  Edit Settings
                </button>
              </div>
            )}
          </div>

          {/* Chat Widget */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Chat Preview</h2>
            <div className="h-96">
              <ChatWidget
                businessId="preview"
                businessName="Your Business"
                primaryColor="#4F46E5"
                welcomeMessage="Hi! How can I help you today?"
              />
            </div>
          </div>
        </div>

        {/* Widget Embed Code */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Embed Chat Widget</h2>
          <p className="text-gray-600 mb-4">
            Add this code to your website to embed the chat widget:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            {`<script src="https://bizai.example.com/widget.js"></script>
<script>
  BizAI.init({
    businessId: "your-business-id",
    position: "bottom-right"
  });
</script>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
