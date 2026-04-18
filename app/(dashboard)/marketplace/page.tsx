"use client";

import { useState } from "react";
import { Download, Settings, Star, Users, TrendingUp } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  specialty: string;
  icon: React.ReactNode;
  stats: { label: string; value: string }[];
  installed: boolean;
}

const agents: Agent[] = [
  {
    id: "kyrenia-closer",
    name: "The Kyrenia Closer",
    description:
      "Expert real estate agent personality trained on TRNC property laws and high-value investor psychology.",
    specialty: "Real Estate & Residency",
    icon: <TrendingUp className="w-8 h-8" />,
    stats: [
      { label: "Closure Rate", value: "73%" },
      { label: "Avg Deal Size", value: "$285K" },
      { label: "Response Time", value: "1.2m" },
    ],
    installed: false,
  },
  {
    id: "ivf-concierge",
    name: "The IVF Concierge",
    description:
      "Medical triage specialist for fertility clinics. Qualifies international patients, handles treatment protocols, and manages follow-ups.",
    specialty: "Medical Tourism & IVF",
    icon: <Users className="w-8 h-8" />,
    stats: [
      { label: "Patient Qualification", value: "89%" },
      { label: "Consultation Booked", value: "67%" },
      { label: "Languages", value: "5" },
    ],
    installed: true,
  },
  {
    id: "limassol-property",
    name: "Limassol Property Pro",
    description:
      "South Cyprus EU investment expert. Guides EU investors through Republic of Cyprus property law and residency pathways.",
    specialty: "South Cyprus & EU Law",
    icon: <Star className="w-8 h-8" />,
    stats: [
      { label: "EU Compliance", value: "100%" },
      { label: "Deal Volume", value: "156" },
      { label: "Avg Response", value: "58s" },
    ],
    installed: false,
  },
];

export default function MarketplacePage() {
  const [installedAgents, setInstalledAgents] = useState<string[]>(
    agents.filter((a) => a.installed).map((a) => a.id),
  );

  const toggleInstall = (agentId: string) => {
    setInstalledAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Agent Marketplace
          </h1>
          <p className="text-slate-400">
            Install pre-trained AI personalities to automate lead qualification
            for your specific business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Installed Agents</p>
            <p className="text-3xl font-bold text-lime-400">
              {installedAgents.length} / 3
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Combined Optimization</p>
            <p className="text-3xl font-bold text-blue-400">94%</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Active Conversations</p>
            <p className="text-3xl font-bold text-purple-400">847</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {agents.map((agent) => {
            const isInstalled = installedAgents.includes(agent.id);
            return (
              <div
                key={agent.id}
                className={`relative rounded-2xl border backdrop-blur transition-all duration-300 overflow-hidden group ${
                  isInstalled
                    ? "bg-slate-800/50 border-lime-700/50"
                    : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                }`}
              >
                {isInstalled && (
                  <div className="absolute top-4 right-4 z-20 bg-lime-500/20 text-lime-300 px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Installed
                  </div>
                )}

                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${
                    isInstalled ? "bg-lime-500" : "bg-slate-400"
                  }`}
                />

                <div className="relative z-10 p-8">
                  <div
                    className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                      isInstalled
                        ? "bg-lime-500/20 text-lime-400"
                        : "bg-slate-700/50 text-slate-200"
                    }`}
                  >
                    {agent.icon}
                  </div>

                  <h3 className="text-xl font-bold text-white mt-6 mb-2">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-slate-300 mb-4">
                    {agent.description}
                  </p>
                  <div className="inline-block bg-slate-700/30 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold mb-6">
                    {agent.specialty}
                  </div>

                  <div className="space-y-3 mb-8">
                    {agent.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3"
                      >
                        <span className="text-xs text-slate-400">
                          {stat.label}
                        </span>
                        <span className="font-bold text-white">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => toggleInstall(agent.id)}
                      className={`w-full rounded-lg py-3 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        isInstalled
                          ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                          : "bg-lime-500/20 text-lime-300 hover:bg-lime-500/30"
                      }`}
                    >
                      {isInstalled ? (
                        <>
                          <Settings className="w-4 h-4" />
                          Manage Configuration
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Install Agent
                        </>
                      )}
                    </button>

                    {isInstalled && (
                      <button className="w-full rounded-lg py-3 font-semibold text-sm bg-slate-700/30 text-slate-200 hover:bg-slate-700/50 transition-all">
                        View Performance
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">
            💡 Agent Installation Tips
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              • Each agent can be customized to match your clinic, agency, or
              business voice
            </li>
            <li>
              • Agents automatically sync with your Airtable lead database and
              conversation history
            </li>
            <li>
              • Run multiple agents simultaneously for different business lines
              (medical + real estate)
            </li>
            <li>
              • All agents comply with 2026 TRNC and EU regulatory requirements
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
