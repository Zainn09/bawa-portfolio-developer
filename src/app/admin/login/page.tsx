import { redirect } from "next/navigation";
import { cmsConfigured } from "@/lib/cms/config";
import { adminSession } from "@/lib/cms/server";
import Login from "@/components/admin/Login";
export default async function LoginPage() {
  if (cmsConfigured() && (await adminSession())) redirect("/admin");
  return <Login configured={cmsConfigured()} />;
}
