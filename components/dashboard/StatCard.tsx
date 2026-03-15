"use client";
import { cn } from "@/lib/utils";

interface Props {
  label:          string;
  value:          string | number;
  sub?:           string;
  badgeClassName?: string;
  className?:     string;
}

export default function StatCard({ label, value, sub, badgeClassName, className }: Props) {
  return (
    <div className={cn("rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
      {badgeClassName ? (
        <span className={cn("mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold", badgeClassName)}>
          {value}
        </span>
      ) : (
        <p className="mt-3 text-4xl font-black text-zinc-100">{value}</p>
      )}
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}
