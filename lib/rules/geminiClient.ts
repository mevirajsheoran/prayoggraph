/**
 * geminiClient.ts
 *
 * OPTIONAL enhancement layer. The system works perfectly without it.
 *
 * If Gemini is configured (via NEXT_PUBLIC_GEMINI_API_KEY) and responds
 * within 2 seconds, it returns a personalized explanation. Otherwise
 * it returns null and the rule engine silently falls back to NCERT_MAP.
 *
 * The 2-second timeout is critical: the student must NEVER wait on a
 * loading spinner. Determinism beats cleverness.
 */

import type { CircuitInput, SimulationResult } from "../types";
import type { NCERTExplanation } from "./ncertMap";

const TIMEOUT_MS = 2000;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export async function enhanceExplanationWithGemini(
  baseExplanation: NCERTExplanation,
  circuitInput: CircuitInput,
  result: SimulationResult
): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) return null;

  const nodeCount = circuitInput.nodes.length;
  const edgeCount = circuitInput.edges.length;
  const componentSummary = circuitInput.nodes
    .map((n) => n.data.kind)
    .join(", ");

  const prompt = `You are a friendly Class 10 physics teacher in India. A student just ran a circuit simulation and got this result:

RESULT: ${result}
COMPONENTS USED: ${componentSummary} (${nodeCount} total)
CONNECTIONS: ${edgeCount} wires

The official NCERT explanation is:
"${baseExplanation.explanation}"

Rewrite this in 2 short, encouraging sentences suitable for a 15-year-old Indian student. Use simple English, mention the result clearly, and end with one practical real-life example (e.g. "This is exactly why your house has a switch on the wall"). Do not use jargon. Do not exceed 60 words.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 120,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data: GeminiResponse = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || text.trim().length < 10) return null;

    return text.trim();
  } catch (err) {
    // Network error, timeout, or anything else — silent fallback
    return null;
  }
}