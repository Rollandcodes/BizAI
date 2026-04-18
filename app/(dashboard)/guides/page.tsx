"use client";

import { useState } from "react";
import {
  BookOpen,
  Download,
  FileText,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: "residency" | "property" | "medical";
  jurisdiction: string;
  status: "verified" | "draft";
  pages: number;
  lastUpdated: string;
  icon: React.ReactNode;
  highlights: string[];
}

const guides: Guide[] = [
  {
    id: "trnc-2026",
    title: "The 2026 TRNC Residency & Property Act",
    description:
      "Complete legal framework for residency and property investment in the Turkish Republic of Northern Cyprus. Includes Fast-Track Residency programs, property acquisition rules, and tax implications.",
    category: "residency",
    jurisdiction: "TRNC",
    status: "verified",
    pages: 124,
    lastUpdated: "April 2026",
    icon: <FileText className="w-6 h-6" />,
    highlights: [
      "Regulation 6.2 - Fast-Track €300K Residency Path",
      "Property ownership requirements and restrictions",
      "Tax optimization strategies for investors",
      "Visa renewal and family sponsored pathways",
    ],
  },
  {
    id: "south-cyprus-eu",
    title: "South Cyprus EU Investment Permanent Residency Guide",
    description:
      "Master guide for EU citizen investments in the Republic of Cyprus. Covers property purchase mechanisms, investment visa pathways, and EU compliance requirements.",
    category: "property",
    jurisdiction: "Republic of Cyprus / EU",
    status: "verified",
    pages: 156,
    lastUpdated: "April 2026",
    icon: <BookOpen className="w-6 h-6" />,
    highlights: [
      "EU long-term residency (D visa) requirements",
      "Property acquisition in Limassol & Paphos zones",
      "Permanent residency pathways for EU investors",
      "Golden visa alternative structures",
    ],
  },
  {
    id: "clinical-protocol",
    title: "Clinical Protocol: International Patient Triage",
    description:
      "Specialized medical triage protocol for international fertility, cardiology, and dental patients. Includes intake procedures, screening guidelines, and post-treatment follow-up protocols.",
    category: "medical",
    jurisdiction: "TRNC & Cyprus",
    status: "verified",
    pages: 87,
    lastUpdated: "March 2026",
    icon: <CheckCircle2 className="w-6 h-6" />,
    highlights: [
      "IVF treatment protocols and patient qualification",
      "Cardiology diagnostic standards and risk assessment",
      "Dental procedure triage and quality assurance",
      "International patient data protection GDPR compliance",
    ],
  },
];

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "residency":
        return "bg-lime-500/20 text-lime-300";
      case "property":
        return "bg-blue-500/20 text-blue-300";
      case "medical":
        return "bg-purple-500/20 text-purple-300";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "verified") {
      return (
        <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
          ✓ Verified
        </div>
      );
    }
    return (
      <div className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold">
        Draft
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            Legal & Clinical Guides
          </h1>
          <p className="text-slate-400">
            Verified documentation showing that our AI is grounded in real,
            current legal and medical data
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-lime-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className={`cursor-pointer rounded-xl border backdrop-blur transition-all ${
                  selectedGuide?.id === guide.id
                    ? "bg-slate-800/50 border-lime-600/50"
                    : "bg-slate-800/30 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${getCategoryColor(guide.category)}`}
                      >
                        {guide.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">
                          {guide.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(guide.category)}`}
                          >
                            {guide.category.charAt(0).toUpperCase() +
                              guide.category.slice(1)}
                          </span>
                          {getStatusBadge(guide.status)}
                          <span className="text-xs text-slate-400">
                            {guide.jurisdiction}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{guide.pages} pages</span>
                      <span>Updated {guide.lastUpdated}</span>
                    </div>
                    <button className="flex items-center gap-1 text-lime-400 hover:text-lime-300 transition-colors">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            {selectedGuide ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur sticky top-8">
                <div
                  className={`p-4 rounded-lg mb-6 ${getCategoryColor(selectedGuide.category)}`}
                >
                  {selectedGuide.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {selectedGuide.title}
                </h3>
                <div className="mb-6">
                  {getStatusBadge(selectedGuide.status)}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase mb-1">
                      Jurisdiction
                    </p>
                    <p className="text-white font-semibold">
                      {selectedGuide.jurisdiction}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase mb-1">
                      Pages
                    </p>
                    <p className="text-white font-semibold">
                      {selectedGuide.pages}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase mb-1">
                      Last Updated
                    </p>
                    <p className="text-white font-semibold">
                      {selectedGuide.lastUpdated}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-slate-400 uppercase mb-3 font-semibold">
                    Key Sections
                  </p>
                  <div className="space-y-2">
                    {selectedGuide.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-lime-500/20 text-lime-300 rounded-lg py-3 font-semibold text-sm hover:bg-lime-500/30 transition-colors flex items-center justify-center gap-2 mb-3">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button className="w-full bg-slate-700/30 text-slate-300 rounded-lg py-3 font-semibold text-sm hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View Online
                </button>
              </div>
            ) : (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 backdrop-blur text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  Select a guide to view details and download options
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-slate-800/30 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">
            📋 Why These Guides Matter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-semibold text-lime-300 mb-2">
                Regulatory Compliance
              </p>
              <p className="text-sm text-slate-300">
                All guides are current with 2026 TRNC and EU law changes,
                ensuring every AI response is legally defensible.
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-300 mb-2">
                Investor Confidence
              </p>
              <p className="text-sm text-slate-300">
                Demonstrate to investors that your AI is trained on verified
                legal documents, not generic templates.
              </p>
            </div>
            <div>
              <p className="font-semibold text-purple-300 mb-2">
                Patient Safety
              </p>
              <p className="text-sm text-slate-300">
                Medical protocols ensure international patients receive
                compliant, ethical clinical triage and guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
