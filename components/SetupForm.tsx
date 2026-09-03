"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AMOUNTS, CATEGORIES, DEFAULTS, DIFFICULTIES } from "@/constants";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import type { GameSettings } from "@/types";

// Shared by the amount and difficulty toggle rows.
const toggleClass =
  "flex-1 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 focus-visible:ring-offset-2";
const toggleOn = "bg-brand text-gray-900";
const toggleOff = "bg-surface text-gray-700 hover:bg-surface-hover";

// Options carry focus themselves (roving tabindex). An element with
// role="option" must not contain a focusable child, so no buttons in here.
const OPTION = 'li[role="option"]';

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
      'li[aria-selected="true"]',
    );
    const first = listRef.current.querySelector<HTMLElement>(OPTION);
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

  function choose(id: string) {
    onChange(id);
    closeAndReturn();
  }

  function handleListKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>(OPTION) ?? [],
    );
    const idx = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const id = items[idx]?.dataset.id;
      if (id !== undefined) choose(id);
    } else if (e.key === "Escape") {
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
        className="w-full flex items-center justify-between bg-white text-gray-800 border border-field-line rounded-lg px-3 py-2.5 text-base cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800"
      >
        <span>{selected.name}</span>
        <svg
          aria-hidden="true"
          focusable="false"
          className={cn(
            "w-4 h-4 text-accent shrink-0 transition-transform",
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
          className="absolute z-10 mt-1 w-full bg-white border border-field-line rounded-lg shadow-lg overflow-y-auto max-h-56"
        >
          {CATEGORIES.map((c) => (
            <li
              key={c.id}
              role="option"
              aria-selected={c.id === value}
              tabIndex={-1}
              data-id={c.id}
              onClick={() => choose(c.id)}
              className={cn(
                "px-3 py-2.5 text-sm transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-inset focus:ring-gray-800",
                c.id === value
                  ? "bg-brand text-gray-900 font-medium"
                  : "text-gray-800 hover:bg-surface",
              )}
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SetupForm() {
  const router = useRouter();
  const [settings, setSettings] = useState<GameSettings>(DEFAULTS);

  function set<K extends keyof GameSettings>(key: K, value: GameSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  // Omitted params mean "any", which is what the empty option selects.
  function start() {
    const params = new URLSearchParams({ amount: String(settings.amount) });
    if (settings.category) params.set("category", settings.category);
    if (settings.difficulty) params.set("difficulty", settings.difficulty);
    router.push(`/play?${params}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start();
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
                toggleClass,
                settings.amount === n ? toggleOn : toggleOff,
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
                toggleClass,
                settings.difficulty === d.value ? toggleOn : toggleOff,
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Button type="submit" className="mt-1 w-full py-3 text-base">
        Start
      </Button>
    </form>
  );
}
