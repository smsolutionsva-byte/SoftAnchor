import type { Task, MicroStep, StepStatus, BreakdownResponse } from "@/types";

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `~${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}

export function buildTaskFromResponse(
  input: string,
  response: BreakdownResponse
): Task {
  return {
    id: generateId(),
    originalInput: input,
    title: response.title,
    steps: response.steps.map((s) => ({
      id: generateId(),
      text: s.text,
      status: "pending" as StepStatus,
      isTiny: false,
      tinyVersion: s.tinyVersion?.map((tv) => ({
        id: generateId(),
        text: tv,
        status: "pending" as StepStatus,
        isTiny: true,
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
    })),
    status: "pending",
    emotionalWeight: response.emotionalWeight,
    estimatedMinutes: response.estimatedMinutes,
    isExpanded: true,
    createdAt: new Date().toISOString(),
    completedAt: null,
    encouragement: response.encouragement,
  };
}

export function allStepsDone(task: Task): boolean {
  return task.steps.every((s) => s.status === "done");
}

export function countCompletedSteps(task: Task): number {
  return task.steps.filter((s) => s.status === "done").length;
}

export function buildTinySteps(texts: string[]): MicroStep[] {
  return texts.map((text) => ({
    id: generateId(),
    text,
    status: "pending" as StepStatus,
    isTiny: true,
    createdAt: new Date().toISOString(),
  }));
}
