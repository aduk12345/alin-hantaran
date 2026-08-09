"use client";

import Link from "next/link";

const iconButtonClass =
  "flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-blush/40 hover:text-rose";
const deleteIconButtonClass =
  "flex h-8 w-8 items-center justify-center rounded-lg text-ink/60 hover:bg-red-50 hover:text-red-600";

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487a1.5 1.5 0 0 1 2.122 2.122L8.25 17.343l-3.11.777.777-3.11L16.862 4.487Z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7h12M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2m-7 0 .6 12.2a2 2 0 0 0 2 1.8h4.8a2 2 0 0 0 2-1.8L17.5 7"
      />
    </svg>
  );
}

export function EditIconButton({
  href,
  onClick,
}: {
  href?: string;
  onClick?: () => void;
}) {
  if (href) {
    return (
      <Link href={href} title="Edit" aria-label="Edit" className={iconButtonClass}>
        <EditIcon />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} title="Edit" aria-label="Edit" className={iconButtonClass}>
      <EditIcon />
    </button>
  );
}

export function DeleteIconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Hapus"
      aria-label="Hapus"
      className={deleteIconButtonClass}
    >
      <TrashIcon />
    </button>
  );
}
