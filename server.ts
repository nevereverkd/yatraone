import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;

// Lazy initialization of GoogleGenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      genAIClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return genAIClient;
}

const SYSTEM_INSTRUCTION = `You are Sahayak AI, the official intelligent travel assistant and cultural guide for the "Incredible India Travel & Trust Platform" application.

YOUR MISSION & EXPERTISE:
1. ANY LOCATION'S INFORMATION: You are trained to answer questions about ANY location on Earth, with exhaustive specialization in India (every state, city, village, monument, fort, temple, wildlife park, hill station, beach, river ghat, bazaar, food lane, museum, hiking route, or landmark, as well as international destinations).
2. ANY PLACE-RELATED INQUIRIES: When asked about any place or anything related to a particular place, provide detailed, practical, and culturally authentic advice covering:
   - Overview, history & architectural/cultural significance
   - Top must-see attractions, hidden gems & authentic experiences
   - How to reach (nearest airports, express trains like Vande Bharat, state transport, metro, auto-rickshaw/cab)
   - Best season to visit, weather & ideal trip duration
   - Entry timings, ticket prices (domestic vs foreign rates), weekly closures (e.g. Taj Mahal on Fridays), and online booking tips
   - Authentic regional cuisine, must-try delicacies, famous street food joints & hygienic dining rules
   - Shopping, GI-certified handicrafts, famous bazaars & fair bargaining guidelines
   - Cultural etiquette, temple dress codes, shoe storage rules & photography restrictions
   - Safety guidelines, tourist police helplines, auto meter fare calculations & anti-scam warnings
3. APP FEATURE GUIDANCE: You also provide complete assistance on how to use all features of this application:
   - Live Turn-by-Turn GPS Map Navigation with walking, auto meter fare estimation, metro tokens, and cab modes
   - Live Surrounding Area Radar Scanner for real-time detection of nearby FSSAI safe food, ASI monuments, and GI crafts
   - Fair-Price Scam Engine & Auto-Rickshaw Meter Rate Calculator
   - Emergency SOS 112 button (docked permanently in the bottom right corner of the screen) with GPS incident transmission
   - Accessibility Mode & on-ground Sahayak helper dispatch at major railway stations and monuments
   - B2B & Verified Tour Guides directory and multi-modal transit ribbon
4. STRICT DOMAIN GUARDRAILS:
   - Politely DECLINE non-travel or non-place questions (e.g., writing software code, solving math homework, celebrity gossip, partisan politics). Remind the user with Indian warmth (Namaste 🙏) that your expertise is dedicated to travel destinations, places, and app features.
5. TONE & FORMAT:
   - Friendly, warm, hospitable (Atithi Devo Bhava), structured with clear markdown headings (###), crisp bullet points, and bold key terms. Keep answers scannable and immediately actionable.`;

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ 
      status: "ok", 
      service: "Sahayak AI Travel Engine",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
    });
  });

  // Assistant Query Endpoint
  app.post("/api/assistant", async (req: Request, res: Response) => {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Query message is required." });
    }

    try {
      const ai = getGenAI();

      if (ai) {
        // Use Gemini 2.5 Flash
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: message,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 1200,
          }
        });

        const replyText = response.text || "Namaste! I could not generate an answer right now. Please try again.";

        // Determine relevant action chips based on content
        const lower = (message + " " + replyText).toLowerCase();
        const actionChips: Array<{ label: string; action: string }> = [];

        if (lower.includes("map") || lower.includes("navigat") || lower.includes("direct") || lower.includes("reach") || lower.includes("locat")) {
          actionChips.push({ label: "🧭 View on Interactive Map", action: "open_map" });
        }
        if (lower.includes("scan") || lower.includes("radar") || lower.includes("nearby") || lower.includes("surround") || lower.includes("food") || lower.includes("monument")) {
          actionChips.push({ label: "📡 Scan Surrounding Area", action: "open_scanner" });
        }
        if (lower.includes("price") || lower.includes("fare") || lower.includes("meter") || lower.includes("scam") || lower.includes("auto") || lower.includes("bargain")) {
          actionChips.push({ label: "⚖️ Fair-Price Calculator", action: "open_trust" });
        }
        if (lower.includes("sos") || lower.includes("emergency") || lower.includes("danger") || lower.includes("police") || lower.includes("safe")) {
          actionChips.push({ label: "🚨 Emergency SOS 112", action: "open_sos" });
        }
        if (lower.includes("train") || lower.includes("transit") || lower.includes("metro") || lower.includes("vande bharat")) {
          actionChips.push({ label: "🚆 Transit Hub", action: "open_transit" });
        }
        if (lower.includes("accessib") || lower.includes("wheelchair") || lower.includes("sahayak")) {
          actionChips.push({ label: "♿ Request On-Ground Sahayak", action: "open_accessibility" });
        }

        // Limit to top 3 action chips
        return res.json({
          reply: replyText,
          actionChips: actionChips.slice(0, 3),
          source: "gemini"
        });
      } else {
        // Inform client to fall back to the dynamic built-in knowledge synthesizer
        return res.json({
          useFallback: true,
          reason: "no_api_key"
        });
      }
    } catch (err: any) {
      console.warn("Gemini API call error (falling back to knowledge base):", err?.message || err);
      return res.json({
        useFallback: true,
        reason: err?.message || "gemini_error"
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sahayak Travel Assistant server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
