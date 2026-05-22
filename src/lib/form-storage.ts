// CostPilot — Form State Persistence (localStorage)
// SSR-safe: all calls wrapped in try/catch

import type { AuditInput } from "@/types";

const STORAGE_KEY = "costpilot-form-state";

export function saveFormState(state: AuditInput): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable or quota exceeded — silently ignore
  }
}

export function loadFormState(): AuditInput | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuditInput;
  } catch {
    return null;
  }
}

export function clearFormState(): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}
