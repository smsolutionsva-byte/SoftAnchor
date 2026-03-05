import type { BreakdownResponse } from "@/types";

export interface BreakdownRequest {
  task: string;
  mood: string;
  capacity: number;
  frequency: string;
  intention: string;
  mode?: "full" | "tiny";
  stepText?: string;
}

export async function breakdownTask(
  req: BreakdownRequest
): Promise<BreakdownResponse> {
  const res = await fetch("/api/breakdown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.fallback) return data.fallback;
    throw new Error(data.error ?? "unknown_error");
  }

  return data.data;
}

export async function makeStepTinier(
  stepText: string,
  mood: string,
  capacity: number
): Promise<string[]> {
  const res = await fetch("/api/breakdown", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      task: stepText,
      mood,
      capacity,
      frequency: "",
      intention: "",
      mode: "tiny",
      stepText,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.fallback) return data.fallback;
    return [
      "I'll just look at it for 30 seconds",
      "I'll do the very first tiny piece",
      "I'll take a breath and see what's next",
    ];
  }

  return data.data;
}
