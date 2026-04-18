"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Loader2, TrendingUp, MapPin, BookOpen, Globe } from "lucide-react";

interface IntelligenceData {
  source: "airtable" | "none";
  regionBreakdown: Record<string, number>;
  languageBreakdown: Record<string, number>;
  regulatoryPulse: Array<{ keyword: string; count: number; category: string }>;
  revenueProjection: {
    totalProjected: number;
    averageLead: number;
    topTier: number;
    midTier: number;
    leadCount: number;
  };
  generatedAt: string;
}

export default function IntelligencePage() {
  const [data, setData] = useState<IntelligenceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/intelligence-data");
        if (!response.ok) throw new Error("Failed to fetch intelligence data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-red-200">
        <p>Error loading intelligence data: {error}</p>
      </div>
    );
  }

  const regionData = Object.entries(data.regionBreakdown).map(([city, count]) => ({
    name: city,
    value: count,
  }));

  const languageData = Object.entries(data.languageBreakdown).map(([lang, count]) => ({
    name: lang,
    value: count,
  }));

  // Color palettes
  const regionColors = ["#84cc16", "#60a5fa", "#f97316", "#ec4899", "#8b5cf6"];
  const languageColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4"];

  // Revenue projection data
  const revenueTiers = [
    { name: "Top Tier (P30)", value: data.revenueProjection.topTier / 1000 },
    { name: "Mid Tier (P70)", value: data.revenueProjection.midTier / 1000 },
  ];

  // Regulatory categories summary
  const categoryMap: Record<string, number> = {};
  data.regulatoryPulse.forEach(({ category, count }) => {
    categoryMap[category] = (categoryMap[category] || 0) + count;
  });

  const regulatoryCategories = Object.entries(categoryMap).map(([cat, count]) => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    count,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Investor Intelligence</h1>
          <p className="text-slate-400">Real-time market opportunity analysis for Cyprus</p>
          <p className="text-xs text-slate-500 mt-2">Updated: {new Date(data.generatedAt).toLocaleString()}</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 1. Market Opportunity Map */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-5 h-5 text-lime-500" />
              <h2 className="text-xl font-semibold text-white">Market Opportunity Map</h2>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: "#cbd5e1", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#cbd5e1" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="value" fill="#84cc16" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {regionData.map((region, idx) => (
                <div key={region.name} className="bg-slate-700/30 rounded p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: regionColors[idx % regionColors.length] }} />
                    <span className="text-sm text-slate-300">{region.name}</span>
                  </div>
                  <p className="text-lg font-bold text-lime-400 mt-1">{region.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Regulatory Pulse */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Regulatory Pulse</h2>
            </div>
            <div className="space-y-3">
              {data.regulatoryPulse.slice(0, 6).map((item, idx) => (
                <div key={idx} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white capitalize">{item.keyword}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.category}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="inline-block bg-lime-500/20 text-lime-300 px-3 py-1 rounded-full text-sm font-bold">
                        {item.count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Summary */}
            <div className="mt-6 pt-4 border-t border-slate-600">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {regulatoryCategories.map((cat) => (
                  <div key={cat.category} className="bg-slate-900/50 rounded p-2">
                    <p className="text-xs text-slate-300">{cat.category}</p>
                    <p className="text-lg font-bold text-amber-400">{cat.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3. Language Dominance */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-semibold text-white">Language Dominance</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={languageColors[index % languageColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #475569",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#e2e8f0" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Language Stats */}
              <div className="space-y-3 flex flex-col justify-center">
                {languageData.map((lang, idx) => {
                  const total = languageData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = ((lang.value / total) * 100).toFixed(1);
                  return (
                    <div key={lang.name} className="bg-slate-700/30 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: languageColors[idx % languageColors.length] }}
                        />
                        <span className="text-sm font-semibold text-slate-200">{lang.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-lime-400">{lang.value}</span>
                        <span className="text-sm text-slate-400">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Revenue Projection */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">Revenue Projection</h2>
            </div>

            {/* Revenue Summary Cards */}
            <div className="space-y-3 mb-6">
              <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 rounded-lg p-4 border border-emerald-700/50">
                <p className="text-sm text-slate-300 mb-1">Total Projected Value</p>
                <p className="text-3xl font-bold text-emerald-400">
                  ${(data.revenueProjection.totalProjected / 1_000_000).toFixed(2)}M
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                  <p className="text-xs text-slate-400 mb-1">Average Lead Value</p>
                  <p className="text-xl font-bold text-lime-400">
                    ${(data.revenueProjection.averageLead / 1000).toFixed(0)}K
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                  <p className="text-xs text-slate-400 mb-1">Qualified Leads</p>
                  <p className="text-xl font-bold text-blue-400">{data.revenueProjection.leadCount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                  <p className="text-xs text-slate-400 mb-1">Top Tier (P30)</p>
                  <p className="text-lg font-bold text-amber-400">
                    ${(data.revenueProjection.topTier / 1000).toFixed(0)}K
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                  <p className="text-xs text-slate-400 mb-1">Mid Tier (P70)</p>
                  <p className="text-lg font-bold text-purple-400">
                    ${(data.revenueProjection.midTier / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Comparison Chart */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueTiers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#cbd5e1" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Bar dataKey="value" fill="#84cc16" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-slate-500 mt-4">
              *Based on {data.revenueProjection.leadCount} leads with stated budgets in Airtable
            </p>
          </div>
        </div>

        {/* Data Source Footer */}
        <div className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-slate-400">
            Data Source: Airtable ({data.revenueProjection.leadCount + Object.values(data.regionBreakdown).reduce((a, b) => Math.max(a, b), 0)} records analyzed)
          </p>
        </div>
      </div>
    </div>
  );
}
