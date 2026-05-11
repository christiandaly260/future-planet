import { redirect } from "next/navigation";

// Root URL: send authenticated users to the dashboard. The middleware
// will bounce unauthenticated users to /sign-in before they get here.
export default function Home() {
  redirect("/dashboard");
}
