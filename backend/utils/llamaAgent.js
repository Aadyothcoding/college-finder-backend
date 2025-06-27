// backend/utils/llamaAgent.js

import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { loadQSUniversities } from "./loadQSdata.js";
import dotenv from "dotenv";
dotenv.config();

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-8b-8192"
});

const prompt = PromptTemplate.fromTemplate(`
You are a university counselor AI.

Your task is to select the best matching universities for the student **FROM THE GIVEN LIST ONLY**.

Only use the "Universities" list below — DO NOT invent or include universities not in the list.

Estimate tuition fees and fill missing data if needed (based on country, rank, type).

Respond ONLY in raw JSON format like below (don't include markdown):

{{ "matches": [ {{ "university": "Name", "country": "Country", "rank": 1, "tuition": 12345, "type": "Public", "environment": "Urban", "logo": "URL", "reason": "Why matched" }} ] }}

Student:
Field: {field}
Degree Level: {degreeLevel}
Budget: {budget}
Intake: {intake}
Environment: {environment}
University Type: {universityType}
Test Scores: {testScores}
Preferences: {preferences}

Universities:
{universities}
`);


export const findMatchingUniversities = async (userInput) => {
  const universities = await loadQSUniversities();

  const topUnis = universities
    .filter((u) => userInput.preferredCountries.includes(u.country))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, userInput.limit || 10);

  const chain = RunnableSequence.from([
    async () => ({
      ...userInput,
      testScores: JSON.stringify(userInput.testScores),
      preferences: userInput.preferences.join(", "),
      universities: JSON.stringify(topUnis)
    }),
    prompt,
    model
  ]);

  console.log("🤖 LLM Match using LangChain + Groq started");

  const response = await chain.invoke();

  const cleaned = response.content.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON Parse Error:", err.message);
    throw new Error("Failed to parse LLM response as JSON.");
  }

  const final = Array.isArray(parsed) ? parsed[0] : parsed;
  console.log("✅ LLM Output Parsed:", JSON.stringify(final, null, 2));
  return final;
};
