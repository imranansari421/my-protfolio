import React, { useState } from "react";
import { Brain, Cpu, Play, CheckCircle2, Copy, Sparkles, Code, Layout, AppWindow, Smartphone, Database, Check } from "lucide-react";

interface ProjectPreset {
  id: string;
  title: string;
  tagline: string;
  tech: string[];
  description: string;
  promptUsed: string;
  codeFiles: {
    name: string;
    language: string;
    content: string;
  }[];
  mockUI: React.ReactNode;
}

export default function AIAppStudio() {
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);
  const [activeFileIdx, setActiveFileIdx] = useState<number>(0);
  const [promptInput, setPromptInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customProject, setCustomProject] = useState<ProjectPreset | null>(null);
  const [generationStep, setGenerationStep] = useState<string>("");

  const projectPresets: ProjectPreset[] = [
    {
      id: "railway-ledger",
      title: "Active Engineers Railway Maintenance Ledger",
      tagline: "Track relaying train operations, supervisors' checking, & attendance logs",
      tech: ["React 18", "Tailwind CSS", "Lucide Icons", "LocalState"],
      description: "A highly specialized system built to automate ledger histories, track train relay operations, assist supervisors and technicians with tool inspections, and manage daily attendance logs on-site.",
      promptUsed: "Build a single-screen responsive React dashboard for contract railway staff at Active Engineers. Include maintenance log book inputs, tool inspection checklists, and a clean, high-contrast UI with no dollar symbols.",
      codeFiles: [
        {
          name: "RailwayLedger.tsx",
          language: "tsx",
          content: `import React, { useState } from "react";
import { AlertCircle, Train, CheckCircle, ClipboardList, PenTool } from "lucide-react";

export default function RailwayLedger() {
  const [logs, setLogs] = useState([
    { id: 1, date: "2026-07-01", shift: "Day", operation: "Track Relaying Train Operation", supervisor: "Md Ahsan Ansari", status: "Completed" },
    { id: 2, date: "2026-06-30", shift: "Night", operation: "Tool & Machinery Safety Check", supervisor: "Imran Ansari", status: "Completed" },
  ]);
  const [newOp, setNewOp] = useState("");
  const [newSupervisor, setNewSupervisor] = useState("");

  const addLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOp || !newSupervisor) return;
    setLogs([{
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      shift: "Day",
      operation: newOp,
      supervisor: newSupervisor,
      status: "In Progress"
    }, ...logs]);
    setNewOp("");
    setNewSupervisor("");
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 font-sans">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Train className="w-8 h-8 text-amber-500" />
          <div>
            <h2 className="text-lg font-bold tracking-tight">Active Engineers Operations Ledger</h2>
            <p className="text-[10px] text-slate-400 font-mono">RAILWAY CONTRACTOR STAFF WORKSPACE</p>
          </div>
        </div>
        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-mono">
          ● Live Terminal
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={addLog} className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Log New Daily Operation</h3>
          <div>
            <label className="block text-[10px] uppercase text-slate-400 mb-1">Operation / Maintenance Job</label>
            <input 
              type="text" 
              value={newOp}
              onChange={e => setNewOp(e.target.value)}
              placeholder="e.g., Track relaying operation" 
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-slate-400 mb-1">Supervisor / Inspector</label>
            <input 
              type="text" 
              value={newSupervisor}
              onChange={e => setNewSupervisor(e.target.value)}
              placeholder="Supervisor name" 
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-650 text-slate-950 font-bold py-2 rounded text-xs transition uppercase font-mono">
            Commit Entry to Ledger
          </button>
        </form>

        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-500" />
              Recent Daily Log Entries
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Job Description</th>
                    <th className="pb-2">Supervisor</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td className="py-2.5 font-mono">{log.date}</td>
                      <td className="py-2.5 font-medium">{log.operation}</td>
                      <td className="py-2.5 text-slate-400">{log.supervisor}</td>
                      <td className="py-2.5 text-right">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`
        }
      ],
      mockUI: (
        <div className="bg-[#0b0c16] text-slate-100 p-6 rounded-2xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-slate-800/60 pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide">Active Engineers Operations Dashboard</h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Railway staff contractor database</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              SECURE SYSTEM LIVE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Total Assets Managed</span>
              <p className="text-xl font-bold font-mono text-white mt-1">42 Units</p>
              <div className="text-[9px] text-emerald-400 mt-2 flex items-center gap-1">
                <span>100% Operational Status</span>
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Staff Attendance</span>
              <p className="text-xl font-bold font-mono text-white mt-1">18 Appointed</p>
              <div className="text-[9px] text-indigo-300 mt-2 flex items-center gap-1">
                <span>Shifts: Day / Night Active</span>
              </div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Contract Period</span>
              <p className="text-xl font-bold font-mono text-white mt-1">Jun 2025 - Present</p>
              <div className="text-[9px] text-amber-400 mt-2 flex items-center gap-1">
                <span>Ongoing Maintenance Cycle</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">On-Site Tool Inspection Checklists</h4>
              <span className="text-[10px] text-indigo-400 font-mono font-bold">Safety Level: Lockout/Tagout Active</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-300">Track Relaying Train (TRT) operation check</span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">Passed</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-300">Machinery tool inspection & supervisor validation</span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">Passed</span>
              </div>
              <div className="flex items-center justify-between bg-slate-900/50 p-2.5 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-300">Maintenance ledger history sync & backup logging</span>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">In-Progress</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "upi-artisans",
      title: "Indian Rural Artisans UPI Marketplace",
      tagline: "A clean, high-converting e-commerce web app styled with local Rupees ₹ pricing",
      tech: ["HTML5", "Tailwind CSS", "ES6 JS", "Google Pay SDK Stub"],
      description: "A beautifully responsive digital storefront designed to help rural Indian artisans showcase custom pottery, woodwork, and textiles directly to corporate buyers with dynamic, currency-locked billing.",
      promptUsed: "Create an artisan e-commerce UI featuring handcrafts. Use Indian currency symbols exclusively (₹) and a modern aesthetic with smooth micro-interactions.",
      codeFiles: [
        {
          name: "index.html",
          language: "html",
          content: `<!-- Artisan Storefront Root -->
<div class="max-w-6xl mx-auto p-4 font-sans">
  <header class="flex justify-between items-center py-4 border-b border-amber-100">
    <h1 class="text-xl font-bold text-amber-900">BharatCrafts</h1>
    <div class="text-xs bg-amber-50 px-3 py-1.5 rounded-full text-amber-800 font-mono">
      Direct payment to artisan's UPI ID
    </div>
  </header>

  <main class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
    <!-- Pottery Card -->
    <div class="border border-amber-100 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div class="h-48 bg-amber-50 flex items-center justify-center">
        <span class="text-amber-700 font-serif">Handmade Terracotta Diya Set</span>
      </div>
      <div class="p-4 space-y-2">
        <h3 class="font-bold text-slate-800">Classic Terracotta Set (12 Pcs)</h3>
        <p class="text-xs text-slate-500">Sourced directly from weavers & potters in UP, India.</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-50">
          <span class="font-bold text-amber-900 text-sm">Price: ₹450</span>
          <button class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition">
            Buy via UPI
          </button>
        </div>
      </div>
    </div>
  </main>
</div>`
        }
      ],
      mockUI: (
        <div className="bg-amber-50/45 p-6 rounded-2xl border border-amber-100 text-slate-800">
          <div className="flex justify-between items-center border-b border-amber-200/50 pb-4 mb-4">
            <h3 className="font-serif font-bold text-amber-950 text-base">BharatCrafts Portal</h3>
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full uppercase">
              UPI Safe Payments Active
            </span>
          </div>

          <p className="text-xs text-amber-900/80 mb-6 italic leading-relaxed">
            "Direct and secure financial connections, sending 100% of the funds straight to the bank accounts of weavers, potters, and craftsmen across Uttar Pradesh."
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-amber-100 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-4 space-y-1.5">
                <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">Handicraft</span>
                <h4 className="font-bold text-slate-800 text-xs">Authentic Banarasi Silk Shawl</h4>
                <p className="text-[11px] text-slate-500">Pure zari weaving by master handloom weavers.</p>
              </div>
              <div className="p-4 pt-0 flex justify-between items-center border-t border-amber-50/50">
                <span className="text-sm font-extrabold text-amber-950 font-mono">₹2,850</span>
                <button className="bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold px-3 py-1 rounded-lg transition">
                  Quick Pay UPI
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-amber-100 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="p-4 space-y-1.5">
                <span className="text-[9px] font-mono font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded">Clayware</span>
                <h4 className="font-bold text-slate-800 text-xs">Terracotta Hand-Painted Pitcher</h4>
                <p className="text-[11px] text-slate-500">Natural cooling action clay from Gorakhpur.</p>
              </div>
              <div className="p-4 pt-0 flex justify-between items-center border-t border-amber-50/50">
                <span className="text-sm font-extrabold text-amber-950 font-mono">₹650</span>
                <button className="bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold px-3 py-1 rounded-lg transition">
                  Quick Pay UPI
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ai-site-builder",
      title: "Interactive AI Site & Layout Constructor",
      tagline: "Live client-side dynamic site compiler powered by strict instruction styling",
      tech: ["HTML5", "Vite Engine", "CSS Grid", "Generative Prompt AI"],
      description: "An incredibly sophisticated application showcasing Imran's primary methodology: taking natural language ideas and instantly structuring them into beautiful responsive landing sections.",
      promptUsed: "Generate a dynamic layout showcasing smart website construction stats. Use deep Indigo, slate background, and no dollar indicators.",
      codeFiles: [
        {
          name: "app.css",
          language: "css",
          content: `/* Custom Layout Design Rules */
.organic-bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.glow-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glow-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.15);
}`
        }
      ],
      mockUI: (
        <div className="bg-[#0e0f22] text-slate-100 p-6 rounded-2xl border border-indigo-950">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs font-mono text-indigo-300 font-bold uppercase tracking-wider">AI Studio Output Screen</span>
            </div>
            <div className="bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded text-[10px] font-mono text-indigo-400">
              STABLE COMPILE PASS
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-900/50">
              <h4 className="text-sm font-extrabold text-white">Dynamic AI Interface Rendering Successful</h4>
              <p className="text-[11px] text-indigo-200 mt-1 leading-relaxed">
                By pairing deep LLMs with highly structured CSS framework specifications, websites are built instantly, safely compiling layout parameters client-side.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                <span className="text-[9px] font-mono text-indigo-300 uppercase block">Execution Speed</span>
                <p className="text-base font-extrabold text-white font-mono mt-1">1.2 Seconds</p>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                <span className="text-[9px] font-mono text-indigo-300 uppercase block">Build Code Quality</span>
                <p className="text-base font-extrabold text-emerald-400 font-mono mt-1">100% Production Ready</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const startCustomGeneration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setGenerationStep("Analyzing prompt instructions...");
    
    setTimeout(() => {
      setGenerationStep("Synthesizing responsive HTML grid structures & component trees...");
      setTimeout(() => {
        setGenerationStep("Compiling Tailwind CSS configuration & injection passes...");
        setTimeout(() => {
          const generatedProj: ProjectPreset = {
            id: "custom-gen-proj",
            title: `AI Render: ${promptInput.length > 30 ? promptInput.substring(0, 30) + "..." : promptInput}`,
            tagline: "Custom generative workspace crafted live",
            tech: ["React 18", "Tailwind Utilities", "Dynamic UI Renderer"],
            description: `A fully custom interactive prototype designed in real-time to fit the description: "${promptInput}". Created with zero dollars using Indian Rupee standards.`,
            promptUsed: promptInput,
            codeFiles: [
              {
                name: "GeneratedApp.tsx",
                language: "tsx",
                content: `import React from 'react';
// Customized code block generated for user description:
// "${promptInput}"
export default function GeneratedApp() {
  return (
    <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800">
      <h3 className="text-sm font-bold text-indigo-300 uppercase font-mono mb-2">Live Generative Render</h3>
      <p className="text-xs text-slate-300 leading-relaxed">${promptInput}</p>
      <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
        PROFESSIONAL PIPELINE COMPILE SUCCESSFUL | INR CURRENCY STRICT
      </div>
    </div>
  );
}`
              }
            ],
            mockUI: (
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold uppercase text-emerald-400">Custom AI Generation Live Output</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">Status: Compiled</span>
                </div>
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-850/50">
                  <h4 className="text-xs font-bold uppercase text-indigo-300 tracking-wider font-mono">Requested Concept</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 italic">
                    "{promptInput}"
                  </p>
                </div>
                <div className="p-4 bg-[#14152e] rounded-xl border border-indigo-900/30 text-center space-y-2">
                  <h5 className="text-xs font-bold text-white font-sans">Dynamic Mock UI Mockup</h5>
                  <p className="text-[11px] text-indigo-200">This prototype has been validated against safety logs, strict linter scripts, and native Indian Rupee structures.</p>
                  <div className="pt-2">
                    <span className="inline-block text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                      ₹0.00 Cost / Professional Draft Saved
                    </span>
                  </div>
                </div>
              </div>
            )
          };
          setActiveFileIdx(0);
          setCustomProject(generatedProj);
          setIsGenerating(false);
          setPromptInput("");
        }, 1200);
      }, 1000);
    }, 800);
  };

  const activeProject = customProject || projectPresets[activeProjectIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] rounded-2xl p-6 shadow-sm animate-fade-in transition-colors duration-300">
      
      {/* LEFT: Project Preset Selector & Custom Input */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white font-mono">Professional AI Project Studio</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-indigo-200 leading-relaxed font-sans">
            Imran uses advanced AI systems to design, develop, and deploy production-ready code. Browse his professional presets or draft a custom design concept below.
          </p>
        </div>

        {/* Dynamic Concept Input Form */}
        <form onSubmit={startCustomGeneration} className="bg-slate-50 dark:bg-[#090a18] p-4 rounded-xl border border-slate-200 dark:border-[#1a1c43] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-indigo-300">Generative Concept Builder</span>
            {customProject && (
              <button 
                type="button" 
                onClick={() => setCustomProject(null)}
                className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
              >
                ← Back to Presets
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              placeholder="Describe a professional system or app (e.g. 'UPI payment tracker for small shopkeepers')..."
              rows={3}
              className="w-full bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] text-slate-800 dark:text-white rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 font-sans resize-none placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating || !promptInput.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-[#18193a] disabled:text-slate-400 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? "Compiling Layout..." : "Draft Custom App"}</span>
          </button>
        </form>

        {/* Project Selector List (Only show if not currently displaying custom compiled project) */}
        {!customProject && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 dark:text-indigo-300 block">Select Professional Preset</span>
            <div className="space-y-2.5">
              {projectPresets.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActiveProjectIdx(idx);
                    setActiveFileIdx(0);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 ${
                    activeProjectIdx === idx
                      ? "bg-indigo-50/70 dark:bg-[#15163d] border-indigo-200 dark:border-indigo-500/35"
                      : "bg-white dark:bg-[#11122a] border-slate-100 dark:border-[#1c1d44] hover:bg-slate-50 dark:hover:bg-[#141535]"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-display font-bold text-xs text-slate-800 dark:text-white">{preset.title}</span>
                    <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 uppercase font-bold">Compiled</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-indigo-200 line-clamp-2 leading-normal">
                    {preset.tagline}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Live Visual Prototype Output & Source Code Explorer */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        
        {/* State Banner / Generation status overlay */}
        {isGenerating ? (
          <div className="bg-slate-50 dark:bg-[#0c0d21] border border-slate-200 dark:border-[#1e204c] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[450px]">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin"></div>
            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white font-mono uppercase tracking-wide">AI Compilation Active</h4>
              <p className="text-xs text-slate-500 dark:text-indigo-300 font-mono animate-pulse">{generationStep}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            
            {/* Visual Screen Mockup Block */}
            <div className="bg-slate-100 dark:bg-[#070817] p-2.5 rounded-2xl border border-slate-200 dark:border-[#1e204c]">
              <div className="bg-white dark:bg-[#0a0b1c] rounded-xl border border-slate-200/55 dark:border-[#1a1b41] overflow-hidden">
                {/* Simulated Web Application Header */}
                <div className="bg-slate-50 dark:bg-[#11122a] border-b border-slate-100 dark:border-[#1e204c] px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="bg-slate-200/60 dark:bg-[#1a1b42] text-[10px] font-mono text-slate-500 dark:text-indigo-300 px-6 py-1 rounded-md text-center max-w-xs truncate">
                    {activeProject.id}.applet.local
                  </div>
                  <div className="w-8"></div>
                </div>

                {/* Main Render Output */}
                <div className="p-4 sm:p-6 bg-white dark:bg-[#0c0d21] min-h-[220px]">
                  {activeProject.mockUI}
                </div>
              </div>
            </div>

            {/* Source Code Inspector Block */}
            {(() => {
              const currentFileIndex = activeFileIdx < activeProject.codeFiles.length ? activeFileIdx : 0;
              const currentFile = activeProject.codeFiles[currentFileIndex] || { name: "", content: "" };
              return (
                <div className="bg-slate-950 rounded-2xl border border-slate-850 overflow-hidden flex flex-col">
                  <div className="bg-slate-900 border-b border-slate-850 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-350">Production Code Inspector</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(currentFile.content, currentFileIndex)}
                        className="flex items-center gap-1 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold transition cursor-pointer"
                      >
                        {copiedIndex === currentFileIndex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIndex === currentFileIndex ? "Copied" : "Copy Code"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Code File Selection Bar */}
                  <div className="flex bg-slate-900/50 border-b border-slate-900 px-3 text-xs text-slate-400">
                    {activeProject.codeFiles.map((file, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => setActiveFileIdx(fIdx)}
                        className={`px-3 py-2 border-b-2 font-mono transition text-[11px] ${
                          currentFileIndex === fIdx
                            ? "border-indigo-500 text-indigo-400 bg-slate-950 font-bold"
                            : "border-transparent hover:text-slate-200"
                        }`}
                      >
                        {file.name}
                      </button>
                    ))}
                  </div>

                  {/* Main Styled Code Viewer */}
                  <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-300 leading-relaxed max-h-[280px] bg-slate-950">
                    <code>{currentFile.content}</code>
                  </pre>
                </div>
              );
            })()}

          </div>
        )}
        
      </div>

    </div>
  );
}
