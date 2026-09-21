import { redirect } from "next/navigation";
import { adminSession } from "@/lib/cms/server";
import { databasePublishing } from "@/lib/cms/public";
import AdminFrame from "@/components/admin/AdminFrame";
import PostEditor from "@/components/admin/PostEditor";
export default async function NewArticle() {
  const auth = await adminSession();
  if (!auth) redirect("/admin/login");
  return (
    <AdminFrame
      email={auth.user.email || "Administrator"}
      live={databasePublishing()}
    >
      <PostEditor />
    </AdminFrame>
  );
}
