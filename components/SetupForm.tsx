"use client";
import { useEffect, useRef, useState } from "react";
import { AMOUNTS, CATEGORIES, DEFAULTS, DIFFICULTIES } from "@/constants";
import { cn } from "@/lib/utils";
import type { GameSettings } from "@/types";

interface SetupFormProps {
  onStart: (settings: GameSettings) => void;
}

function CategoryDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const selected = listRef.current.querySelector<HTMLElement>(
      '[aria-selected="true"] button',
    );
    const first = listRef.current.querySelector<HTMLElement>("li button");
    (selected ?? first)?.focus();
  }, [open]);

  const selected = CATEGORIES.find((c) => c.id === value) ?? CATEGORIES[0];

  function closeAndReturn() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape") setOpen(false);
  }

  function handleListKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("li button") ?? [],
    );
    const idx = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "Escape") {
      e.preventDefault();
      closeAndReturn();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[Math.min(idx + 1, items.length - 1)]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx <= 0) closeAndReturn();
      else items[idx - 1]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <div ref={ref} className="relative w-full">
      <button
        ref={triggerRef}
        id="category"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="category-listbox"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
        className="w-full flex items-center justify-between bg-white text-gray-800 border border-[#E8DDD0] rounded-lg px-3 py-2.5 text-base cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800"
      >
        <span>{selected.name}</span>
        <svg
          aria-hidden="true"
          focusable="false"
          className={cn(
            "w-4 h-4 text-[#B84040] shrink-0 transition-transform",
            open && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 8 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id="category-listbox"
          role="listbox"
          aria-label="Category"
          onKeyDown={handleListKeyDown}
          className="absolute z-10 mt-1 w-full bg-white border border-[#E8DDD0] rounded-lg shadow-lg overflow-y-auto max-h-56"
        >
          {CATEGORIES.map((c) => (
            <li key={c.id} role="option" aria-selected={c.id === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(c.id);
                  closeAndReturn();
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:bg-[#EDE4D8]",
                  c.id === value
                    ? "bg-[#FF6B6B] text-gray-900 font-medium"
                    : "text-gray-800 hover:bg-[#F5EEE6]",
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SetupForm({ onStart }: SetupFormProps) {
  const [settings, setSettings] = useState<GameSettings>(DEFAULTS);

  function set<K extends keyof GameSettings>(key: K, value: GameSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onStart(settings);
      }}
      className="flex flex-col gap-5 w-full"
    >
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-gray-700">
          Number of Questions
        </legend>
        <div className="flex gap-2 mt-2">
          {AMOUNTS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={settings.amount === n}
              onClick={() => set("amount", n)}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2",
                settings.amount === n
                  ? "bg-[#FF6B6B] text-gray-900"
                  : "bg-[#F5EEE6] text-gray-700 hover:bg-[#EDE4D8]",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="category" className="text-sm font-medium text-gray-700">
          Category
        </label>
        <CategoryDropdown
          value={settings.category}
          onChange={(v) => set("category", v)}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-gray-700">
          Difficulty
        </legend>
        <div className="flex gap-2 mt-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              type="button"
              aria-pressed={settings.difficulty === d.value}
              onClick={() => set("difficulty", d.value)}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2",
                settings.difficulty === d.value
                  ? "bg-[#FF6B6B] text-gray-900"
                  : "bg-[#F5EEE6] text-gray-700 hover:bg-[#EDE4D8]",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="mt-1 w-full py-3 rounded-xl bg-[#FF6B6B] hover:bg-[#e85555] text-gray-900 font-semibold text-base transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2"
      >
        Start
      </button>
    </form>
  );
}
