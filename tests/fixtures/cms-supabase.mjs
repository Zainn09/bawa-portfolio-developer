// Isolated in-memory HTTP double for application tests. NOT Supabase, NOT an RLS test.
// No production code imports this file; it uses an intentionally invalid project key.
import http from "node:http";
import { randomUUID } from "node:crypto";
const admin = "00000000-0000-4000-8000-000000000001",
  reader = "00000000-0000-4000-8000-000000000002";
let posts = [];
const user = (id) => ({
  id,
  aud: "authenticated",
  role: "authenticated",
  email: id === admin ? "admin@example.test" : "reader@example.test",
  email_confirmed_at: new Date().toISOString(),
  app_metadata: { provider: "email" },
  user_metadata: {},
  identities: [],
  created_at: new Date().toISOString(),
});
const token = (id) =>
  [
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
      "base64url",
    ),
    Buffer.from(
      JSON.stringify({
        sub: id,
        exp: Math.floor(Date.now() / 1000) + 3600,
        aud: "authenticated",
        role: "authenticated",
      }),
    ).toString("base64url"),
    "not-a-real-signature",
  ].join(".");
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1:4010");
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const raw = Buffer.concat(chunks);
    let body;
    try {
      body = JSON.parse(raw.toString());
    } catch {
      body = {};
    }
    let id;
    try {
      id = JSON.parse(
        Buffer.from(
          (req.headers.authorization || "").split(".")[1],
          "base64url",
        ).toString(),
      ).sub;
    } catch {}
    const send = (data, status = 200) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };
    if (url.pathname === "/__reset") {
      posts = [];
      return send({ ok: true });
    }
    if (url.pathname === "/auth/v1/token") {
      if (body.password !== "fixture-password")
        return send({ message: "Invalid login credentials" }, 400);
      id = body.email === "admin@example.test" ? admin : reader;
      return send({
        access_token: token(id),
        refresh_token: "test-refresh",
        token_type: "bearer",
        expires_in: 3600,
        user: user(id),
      });
    }
    if (url.pathname === "/auth/v1/user")
      return id ? send(user(id)) : send({ message: "Not authenticated" }, 401);
    if (url.pathname === "/auth/v1/logout") return send({});
    if (url.pathname === "/rest/v1/blog_admins")
      return send(id === admin ? [{ user_id: admin }] : []);
    if (url.pathname === "/rest/v1/blog_posts") {
      let rows = posts.filter((p) => id === admin || p.status === "published");
      for (const [key, v] of url.searchParams) {
        if (v.startsWith("eq."))
          rows = rows.filter((p) => String(p[key]) === v.slice(3));
        if (v.startsWith("lte."))
          rows = rows.filter(
            (p) => Date.parse(p[key]) <= Date.parse(v.slice(4)),
          );
      }
      const result = (data) =>
        send(
          req.headers.accept?.includes("vnd.pgrst.object")
            ? (data[0] ?? null)
            : data,
        );
      if (req.method === "GET") return result(rows);
      if (id !== admin) return send({ message: "Forbidden" }, 403);
      if (req.method === "POST") {
        const added = [];
        for (const item of Array.isArray(body) ? body : [body]) {
          if (posts.some((p) => p.slug === item.slug)) {
            if (req.headers.prefer?.includes("ignore-duplicates")) continue;
            return send({ code: "23505" }, 409);
          }
          const now = new Date().toISOString();
          const p = {
            ...item,
            id: randomUUID(),
            url_locked: item.status === "published",
            created_at: now,
            updated_at: now,
          };
          posts.push(p);
          added.push(p);
        }
        return result(added);
      }
      if (req.method === "PATCH") {
        for (const p of rows) {
          if (p.url_locked && p.slug !== body.slug)
            return send({ code: "P0001" }, 400);
          Object.assign(p, body, {
            url_locked: p.url_locked || body.status === "published",
            updated_at: new Date().toISOString(),
          });
        }
        return result(rows);
      }
    }
    if (url.pathname.startsWith("/storage/v1/object/"))
      return id === admin
        ? send({ Key: url.pathname.split("/object/")[1] })
        : send({}, 403);
    send({ error: "Unknown fixture endpoint", path: url.pathname }, 404);
  })
  .listen(4010, "127.0.0.1", () =>
    console.log("CMS HTTP test double ready on 4010"),
  );
