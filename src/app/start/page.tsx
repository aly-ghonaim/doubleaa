import { redirect } from "next/navigation";

// The form lives at /contact now; keep old /start links working.
export default function StartPage() {
  redirect("/contact");
}
