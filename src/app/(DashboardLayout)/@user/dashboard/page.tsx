import { redirect } from "next/navigation";

// This parallel route is deprecated.
// The app uses a single unified dashboard under /dashboard.
export default function UserDashboardDeprecated() {
  redirect("/dashboard");
}
