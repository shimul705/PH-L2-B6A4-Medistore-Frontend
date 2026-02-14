import type { ReactNode } from "react";

// Legacy route group kept for backward compatibility.
// All profile pages live under /dashboard now.
export default function ProfileLegacyLayout({ children }: { children: ReactNode }) {
  return children;
}
