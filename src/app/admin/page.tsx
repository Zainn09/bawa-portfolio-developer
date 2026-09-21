import { redirect } from "next/navigation";
import { adminSession } from "@/lib/cms/server";
import { databasePublishing } from "@/lib/cms/public";
import AdminFrame from "@/components/admin/AdminFrame";
import PostList from "@/components/admin/PostList";
export default async function Dashboard() {
  const auth = await adminSession();
  if (!auth) redirect("/admin/login");
  const { data, error } = await auth.db
    .from("blog_posts")
    .select("id,title,slug,status,category,updated_at,featured")
    .order("updated_at", { ascending: false })
    .limit(500);
  return (
    <AdminFrame
      email={auth.user.email || "Administrator"}
      live={databasePublishing()}
    >
      <PostList
        posts={data || []}
        loadError={
          error
            ? "Could not load articles. Check that the database migration has been applied."
            : undefined
        }
      />
    </AdminFrame>
  );
}
