"use client";

import { ReactNode, useState } from "react";

export function Accordion({
  title,
  children,
  defaultOpen = false,
  highlight = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  highlight?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-2xl bg-white shadow-[0_1px_3px_rgba(38,32,25,0.06)] ${
        highlight ? "border-l-4 border-rose" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span
          className={`font-serif-title text-base sm:text-lg ${highlight ? "text-rose" : "text-ink"}`}
        >
          {title}
        </span>
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blush text-base text-gold transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && <div className="px-5 pb-5 text-sm leading-relaxed text-ink/70">{children}</div>}
    </div>
  );
}
