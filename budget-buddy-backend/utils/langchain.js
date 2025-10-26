import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0,
  maxRetries: 2,
});

export function buildParsingPrompt(question) {
  return `
You are a strict JSON extractor for a personal finance app. Convert the user's question into STRICT JSON (no explanation, no commentary).
Allowed keys:
- "collection": must be "expenses" or "incomes"
- "operation": one of "sum", "count", "average", "list"
- "field": numeric field name (default "amount")
- "category": optional string category filter (or null)
- "startDate": ISO date string (YYYY-MM-DD) or null
- "endDate": ISO date string (YYYY-MM-DD) or null

Make the dates exact when possible (e.g., "last month" => first and last day of that month).
If you cannot determine a precise date range, set startDate and endDate to null.
If a filter is not present, return null for that key.

Return JSON only.

Examples:
User: "How much did I spend last month on groceries?"
=> {"collection":"expenses","operation":"sum","field":"amount","category":"groceries","startDate":"2025-09-01","endDate":"2025-09-30"}

User: "List my last 10 incomes"
=> {"collection":"incomes","operation":"list","field":"amount","category":null,"startDate":null,"endDate":null}

User: "${question}"
`;
}

export async function parseQuestionWithLLM(question) {
  const prompt = buildParsingPrompt(question);

  const res = await llm.invoke(prompt);

  let text = null;

  if (!text && typeof res === "string") text = res;
  if (!text && res?.content) text = res.content;
  if (!text && res?.output)
    text = Array.isArray(res.output) ? res.output.join("\n") : res.output;
  if (!text && res?.response?.content) text = res.response.content;
  if (!text && res?.generations) {
    try {
      const g = res.generations;
      if (Array.isArray(g) && g.length > 0 && Array.isArray(g[0]) && g[0][0]) {
        text = g[0][0].text ?? g[0][0].message?.content ?? null;
      }
    } catch (e) {}
  }
  if (!text && res?.message?.content) text = res.message.content;
  if (!text && res?.choices && res.choices[0])
    text = res.choices[0].text ?? res.choices[0].message?.content;

  if (!text) text = JSON.stringify(res);

  text = String(text).trim();

  return text;
}
