"use client";

import { useState } from "react";
import { MessageCircle, Database, Zap, Globe, Copy, Check } from "lucide-react";

export default function NeuralConnectPage() {
  const [copied, setCopied] = useState(false);
  const [languages, setLanguages] = useState({
    TR: true,
    EN: true,
    RU: false,
    AR: false,
    EL: true,
  });

  const toggleLanguage = (lang: "TR" | "EN" | "RU" | "AR" | "EL") => {
    setLanguages((prev) => ({ ...prev, [lang]: !prev[lang] }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("https://cypai.app/api/whatsapp-webhook");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langOptions = [
    { code: "TR", label: "Turkish (Türkçe)" },
    { code: "EN", label: "English" },
    { code: "RU", label: "Russian (Русский)" },
    { code: "AR", label: "Arabic (العربية)" },
    { code: "EL", label: "Greek (Ελληνικά)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Neural Connect</h1>
          <p className="text-slate-400">Manage integrations, AI training, and language capabilities</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 1. WhatsApp Integration */}
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur overflow-hidden group hover:border-slate-600 transition-colors">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-green-500 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500/15 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">WhatsApp Integration</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400 font-semibold">CONNECTED</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-6 mb-6 flex items-center justify-center">
                <div className="border-4 border-slate-700 rounded-lg p-8 bg-white">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded flex items-center justify-center">
                    <MessageCircle className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-slate-300">Webhook URL:</p>
                <div className="flex items-center gap-2 bg-slate-700/30 rounded-lg p-3 group/copy">
                  <code className="text-xs text-green-400 font-mono flex-1 truncate">
                    https://cypai.app/api/whatsapp-webhook
                  </code>
                  <button
                    type="button"
                    aria-label="Copy webhook URL"
                    onClick={copyToClipboard}
                    className="p-2 rounded hover:bg-slate-600 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <button className="w-full mt-6 bg-green-500/20 text-green-400 rounded-lg py-2 font-semibold text-sm hover:bg-green-500/30 transition-colors">
                View Conversation Logs
              </button>
            </div>
          </div>

          {/* 2. Airtable Sync */}
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur overflow-hidden group hover:border-slate-600 transition-colors">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-blue-500 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-500/15 rounded-lg">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Airtable Sync</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs text-blue-400 font-semibold">SYNCED</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2">Last Sync</p>
                  <p className="text-lg font-semibold text-white">2 minutes ago</p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2">Records Synced</p>
                  <p className="text-lg font-semibold text-white">1,247 leads</p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2">Sync Frequency</p>
                  <p className="text-lg font-semibold text-white">Every 5 minutes</p>
                </div>
              </div>

              <button className="w-full mt-6 bg-blue-500/20 text-blue-400 rounded-lg py-2 font-semibold text-sm hover:bg-blue-500/30 transition-colors">
                Sync Now
              </button>
            </div>
          </div>

          {/* 3. Law Database */}
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur overflow-hidden group hover:border-slate-600 transition-colors">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-purple-500 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-500/15 rounded-lg">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">2026 Law Database</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className="text-xs text-purple-400 font-semibold">TRAINING ACTIVE</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2">TRNC Property Laws</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-white">2026 Edition</p>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Verified</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2">Residency Regulations</p>
                  <p className="text-lg font-semibold text-white">Regulation 6.2</p>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 mb-2">Training Progress</p>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full w-[78%]" />
                  </div>
                  <p className="text-sm text-purple-300 mt-2 font-semibold">78% complete</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Multilingual Brain */}
          <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-8 backdrop-blur overflow-hidden group hover:border-slate-600 transition-colors">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-orange-500 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500/15 rounded-lg">
                  <Globe className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Multilingual Brain</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {Object.values(languages).filter(Boolean).length} / 5 active
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {langOptions.map(({ code, label }) => (
                  <div
                    key={code}
                    className="flex items-center justify-between bg-slate-900/50 rounded-lg p-4 hover:bg-slate-900/70 transition-colors"
                  >
                    <label className="text-sm font-medium text-white cursor-pointer flex-1">
                      {label}
                    </label>
                    <button
                      onClick={() => toggleLanguage(code as "TR" | "EN" | "RU" | "AR" | "EL")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        languages[code as "TR" | "EN" | "RU" | "AR" | "EL"]
                          ? "bg-orange-500/40"
                          : "bg-slate-700/40"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          languages[code as "TR" | "EN" | "RU" | "AR" | "EL"]
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-orange-500/20 text-orange-400 rounded-lg py-2 font-semibold text-sm hover:bg-orange-500/30 transition-colors">
                Train New Language
              </button>
            </div>
          </div>
        </div>

        {/* Connection Status Footer */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase mb-2">System Status</p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-semibold text-green-400">Optimal</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase mb-2">Latency</p>
              <p className="text-sm font-semibold text-white">45ms</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase mb-2">Uptime</p>
              <p className="text-sm font-semibold text-white">99.97%</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase mb-2">Last Heartbeat</p>
              <p className="text-sm font-semibold text-white">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
