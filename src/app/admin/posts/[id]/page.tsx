import { redirect, notFound } from "next/navigation";
import { adminSession } from "@/lib/cms/server";
import { databasePublishing } from "@/lib/cms/public";
import type { PostRow } from "@/lib/cms/model";
import AdminFrame from "@/components/admin/AdminFrame";
import PostEditor from "@/components/admin/PostEditor";
export default async function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await adminSession();
  if (!auth) redirect("/admin/login");
  const { id } = await params;
  if (!/^[\da-f-]{36}$/i.test(id)) notFound();
  const { data, error } = await auth.db
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("The article could not be loaded.");
  if (!data) notFound();
  return (
    <AdminFrame
      email={auth.user.email || "Administrator"}
      live={databasePublishing()}
    >
      <PostEditor initial={data as PostRow} />
    </AdminFrame>
  );
}
