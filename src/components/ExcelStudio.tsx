import React, { useState } from "react";
import { FileSpreadsheet, Sparkles, RefreshCw, BarChart3, TrendingUp, AlertCircle, Grid } from "lucide-react";
import { ExcelSheet, ExcelRow, ExcelHeader, ExcelMetric } from "../types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from "recharts";

export default function ExcelStudio() {
  const defaultSheet: ExcelSheet = {
    title: "Q3 Sales Performance & Commissions",
    chartType: "composed",
    headers: [
      { key: "agent", label: "Sales Representative", type: "string" },
      { key: "sales", label: "Gross Sales (₹)", type: "number" },
      { key: "quota", label: "Quota Target (₹)", type: "number" },
      { key: "commission", label: "Commission Payout (₹)", type: "formula", formula: "=sales*0.12" },
      { key: "conversion", label: "Deal Conversion (%)", type: "number" },
    ],
    rows: [
      { agent: "Sophia Miller", sales: 120000, quota: 100000, commission: 14400, conversion: 24 },
      { agent: "Liam Cooper", sales: 95000, quota: 100000, commission: 11400, conversion: 18 },
      { agent: "Noah Vance", sales: 145000, quota: 120000, commission: 17400, conversion: 28 },
      { agent: "Emma Harris", sales: 110000, quota: 100000, commission: 13200, conversion: 22 },
      { agent: "Jackson Reid", sales: 85000, quota: 90000, commission: 10200, conversion: 15 },
      { agent: "Mia Vance", sales: 130000, quota: 110000, commission: 15600, conversion: 26 },
    ],
    summaryMetrics: [
      { label: "Total Gross Revenue", value: "₹6,85,000", excelFormula: "=SUM(B2:B7)" },
      { label: "Average Commission", value: "₹13,700", excelFormula: "=AVERAGE(D2:D7)" },
      { label: "Average Conversion Rate", value: "22.1%", excelFormula: "=AVERAGE(E2:E7)" },
    ],
  };

  const [sheet, setSheet] = useState<ExcelSheet>(defaultSheet);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Grid Selection and Formula Bar State
  const [selectedCell, setSelectedCell] = useState<{ row: number; colKey: string } | null>({ row: 0, colKey: "sales" });
  const [editingValue, setEditingValue] = useState<string>("120000");

  const handleCellSelect = (rowIndex: number, col: ExcelHeader) => {
    setSelectedCell({ row: rowIndex, colKey: col.key });
    const val = sheet.rows[rowIndex][col.key];
    setEditingValue(col.type === "formula" ? col.formula || "" : String(val));
  };

  const handleCellChange = (newValue: string) => {
    if (!selectedCell) return;
    setEditingValue(newValue);
    
    const { row: rIdx, colKey: cKey } = selectedCell;
    const updatedRows = [...sheet.rows];
    const header = sheet.headers.find(h => h.key === cKey);
    
    if (!header) return;

    if (header.type === "number") {
      const numVal = parseFloat(newValue) || 0;
      updatedRows[rIdx][cKey] = numVal;
      
      // If there are formulas dependent on this, recalculate them
      sheet.headers.forEach((h) => {
        if (h.type === "formula" && h.formula === "=sales*0.12" && cKey === "sales") {
          updatedRows[rIdx][h.key] = Math.round(numVal * 0.12 * 100) / 100;
        }
      });
    } else {
      updatedRows[rIdx][cKey] = newValue;
    }

    setSheet((prev) => ({ ...prev, rows: updatedRows }));
  };

  const handleAISheetGeneration = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/excel-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, rowsCount: 8 }),
      });

      if (!response.ok) {
        throw new Error("Failed to compile spreadsheet from server. Check configurations.");
      }

      const data = await response.json();
      if (data && data.headers && data.rows) {
        setSheet(data);
        // Reset cell selection to first numeric data cell
        const numHeader = data.headers.find((h: ExcelHeader) => h.type === "number");
        if (numHeader) {
          setSelectedCell({ row: 0, colKey: numHeader.key });
          setEditingValue(String(data.rows[0][numHeader.key]));
        } else {
          setSelectedCell(null);
        }
      } else {
        throw new Error("Invalid structure returned by AI.");
      }
      setTopic("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSheet(defaultSheet);
    setSelectedCell({ row: 0, colKey: "sales" });
    setEditingValue("120000");
    setError(null);
  };

  // Render proper chart based on recommended chart type in sheet metadata
  const renderChart = () => {
    const data = sheet.rows;
    // Map keys dynamically
    const numberHeaders = sheet.headers.filter(h => h.type === "number" || h.type === "formula");
    if (numberHeaders.length === 0) return null;
    
    const xAxisKey = sheet.headers[0].key; // Usually string label like 'agent' or 'month'
    const barKey = numberHeaders[0]?.key;
    const lineKey = numberHeaders[1]?.key;
    const areaKey = numberHeaders[2]?.key;

    const fillColors = ["#4f46e5", "#10b981", "#3b82f6", "#f43f5e", "#8b5cf6"];

    if (sheet.chartType === "line") {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#1e293b", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {numberHeaders.map((h, i) => (
            <Line key={h.key} type="monotone" dataKey={h.key} name={h.label} stroke={fillColors[i % fillColors.length]} strokeWidth={2.5} activeDot={{ r: 6 }} />
          ))}
        </LineChart>
      );
    }

    if (sheet.chartType === "area") {
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#1e293b", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {numberHeaders.map((h, i) => (
            <Area key={h.key} type="monotone" dataKey={h.key} name={h.label} stroke={fillColors[i % fillColors.length]} fill={i === 0 ? "url(#colorArea)" : "transparent"} strokeWidth={2} />
          ))}
        </AreaChart>
      );
    }

    if (sheet.chartType === "bar") {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#1e293b", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {numberHeaders.map((h, i) => (
            <Bar key={h.key} dataKey={h.key} name={h.label} fill={fillColors[i % fillColors.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      );
    }

    // Default composed
    return (
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={11} tickLine={false} />
        <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", color: "#1e293b", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {barKey && <Bar dataKey={barKey} name={sheet.headers.find(h => h.key === barKey)?.label || ""} fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={28} />}
        {lineKey && <Line type="monotone" dataKey={lineKey} name={sheet.headers.find(h => h.key === lineKey)?.label || ""} stroke="#10b981" strokeWidth={3} />}
        {areaKey && <Area type="monotone" dataKey={areaKey} name={sheet.headers.find(h => h.key === areaKey)?.label || ""} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} />}
      </ComposedChart>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] rounded-2xl p-6 shadow-sm transition-colors duration-300">
      {/* Spreadsheet Workspace Column */}
      <div className="xl:col-span-8 flex flex-col space-y-4">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e204c] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#15163c] border border-indigo-100 dark:border-[#22245c] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm">Interactive Spreadsheet Studio</h3>
              <p className="text-[10px] text-slate-500 dark:text-indigo-300 font-mono">Dynamic formula calculations</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-[11px] font-mono text-slate-600 dark:text-indigo-200 hover:text-slate-855 flex items-center gap-1 bg-slate-50 dark:bg-[#18193d] px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-[#202256] hover:border-slate-300 dark:hover:border-indigo-500 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Template
          </button>
        </div>

        {/* Excel Formula bar */}
        <div className="flex items-center bg-slate-50 dark:bg-[#131432] border border-slate-200 dark:border-[#1e204c] rounded-xl px-3 py-2 gap-2 font-mono text-xs">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold px-1 select-none flex items-center gap-1">
            <Grid className="w-3.5 h-3.5" />
            fx
          </span>
          <div className="h-4 w-px bg-slate-200 dark:bg-[#202256]"></div>
          {selectedCell ? (
            <span className="text-slate-600 dark:text-indigo-200 font-medium bg-white dark:bg-[#11122a] px-2 py-0.5 rounded border border-slate-200 dark:border-[#202256] select-none uppercase">
              {String.fromCharCode(65 + sheet.headers.findIndex(h => h.key === selectedCell.colKey))}
              {selectedCell.row + 2}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-indigo-400">Select any cell</span>
          )}
          <input
            type="text"
            value={editingValue}
            onChange={(e) => handleCellChange(e.target.value)}
            disabled={!selectedCell || sheet.headers.find(h => h.key === selectedCell.colKey)?.type === "formula"}
            placeholder="Select a numeric cell to edit cell value directly..."
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          />
        </div>

        {/* Real Grid container */}
        <div className="overflow-x-auto border border-slate-200 dark:border-[#1e204c] rounded-xl bg-white dark:bg-[#11122a] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#131432] border-b border-slate-200 dark:border-[#1e204c]">
                <th className="p-2.5 text-[10px] text-center text-slate-400 font-mono border-r border-slate-200 dark:border-[#1e204c] select-none w-10"></th>
                {sheet.headers.map((h, i) => (
                  <th key={h.key} className="p-2.5 text-xs text-slate-600 dark:text-indigo-200 font-semibold border-r border-slate-200 dark:border-[#1e204c]">
                    <div className="flex items-center justify-between">
                      <span>{h.label}</span>
                      <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-mono uppercase bg-indigo-50/50 dark:bg-[#15163c] px-1 py-0.5 rounded select-none border border-indigo-100/50 dark:border-[#22245c]">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheet.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-slate-200 dark:border-[#1e204c] hover:bg-slate-50/50 dark:hover:bg-[#18193d] transition">
                  {/* Row indices */}
                  <td className="p-2 text-[10px] text-center text-slate-400 font-mono border-r border-slate-200 dark:border-[#1e204c] bg-slate-50 dark:bg-[#131432] select-none font-semibold">
                    {rIdx + 2}
                  </td>
                  {/* Real columns values */}
                  {sheet.headers.map((col) => {
                    const isSelected = selectedCell?.row === rIdx && selectedCell?.colKey === col.key;
                    const value = row[col.key];
                    const isFormula = col.type === "formula";
                    const isNum = col.type === "number" || isFormula;

                    return (
                      <td
                        key={col.key}
                        onClick={() => handleCellSelect(rIdx, col)}
                        className={`p-2.5 text-xs font-mono border-r border-slate-200 dark:border-[#1e204c] cursor-pointer transition relative group ${
                          isSelected 
                            ? "bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-semibold shadow-[inset_0_0_0_1.5px_#6366f1]" 
                            : isFormula
                            ? "text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50/30 dark:bg-[#102b1c]/20"
                            : "text-slate-700 dark:text-slate-300"
                        } ${isNum ? "text-right" : "text-left"}`}
                      >
                        {isFormula ? (
                          <span>
                            {typeof value === "number" ? `₹${value.toLocaleString("en-IN")}` : value}
                          </span>
                        ) : col.type === "number" ? (
                          <span>
                            {col.key.toLowerCase().includes("conversion") || col.key.toLowerCase().includes("percentage") || col.key.toLowerCase().includes("rate")
                              ? `${value}%`
                              : `₹${Number(value).toLocaleString("en-IN")}`}
                          </span>
                        ) : (
                          <span className="font-sans font-medium text-slate-800 dark:text-white">{value}</span>
                        )}

                        {isFormula && (
                          <span className="absolute bottom-1 right-1 text-[8px] bg-emerald-50 dark:bg-[#102b1c] text-emerald-600 dark:text-emerald-400 font-sans border border-emerald-100 dark:border-[#153e28] px-0.5 rounded opacity-0 group-hover:opacity-100 transition select-none">
                            formula
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dynamic AI Spreadsheet generator */}
        <div className="bg-slate-50 dark:bg-[#131432] border border-slate-200 dark:border-[#1e204c] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-800 dark:text-white">Gemini Spreadsheet Generator</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-indigo-200 leading-relaxed">
            Let Gemini build full realistic worksheets for any custom business topic. It dynamically writes standard Excel headers, generates mock records, and recommends a specific charting display layout!
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 10-Month Crypto Gains, Company Expense Tracker, SaaS Subscription Tiers..."
              disabled={loading}
              className="flex-1 px-3 py-2.5 bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] rounded-lg text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAISheetGeneration}
              disabled={loading || !topic.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 text-white disabled:text-slate-400 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-[#2b1016] border border-rose-200 dark:border-[#56202c] rounded-lg text-xs font-mono text-rose-700 dark:text-rose-300 flex items-start gap-1.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>
                <strong>Spreadsheet AI Error:</strong> {error}. Make sure GEMINI_API_KEY is configured under Settings.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart & Summary Column */}
      <div className="xl:col-span-4 flex flex-col space-y-4">
        {/* Chart Header */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1e204c] pb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#102b1c] border border-emerald-100 dark:border-[#153e28] flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-800 dark:text-white text-sm">Spreadsheet Analytics</h3>
            <p className="text-[10px] text-slate-500 dark:text-indigo-300 font-mono">Dynamic charting layout</p>
          </div>
        </div>

        {/* Visual Chart Canvas */}
        <div className="bg-white dark:bg-[#131432] border border-slate-200 dark:border-[#1e204c] rounded-xl p-4 flex flex-col justify-between h-[250px] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-indigo-200 truncate pr-2">{sheet.title}</h4>
            <span className="text-[10px] bg-indigo-50 dark:bg-[#15163c] text-indigo-600 dark:text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-100 dark:border-[#22245c] uppercase select-none">
              {sheet.chartType}
            </span>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[170px] flex items-center justify-center text-slate-800 dark:text-slate-100">
            {renderChart() ? (
              <ResponsiveContainer width="100%" height={200}>
                {renderChart()!}
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 dark:text-indigo-400 text-xs text-center">No charting metrics available</div>
            )}
          </div>
        </div>

        {/* Excel style Summary Cards */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 font-mono uppercase tracking-wider">Spreadsheet Summary Cards</h4>
          <div className="grid grid-cols-1 gap-2">
            {sheet.summaryMetrics.map((met, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-[#131432] border border-slate-200 dark:border-[#1e204c] rounded-xl p-3 flex justify-between items-center group relative overflow-hidden">
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-slate-500 dark:text-indigo-300 leading-tight">{met.label}</p>
                  <p className="text-sm font-semibold font-mono text-slate-850 dark:text-white">{met.value}</p>
                </div>
                {met.excelFormula && (
                  <span className="text-[9px] font-mono bg-emerald-50 dark:bg-[#102b1c]/40 text-emerald-650 dark:text-emerald-400 border border-emerald-100 dark:border-[#153e28] px-1.5 py-0.5 rounded opacity-70 group-hover:opacity-100 transition">
                    {met.excelFormula}
                  </span>
                )}
                {/* Visual hover background indicator */}
                <div className="absolute right-0 top-0 h-full w-0.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Office automation tips */}
        <div className="bg-slate-50 dark:bg-[#131432] border border-slate-200 dark:border-[#1e204c] rounded-xl p-3 text-[11px] text-slate-500 dark:text-indigo-300 font-sans space-y-1">
          <div className="font-semibold text-slate-700 dark:text-white flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Excel Automation
          </div>
          <p>
            This tab mimics advanced Excel JS API scripts. Select values on the left grid, change cells in the formula line, or query the Gemini creator. All charts replot coordinates dynamically with robust bounds.
          </p>
        </div>
      </div>
    </div>
  );
}
