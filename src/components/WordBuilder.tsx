import React, { useState } from "react";
import { FileText, Sparkles, RefreshCw, Copy, Printer, Check, AlertCircle, FileSpreadsheet } from "lucide-react";
import { WordDoc, DocSection, DocSectionContent } from "../types";

export default function WordBuilder() {
  const defaultDoc: WordDoc = {
    title: "AI Automation Agent Project Charter",
    subtitle: "Enterprise Integration for Automated Excel & Word Reporting Pipelines",
    meta: {
      author: "Imran Ansari",
      date: "7/2/2026",
      version: "v1.2.0",
      classification: "Confidential - Internal Use Only",
    },
    sections: [
      {
        heading: "1. Executive Summary",
        content: [
          {
            type: "paragraph",
            text: "This project charter outlines the architectural design and deployment scope for integrating Google Gemini AI models directly into corporate Office workflows. By establishing automated pipelines, business analysts can generate complex financial workbooks (Excel) and technical compliance drafts (Word) from raw, multi-source logs, reducing data entry cycles by up to 85%.",
          },
          {
            type: "callout",
            text: "Key Performance Indicator: Target processing times for quarterly data tables is reduced from 14 operational hours to under 45 seconds, backed by fully-auditable local script configurations.",
          },
        ],
      },
      {
        heading: "2. Technical Objectives & Scope",
        content: [
          {
            type: "paragraph",
            text: "The software solution is segmented into three primary modules, ensuring robust local sandboxing and high extensibility:",
          },
          {
            type: "bullet-list",
            items: [
              "Server-side Gemini proxy to keep proprietary API secrets secure from client exposure.",
              "Reactive spreadsheet renderer mapping raw AI coordinates to Recharts vector graphs.",
              "Clean CSS Word document compiler featuring mock-up paper simulations and direct print pipelines.",
            ],
          },
        ],
      },
      {
        heading: "3. Strategic Benefits",
        content: [
          {
            type: "paragraph",
            text: "Office automation is no longer about simple VBA macros. Modern enterprise teams leverage agentic reasoning to write smart spreadsheets, analyze data trends, and draft consistent regulatory compliance reports. Imran Ansari's custom integration demonstrates how AI bridges the gap between browser execution and local Office suite processes.",
          },
        ],
      },
    ],
  };

  const [doc, setDoc] = useState<WordDoc>(defaultDoc);
  const [docType, setDocType] = useState("Project Charter");
  const [prompt, setPrompt] = useState("");
  const [styleTheme, setStyleTheme] = useState("Corporate Modern");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const documentTypes = [
    "Project Charter",
    "Software Specification",
    "Executive Cover Letter",
    "Service Level Agreement (SLA)",
    "Creative Design Brief"
  ];

  const styleThemes = [
    "Corporate Modern",
    "Minimalist Slate",
    "Warm Editorial",
    "Technical Brutalist"
  ];

  const handleAIRequest = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setCopied(false);

    try {
      const response = await fetch("/api/ai/word-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, prompt, styleTheme }),
      });

      if (!response.ok) {
        throw new Error("Failed to compile document from server. Check configurations.");
      }

      const data = await response.json();
      if (data && data.title && data.sections) {
        setDoc(data);
        setPrompt("");
      } else {
        throw new Error("Invalid document structure returned by AI.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDoc(defaultDoc);
    setError(null);
    setCopied(false);
  };

  const handleCopy = () => {
    // Generate text outline to copy
    let textOutline = `DOCUMENT: ${doc.title}\nSUBTITLE: ${doc.subtitle}\n`;
    textOutline += `METADATA:\n- Author: ${doc.meta.author}\n- Date: ${doc.meta.date}\n- Version: ${doc.meta.version || "1.0.0"}\n- Classification: ${doc.meta.classification || "Public"}\n\n`;
    
    doc.sections.forEach((s) => {
      textOutline += `${s.heading}\n====================\n`;
      s.content.forEach((c) => {
        if (c.type === "paragraph") {
          textOutline += `${c.text}\n\n`;
        } else if (c.type === "callout") {
          textOutline += `[HIGHLIGHT CARD]\n${c.text}\n\n`;
        } else if (c.type === "bullet-list" && c.items) {
          c.items.forEach((item) => {
            textOutline += `• ${item}\n`;
          });
          textOutline += `\n`;
        }
      });
    });

    navigator.clipboard.writeText(textOutline);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Map theme styles to CSS classes on the Word sheet page
  const getThemeClasses = () => {
    switch (styleTheme) {
      case "Minimalist Slate":
        return {
          page: "bg-white border-t-8 border-slate-700 shadow-sm",
          title: "text-slate-800 font-display font-bold tracking-tight text-3xl",
          heading: "text-slate-700 font-display font-semibold border-b border-slate-100 pb-1 text-lg",
          callout: "bg-slate-50 border-l-4 border-slate-600 text-slate-700 font-sans italic"
        };
      case "Warm Editorial":
        return {
          page: "bg-amber-50/10 border-t-8 border-amber-800 shadow-sm",
          title: "text-amber-950 font-serif font-bold text-3xl",
          heading: "text-amber-900 font-serif font-semibold border-b border-amber-100 pb-1 text-lg",
          callout: "bg-amber-50/40 border-l-4 border-amber-700 text-amber-900 font-serif italic"
        };
      case "Technical Brutalist":
        return {
          page: "bg-white border-t-8 border-yellow-500 shadow-[8px_8px_0px_#000]",
          title: "text-black font-mono font-black uppercase text-2xl tracking-tight",
          heading: "text-black font-mono font-bold uppercase border-b-2 border-black pb-1 text-md",
          callout: "bg-yellow-500/5 border-2 border-black text-black font-mono"
        };
      // Corporate Modern default
      default:
        return {
          page: "bg-white border-t-8 border-indigo-600 shadow-sm",
          title: "text-slate-900 font-display font-extrabold tracking-tight text-3xl",
          heading: "text-indigo-900 font-display font-semibold border-b border-slate-100 pb-1.5 text-lg",
          callout: "bg-indigo-50/50 border-l-4 border-indigo-600 text-slate-700 font-sans"
        };
    }
  };

  const currentTheme = getThemeClasses();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* Workspace Controls */}
      <div className="xl:col-span-5 flex flex-col space-y-4">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-sm">Word Document Architect</h3>
              <p className="text-[10px] text-slate-500 font-mono">Simulate paper templates</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-[11px] font-mono text-slate-600 hover:text-slate-855 flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Reset
          </button>
        </div>

        {/* Document parameters inputs */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Document Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              {documentTypes.slice(0, 4).map((type) => (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`py-2 px-3 text-left rounded-lg text-xs font-medium transition cursor-pointer ${
                    docType === type
                      ? "bg-indigo-600 text-white font-semibold shadow-sm"
                      : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Visual Styling Theme</label>
            <select
              value={styleTheme}
              onChange={(e) => setStyleTheme(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500 font-sans"
            >
              {styleThemes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Document Briefing</label>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A business proposal for installing an AI reporting system in a real estate company, including cost benefits and timeline..."
              rows={4}
              disabled={loading}
              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleAIRequest}
            disabled={loading || !prompt.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 text-white disabled:text-slate-400 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Compiling Document Outline...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                Generate Styled Word Document
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-mono text-rose-700 flex items-start gap-1.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>
                <strong>Document AI Error:</strong> {error}. Ensure you have your GEMINI_API_KEY saved.
              </span>
            </div>
          )}
        </div>

        {/* Word templates capabilities tip */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 font-sans space-y-1">
          <div className="font-semibold text-slate-700 flex items-center gap-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
            Word Automation Architecture
          </div>
          <p>
            Office developers utilize server-side XML compilers to draft `.docx` files. This module demonstrates consistent document design templates with custom meta-structures. Try customizing the Visual Themes to see dynamic font/border shifts!
          </p>
        </div>
      </div>

      {/* Simulated Paper Sheets Column */}
      <div className="xl:col-span-7 flex flex-col space-y-4">
        {/* Paper Actions */}
        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] text-slate-500 font-mono">Word Online Live Render</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Outline
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / PDF
            </button>
          </div>
        </div>

        {/* Real paper sheets wrapper */}
        <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-6 overflow-y-auto max-h-[500px]">
          <div className={`shadow-md rounded-sm p-8 sm:p-12 mx-auto max-w-2xl min-h-[550px] flex flex-col justify-between transition-all duration-300 print-target ${currentTheme.page}`}>
            <div className="space-y-6">
              {/* Meta information tags */}
              <div className="flex flex-wrap justify-between items-center text-[10px] uppercase tracking-wider font-mono text-slate-400 border-b border-slate-100 pb-2.5">
                <div>CLASSIFICATION: <span className="font-bold text-slate-600">{doc.meta.classification || "CONFIDENTIAL"}</span></div>
                <div className="flex gap-3">
                  <span>VERSION: {doc.meta.version || "1.0.0"}</span>
                  <span>DATE: {doc.meta.date}</span>
                </div>
              </div>

              {/* Title group */}
              <div className="space-y-2">
                <h1 className={currentTheme.title}>{doc.title}</h1>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">{doc.subtitle}</p>
                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                  <span>Author: <strong>{doc.meta.author}</strong></span>
                  <span>•</span>
                  <span>Compiled via Gemini AI Suite</span>
                </div>
              </div>

              {/* Section blocks */}
              <div className="space-y-6 pt-4">
                {doc.sections.map((sect, sIdx) => (
                  <div key={sIdx} className="space-y-3">
                     <h2 className={currentTheme.heading}>{sect.heading}</h2>
                    {sect.content.map((elem, eIdx) => {
                      if (elem.type === "paragraph") {
                        return (
                          <p key={eIdx} className="text-xs text-slate-600 leading-relaxed font-sans font-normal">
                            {elem.text}
                          </p>
                        );
                      }
                      if (elem.type === "callout") {
                        return (
                          <div key={eIdx} className={`p-3.5 rounded text-xs font-normal border border-slate-100/50 leading-relaxed ${currentTheme.callout}`}>
                            {elem.text}
                          </div>
                        );
                      }
                      if (elem.type === "bullet-list" && elem.items) {
                        return (
                          <ul key={eIdx} className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-600 font-sans font-normal">
                            {elem.items.map((item, iIdx) => (
                              <li key={iIdx} className="leading-relaxed pl-1">
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Document footer page stamp */}
            <div className="border-t border-slate-100 mt-12 pt-4 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>SYSTEM COMPILED OK</span>
              <span>PAGE 1 OF 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
