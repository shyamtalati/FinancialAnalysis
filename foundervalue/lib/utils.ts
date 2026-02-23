import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "$0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000)
    return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function clampNumber(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function roundToSignificantFigures(val: number, sig: number): number {
  if (val === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(val)));
  const power = sig - d;
  const magnitude = Math.pow(10, power);
  return Math.round(val * magnitude) / magnitude;
}

export function getStageColor(stage: string): string {
  const map: Record<string, string> = {
    "pre-seed": "#6366f1",
    seed: "#3E92CC",
    "series-a": "#0A2463",
    "series-b-c": "#16a34a",
    growth: "#d97706",
    "acquisition-ipo": "#dc2626",
  };
  return map[stage] ?? "#64748b";
}
