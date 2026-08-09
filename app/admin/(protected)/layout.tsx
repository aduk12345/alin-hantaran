import { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </>
  );
}
