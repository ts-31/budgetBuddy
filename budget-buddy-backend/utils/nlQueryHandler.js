import mongoose from "mongoose";
import {
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  subDays,
} from "date-fns";
import Expense from "../models/expenseModel.js";
import Income from "../models/incomeModel.js";
import { parseQuestionWithLLM } from "./langchain.js";

function getCollectionModel(name) {
  if (!name) throw new Error("No collection provided");
  name = name.toLowerCase();
  if (name === "expenses" || name === "expense") return Expense;
  if (name === "incomes" || name === "income") return Income;
  throw new Error("Unknown collection: " + name);
}

function validateParsed(parsed) {
  const validCollections = ["expenses", "incomes", "expense", "income"];
  const validOps = ["sum", "count", "average", "list"];
  if (!parsed || typeof parsed !== "object")
    return { ok: false, reason: "not_object" };
  if (
    !parsed.collection ||
    !validCollections.includes(parsed.collection.toLowerCase())
  ) {
    return { ok: false, reason: "invalid_collection" };
  }
  if (!parsed.operation || !validOps.includes(parsed.operation.toLowerCase())) {
    return { ok: false, reason: "invalid_operation" };
  }
  if (!parsed.field) parsed.field = "amount";
  if (!parsed.category) parsed.category = null;
  return { ok: true, parsed };
}

function extractJson(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch (e) {
    return null;
  }
}

export async function handleNaturalQuery(userId, question) {
  if (!userId) {
    return { answer: "Missing userId. Please log in and try again." };
  }
  if (!mongoose.isValidObjectId(userId)) {
    return { answer: "Invalid userId. Please reauthenticate." };
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const llmText = await parseQuestionWithLLM(question);

  let parsed = null;
  try {
    parsed = JSON.parse(llmText);
  } catch (e) {
    parsed = extractJson(llmText);
  }

  if (!parsed) {
    return {
      answer: "Sorry, I couldn't understand your question. Please rephrase.",
    };
  }

  const validation = validateParsed(parsed);
  if (!validation.ok) {
    return {
      answer:
        "Couldn't parse a valid query (collection/operation). Please rephrase.",
    };
  }
  parsed = validation.parsed;

  let model;
  try {
    model = getCollectionModel(parsed.collection);
  } catch (err) {
    return { answer: "Unknown collection requested." };
  }

  const match = { user: userObjectId };

  if (parsed.category) {
    match.category = parsed.category;
  }

  if (parsed.startDate && parsed.endDate) {
    const s = new Date(parsed.startDate);
    const e = new Date(parsed.endDate);
    if (!isNaN(s) && !isNaN(e)) {
      match.date = { $gte: s, $lte: e };
    }
  }

  try {
    if (parsed.operation === "sum") {
      const pipeline = [
        { $match: match },
        { $group: { _id: null, total: { $sum: `$${parsed.field}` } } },
      ];
      const res = await model.aggregate(pipeline);
      const value = res[0]?.total ?? 0;
      return {
        answer: `Total ${parsed.collection} (${
          parsed.category ?? "all"
        }): ${value}`,
        rawParsed: parsed,
      };
    }

    if (parsed.operation === "count") {
      const count = await model.countDocuments(match);
      return { answer: `Count: ${count}`, rawParsed: parsed };
    }

    if (parsed.operation === "average") {
      const pipeline = [
        { $match: match },
        { $group: { _id: null, avg: { $avg: `$${parsed.field}` } } },
      ];
      const res = await model.aggregate(pipeline);
      const value = res[0]?.avg ?? 0;
      return { answer: `Average ${parsed.field}: ${value}`, rawParsed: parsed };
    }

    if (parsed.operation === "list") {
      const docs = await model.find(match).sort({ date: -1 }).limit(20);
      if (!docs || docs.length === 0)
        return { answer: "No items found.", rawParsed: parsed };
      const summary = docs
        .map(
          (d) =>
            `${d.title} (${d.amount}, ${new Date(d.date)
              .toISOString()
              .slice(0, 10)})`
        )
        .join(" • ");
      return {
        answer: `Found ${docs.length} items: ${summary}`,
        rawParsed: parsed,
      };
    }

    return { answer: "Operation not implemented.", rawParsed: parsed };
  } catch (err) {
    console.error("DB operation error:", err);
    return { answer: "Server error when executing the query." };
  }
}
