import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini API Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY environment variable is not defined.");
}

/**
 * Safely call Gemini with automatic retries and fallback to a stable model
 * if the primary model experiences transient errors (like 503 high demand or 429 rate limits).
 */
async function generateContentWithFallback(
  aiClient: GoogleGenAI,
  params: {
    model?: string;
    contents: any;
    config?: any;
  }
) {
  const primaryModel = params.model || "gemini-3.5-flash";
  const modelsToTry = [primaryModel, "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let retries = 2; // Try up to 2 retries per model
    while (retries >= 0) {
      try {
        console.log(`[Gemini API] Attempting generation with model: ${modelName} (${retries} retries remaining)`);
        const response = await aiClient.models.generateContent({
          ...params,
          model: modelName,
        });
        
        // Ensure we got a valid response with text
        if (response) {
          return response;
        }
        throw new Error("Empty response received from Gemini API");
      } catch (err: any) {
        lastError = err;
        const errStr = String(err.message || err.status || err);
        const isTransient = 
          errStr.includes("503") || 
          errStr.includes("UNAVAILABLE") || 
          errStr.includes("429") || 
          errStr.includes("RESOURCE_EXHAUSTED") ||
          errStr.includes("high demand") ||
          errStr.includes("temporary");

        if (isTransient && retries > 0) {
          console.log(`[Gemini API] Target model temporarily busy. Re-trying in 1.5 seconds...`);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          retries--;
        } else {
          console.log(`[Gemini API] Target model unavailable. Trying alternative model...`);
          break; // Break the retry loop, move to next model in the fallback array
        }
      }
    }
  }

  throw lastError || new Error("All fallback models and retries failed.");
}

// ----------------- API ROUTES -----------------

// 1. General AI Conversation & Assistant
app.post("/api/ai/chat", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "Gemini API client is not configured. Please add your key in Settings." });
    }

    const { messages, context } = req.body;
    
    // Construct system instructions
    const systemInstruction = `You are a helpful, expert AI assistant integrated into Imran's Portfolio Studio. 
You represent Imran Ansari, a highly skilled Full-Stack AI Developer & Office Automator. 
Your core competencies include:
1. Web Development (HTML5, CSS3, Tailwind CSS, JavaScript, React, Node.js).
2. AI Knowledge (LLMs, Prompt Engineering, Gemini API Integration, agentic systems).
3. Office Suite Integration (Excel Advanced Formulas like XLOOKUP/INDEX+MATCH, VBA, Excel JS Add-ins, Word automation).

Your tone should be professional, creative, elegant, and helpful. 
When asked about Imran's portfolio or skills, give direct, enthusiastic answers.
When asked about HTML, CSS, JavaScript, Excel, or Word, provide highly technical, correct, and structured examples.
Keep your answers relatively concise, well-formatted in Markdown.`;

    // Convert messages array to prompt
    // Map past messages to a clean chat history or single combined prompt
    let promptText = "";
    if (context) {
      promptText += `[Context of Current Project: ${context}]\n\n`;
    }
    
    // Map messages
    if (Array.isArray(messages)) {
      messages.forEach((msg: any) => {
        const role = msg.role === "user" ? "User" : "Assistant";
        promptText += `${role}: ${msg.content}\n\n`;
      });
      promptText += "Assistant: ";
    } else {
      promptText = req.body.prompt || "Hello!";
    }

    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    res.status(500).json({ error: error.message || "An error occurred during generation" });
  }
});

// 2. HTML/CSS/JS Playground Optimizer
app.post("/api/ai/optimize-code", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "Gemini API client is not configured." });
    }

    const { html, css, js, instruction } = req.body;

    const systemInstruction = `You are an expert Frontend Developer. You optimize HTML, CSS, and JavaScript.
Your goal is to refactor, style, or enhance the provided code based on the user's instructions.
You must return your response strictly as a JSON object with 'html', 'css', 'js', and 'explanation' fields. 
Do not include any Markdown wrapping around the JSON code blocks, return ONLY valid parsable JSON.`;

    const promptText = `
Optimize or modify the following code snippet.
User Instructions: ${instruction || "Make it look highly professional, clean, responsive, and add elegant animations."}

--- HTML ---
${html || ""}

--- CSS ---
${css || ""}

--- JS ---
${js || ""}

Return a JSON with keys:
"html": optimized HTML code as a string,
"css": optimized CSS code as a string,
"js": optimized JS code as a string,
"explanation": short text explaining the changes.`;

    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            html: { type: Type.STRING },
            css: { type: Type.STRING },
            js: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["html", "css", "js", "explanation"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/optimize-code:", error);
    res.status(500).json({ error: error.message || "An error occurred during code optimization" });
  }
});

// 3. AI Excel Data Generator
app.post("/api/ai/excel-data", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "Gemini API client is not configured." });
    }

    const { topic, rowsCount } = req.body;
    const count = rowsCount || 10;

    const systemInstruction = `You are an expert Excel Data Analyst and Spreadsheet Automation Specialist based in India.
Your task is to generate professional, realistic tabular data for Excel, including calculated columns, labels, formulas, and metadata.
IMPORTANT: Do NOT use Dollars ($) as the currency. Always use Indian Rupees (₹) and Indian currency representations. Formats like Lakhs or standard numeric formatting with the ₹ symbol should be recommended in labels or metrics.
You must return your response strictly in JSON format matching the schema. 
Provide a set of headers, and realistic data rows that would make a beautiful dashboard. 
Include at least one or two formulas written in standard Excel UPPERCASE format (e.g. "=SUM(C2:C11)" or "=C2*D2") for calculated columns.`;

    const promptText = `Generate a spreadsheet dataset for: "${topic || "Monthly Sales Performance Dashboard"}".
The dataset must have around ${count} rows of realistic data.
Include column headers, cell values, and explicit Excel formulas for calculated columns.
Also suggest a clean title and a recommended Chart Type (e.g., "bar", "line", "area", "pie", "composed").`;

    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the spreadsheet/dashboard" },
            chartType: { type: Type.STRING, description: "Recommended chart type: bar, line, area, pie" },
            headers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING, description: "Unqiue lowercase key for data mapping" },
                  label: { type: Type.STRING, description: "User visible column name" },
                  type: { type: Type.STRING, description: "number, string, or formula" },
                  formula: { type: Type.STRING, description: "Excel formula if type is formula, e.g. =B2*C2" },
                },
                required: ["key", "label", "type"],
              },
            },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                description: "Key-value pairs matching headers. Include numbers as actual numbers, strings as strings.",
              },
            },
            summaryMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  excelFormula: { type: Type.STRING },
                },
                required: ["label", "value"],
              },
            },
          },
          required: ["title", "chartType", "headers", "rows", "summaryMetrics"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/excel-data:", error);
    res.status(500).json({ error: error.message || "An error occurred during Excel data generation" });
  }
});

// 4. AI Word Document Generator
app.post("/api/ai/word-doc", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: "Gemini API client is not configured." });
    }

    const { docType, prompt, styleTheme } = req.body;

    const systemInstruction = `You are a professional Technical Writer and Document Architect who designs beautiful Word/Wordpress templates.
You generate clean, professional document content structured as JSON so it can be formatted elegantly.
Include titles, subheadings, paragraphs, bullet lists, custom highlight boxes (callouts), and metadata.`;

    const promptText = `
Generate a professional document of type "${docType || "Business Proposal"}" based on the prompt:
"${prompt || "A project charter for an AI-powered automated reporting system using Google Gemini and Excel."}"

The visual theme style is: "${styleTheme || "Corporate Modern"}".

Return a strictly structured JSON containing the document outline, ready to be styled nicely with Tailwind CSS.`;

    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            meta: {
              type: Type.OBJECT,
              properties: {
                author: { type: Type.STRING },
                date: { type: Type.STRING },
                version: { type: Type.STRING },
                classification: { type: Type.STRING },
              },
              required: ["author", "date"],
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, description: "paragraph, bullet-list, callout, table" },
                        text: { type: Type.STRING, description: "Text content (used for paragraph or callout)" },
                        items: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Array of strings if type is bullet-list",
                        },
                      },
                      required: ["type"],
                    },
                  },
                },
                required: ["heading", "content"],
              },
            },
          },
          required: ["title", "subtitle", "meta", "sections"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/ai/word-doc:", error);
    res.status(500).json({ error: error.message || "An error occurred during Word document generation" });
  }
});


// ----------------- VITE SETUP -----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
