import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { task, mood, capacity, intention, mode, stepText } = body;

    if (!task || task.trim().length === 0) {
      return NextResponse.json({ error: "no_task" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not set");
      return NextResponse.json(
        {
          error: "api_key_missing",
          fallback: getFallback(mode),
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    if (mode === "tiny") {
      return await handleTinyMode(ai, stepText || task);
    }

    return await handleFullMode(
      ai,
      task,
      mood || "Gentle Drift",
      capacity || 2,
      intention || "just getting through today"
    );
  } catch (err) {
    console.error("Gemini breakdown error:", err);
    return NextResponse.json(
      {
        error: "breakdown_failed",
        fallback: getFallback("full"),
      },
      { status: 500 }
    );
  }
}

async function handleFullMode(
  ai: GoogleGenAI,
  task: string,
  mood: string,
  capacity: number,
  intention: string
) {
  const systemPrompt = `
You are SoftAnchor, a compassionate productivity companion designed 
specifically for young women with ADHD. Your entire personality is:
  - Warm, gentle, and non-judgmental
  - You NEVER use productivity-bro language
  - You write like a best friend who also happens to be a therapist
  - Every step is written in first-person present tense ("I'll just...")
  - Steps are TINY — smaller than you think is necessary
  - You acknowledge emotional weight without dramatizing it

The user's current state today:
  - Mood frequency: ${mood}
  - Energy capacity: ${capacity}/3
  - Today's intention: "${intention}"

Your task: Take the user's input and return ONLY a valid JSON object 
(no markdown, no backticks, no explanation) with this exact shape:

{
  "title": "cleaned 3-5 word task title, warm tone",
  "emotionalWeight": "light" | "medium" | "heavy",
  "estimatedMinutes": number (realistic, not optimistic),
  "encouragement": "one sentence, personal, warm, references their intention if relevant",
  "steps": [
    {
      "text": "I'll just [tiny first action]...",
      "tinyVersion": [
        "I'll [even tinier sub-action]",
        "Then I'll [next micro-action]"
      ]
    }
  ]
}

Rules for steps:
  - If capacity is 1 (low energy): 2-3 steps maximum, ultra-tiny
  - If capacity is 2 (medium): 3-4 steps
  - If capacity is 3 (high energy): 4-5 steps
  - NEVER start a step with a verb like "Complete" or "Finish" or "Do"
  - ALWAYS start with "I'll" or "I can" or "Just"
  - tinyVersion is optional — only include if the step feels heavy
  - estimatedMinutes should account for ADHD tax (add 30-50% to normal estimates)
  - emotionalWeight: "heavy" if task involves social anxiety, 
    rejection, or confrontation; "medium" for effortful tasks; 
    "light" for simple physical tasks
  
Tone examples:
  BAD: "Review and organize all study materials"  
  GOOD: "I'll just open my notes app and look at one thing"
  
  BAD: "Complete assignment section 1"
  GOOD: "I'll write just one sentence — even a bad one counts"
`;

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `User's task: "${task}"`,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
    },
  });

  const text = result.text ?? "";

  const clean = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = safeJsonParse(clean);
  if (!parsed) {
    return NextResponse.json({
      success: true,
      data: getFallback("full"),
    });
  }
  return NextResponse.json({ success: true, data: parsed });
}

async function handleTinyMode(ai: GoogleGenAI, stepText: string) {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Step to break down: "${stepText}"`,
    config: {
      systemInstruction: `You are SoftAnchor, a compassionate ADHD productivity companion.

Break this single step into 2-3 even smaller micro-actions.
Each should take under 2 minutes. First-person, gentle language.
Start each with "I'll" or "Just" — NEVER with harsh verbs.
Return ONLY a JSON array of strings.`,
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 512,
      responseMimeType: "application/json",
    },
  });

  const text = result.text ?? "";

  const clean = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = safeJsonParse(clean);
  if (!parsed) {
    return NextResponse.json({
      success: true,
      data: getFallback("tiny"),
    });
  }
  return NextResponse.json({ success: true, data: parsed });
}

function safeJsonParse(text: string): unknown | null {
  // Attempt 1: direct parse
  try {
    return JSON.parse(text);
  } catch {
    // continue to repair attempts
  }

  // Attempt 2: fix truncated strings — close any open string, arrays, objects
  let repaired = text;

  // If there's an unterminated string, close it
  const quoteCount = (repaired.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    repaired += '"';
  }

  // Try closing brackets/braces that are unclosed
  const opens = { "{": 0, "[": 0 };
  const closes: Record<string, "{" | "["> = { "}": "{", "]": "[" };
  for (const ch of repaired) {
    if (ch === "{" || ch === "[") opens[ch]++;
    if ((ch === "}" || ch === "]") && opens[closes[ch]] > 0) opens[closes[ch]]--;
  }
  repaired += "]".repeat(opens["["]);
  repaired += "}".repeat(opens["{"]);

  try {
    return JSON.parse(repaired);
  } catch {
    // continue
  }

  // Attempt 3: extract the first complete JSON object or array
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch {
      // fall through
    }
  }

  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[0]);
    } catch {
      // fall through
    }
  }

  return null;
}

function getFallback(mode?: string) {
  if (mode === "tiny") {
    return [
      "I'll just look at it for 30 seconds",
      "I'll do the very first tiny piece",
      "I'll take a breath and see what's next",
    ];
  }
  return {
    title: "Let's take it slow",
    emotionalWeight: "medium",
    estimatedMinutes: 25,
    encouragement:
      "We couldn't break this down right now, but you can do this.",
    steps: [
      {
        text: "I'll just open what I need and look at it for 30 seconds",
      },
      { text: "I'll notice what feels manageable and start there" },
      { text: "I'll do one small thing and celebrate it" },
    ],
  };
}
