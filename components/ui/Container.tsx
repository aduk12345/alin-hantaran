import { ReactNode } from "react";

export function Container({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`mx-auto w-full min-w-0 max-w-3xl px-5 ${className}`}>
      {children}
    </div>
  );
}
