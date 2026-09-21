# Journal administration

The recommended backend is **Supabase PostgreSQL + Auth + Storage**. It provides the article database, administrator identity, and image storage in one project. The application uses a publishable key with row-level security, not a privileged service-role key or a database connection string.

**Status:** the integration is implemented. No real Supabase project, credentials, or administrator identity were supplied during development. The SQL has not been applied to a live project and live authentication, RLS, persistence, and storage still require verification. The current portfolio remains file-backed until you explicitly enable database publishing.

## What to provide

1. A Supabase project owned by you.
2. Its project URL and **publishable** API key, configured privately in your deployment environment (and `.env.local` for local work).
3. The email address you want to authorize. Create its account securely in Supabase; do not send passwords, service-role keys, database passwords, or access tokens in chat.
4. Your actual public site origin for canonical URLs and the sitemap, if not already configured.

## One-time setup

1. Create a Supabase project. In **Authentication → Providers / Sign In**, enable email/password and **disable public sign-ups**. Set sensible Auth rate limits and deploy-level rate limiting for `/api/admin/session`; use a strong unique password. The app has no registration endpoint, but disabling provider sign-ups also closes Supabase's direct registration API.
2. Run `supabase/migrations/202609220001_blog_cms.sql` once in the project's privileged SQL editor. It creates `blog_posts`, `blog_admins`, RLS policies, an immutable published-URL rule, and the public `blog-media` storage bucket. The migration is transactional and intended for a fresh project; do not rerun blindly over existing tables/buckets.
3. In **Authentication → Users**, create your account with a strong password and confirm its email using the dashboard's supported account-creation workflow. Copy the user's **UUID**, not an email address. There is no custom invite/recovery callback page in this app; the project owner manages account creation and password resets through Supabase. Do not send invitation links to an unimplemented callback.
4. Grant that account membership using the privileged SQL editor, replacing the placeholder below with the actual UUID:

   ```sql
   insert into public.blog_admins (user_id)
   values ('REPLACE_WITH_AUTH_USER_UUID'::uuid)
   on conflict do nothing;
   ```

   Being signed in is not enough: membership is required. There is no browser-side promotion mechanism. To revoke access:

   ```sql
   delete from public.blog_admins
   where user_id = 'REPLACE_WITH_AUTH_USER_UUID'::uuid;
   ```

5. Configure your local/deployment environment:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=<your project HTTPS URL>
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
   BLOG_CONTENT_SOURCE=files
   NEXT_PUBLIC_SITE_URL=<your actual public HTTPS origin>
   ```

   Redeploy/rebuild after changing environment settings; the `NEXT_PUBLIC_` values are build-time client configuration too. The publishable key is intentionally public, while RLS authorizes every data operation. **Never put a service-role key into any `NEXT_PUBLIC_` variable.** `.env.local` is ignored by Git.
6. Open `/admin`, sign in, and choose **Import supplied articles**. It imports all 35 existing notes with their original slugs, fixed editorial dates, sources, and approved imagery. Repeating it skips existing slugs and never overwrites edits. Import before creating a new article with one of the supplied slugs.
7. Review the records and test a draft. While setup mode is active, dashboard saves change the database only; the public site continues to show the original files. Public “View article” links are not a database preview in this mode—use the editor's **Preview** button.
8. Set `BLOG_CONTENT_SOURCE=database`, redeploy, and perform the live checks below. The journal index, article routes, homepage previews, SEO metadata, related articles, and sitemap now read published database content. Newly published URLs need no rebuild. Drafts and archived records are absent from all public queries, including for a signed-in administrator.

**Important:** once database publishing is enabled, empty results or database failures never fall back to the old files. That would accidentally republish withdrawn content. A database outage shows an honest unavailable state. Switching back to `files` is an explicit rollback that exposes the original 35 articles again, regardless of subsequent draft/archive decisions; do not use it as an automatic fallback.

## Writing workflow

- **New article:** title, URL slug, excerpt, rich body, category, store/general editorial, tags, featured image, image alternative text/captions, editorial context and source links, SEO title/description, publication date, homepage feature flag, and draft/published/archived status.
- **Body formatting:** headings 2–4, bold, italic, underline, strike, bulleted/numbered lists, quotes, alignment, links, divider, undo/redo. Place the cursor between paragraphs, choose the image button, upload, and provide alt text. Images are inserted at the cursor, not restricted to a gallery at the end.
- **Preview** shows the current unsaved title, excerpt, cover, and body privately in the editor; it does not create a public draft link.
- **Save draft** retains a private database draft. To publish, choose **Published — public**, set an editorial date, and press **Publish article**. Published edits take effect when **Save changes** succeeds. There is no separate revision draft for an already published article.
- Publication dates use **Asia/Karachi** and round-trip without UTC date shifts. They are editorial dates, not capture dates and not a scheduling feature. Future publication dates are rejected by the application.
- Published URL slugs are permanently locked even after unpublishing/archiving; this protects existing links. Draft URLs remain editable until first publication.
- **Archived — hidden** removes a record from public views when saved. There is no permanent-delete control. Published-to-draft/archive transitions require confirmation.
- SEO fields fall back to the title/excerpt when blank. Public byline remains Ahmad Abdullah; signing in as another approved administrator does not invent a new public author.
- Save explicitly. There is **no autosave or revision history**. Unsaved edits warn on ordinary links, sign-out, and page unload. Save before browser history navigation, closing your browser, or leaving a mobile app; browsers do not guarantee unload prompts. Concurrent writes are rejected rather than silently overwriting another session—copy your pending text somewhere safe before reloading a conflict.
- Homepage shows up to three published notes, preferring the featured ones. Extra featured notes are not all shown at once.

## Images and privacy

Uploaded images are **public website assets even while their article is a draft**. Never upload private screenshots, customer data, credentials, or confidential files. Files are JPEG/PNG/WebP/AVIF still images, at most 4 MB and 24 megapixels. The server decodes and re-encodes to WebP, strips metadata, reserves dimensions, and limits output to 1600×2400 without enlargement. SVG and animated files are rejected. Public images load lazily apart from the featured hero. Supplied local images retain their available responsive variants.

Removing an image from an article does not delete its Storage object. Failed/abandoned uploads can leave unused objects; clean them manually in the Supabase dashboard only after checking published and draft references. Do not delete a file just because one article no longer uses it. Storage policy does not allow application users to overwrite or delete existing files.

## Security boundaries

- Each admin page and endpoint verifies the user with Supabase Auth and reads their administrator membership server-side. The session proxy refreshes HTTP-only, SameSite=Lax cookies (Secure in production).
- RLS grants public reads only for currently published records; authenticated administrators can insert/update. `blog_admins` is self-readable only and cannot be modified by normal authenticated users. Application code has no service-role bypass.
- Same-origin checks reject cross-origin state changes, including login/logout. The publishable key is not an administrator credential.
- Request-size, recursive document, field, image, and URL validation are enforced server-side. Article bodies are structured JSON rendered through safe React elements, not arbitrary HTML.
- Optimistic `updated_at` checks prevent lost updates. Database triggers also lock previously published slugs.
- Admin pages are noindex, excluded from the sitemap and Vercel Analytics/Speed Insights. This is privacy hygiene, **not** the authorization mechanism.
- Protect your Supabase project owner account and deployment settings. Account recovery is owner-managed. There is no application MFA challenge, team-invite flow, audit log, or revision history in this version. Configure additional infrastructure abuse controls as appropriate before opening production access.

## Verify against your real project before relying on it

1. Sign in as the designated admin; verify a different authenticated account is denied. In a logged-out browser, `/admin/posts/new` must redirect and `/api/admin/posts` must deny access.
2. Using Supabase's publishable/anonymous client directly, confirm drafts/archives are unreadable, anonymous writes fail, a normal user cannot insert/update articles or add `blog_admins` membership, and only admins can upload to their UUID folder. These checks verify **real RLS**, not just the Next UI.
3. Save a draft containing formatted paragraphs and a real uploaded inline image. Reload and verify database persistence, alt text, caption, image order, and dimensions. Verify the draft URL is 404.
4. Publish, confirm the article/card/metadata/sitemap in a logged-out browser, then archive and confirm it disappears everywhere. Test a published URL rename is rejected and concurrent stale saves produce a conflict.
5. Verify imported count 35 and seven records per supplied store, dates, sources, desktop/mobile captures, and the honest Vintage planning notes. Import again and confirm zero overwrites.
6. Check logout, session expiry/refresh, owner-managed password reset, image failures, storage quotas, and deployment limits. Set up database backups and a separate Storage backup process; database backups alone do not back up object files.
7. Contact form delivery remains a separate webhook integration. Supabase setup does **not** enable contact storage or email delivery. See `CONTACT-DELIVERY.md`.

## Automated checks and current limits

```sh
npm run typecheck
npm run build
npx playwright test tests/cms-model.spec.ts tests/cms-access.spec.ts
npm run test:cms
```

`test:cms` runs the actual Next editor/API against a disposable, local **in-memory HTTP double**, plus an intercepted inline-upload response. It covers application authorization, editing/formatting, inline-image placement, preview, saves/reopening, publish/archive visibility, import retries, concurrency handling, accessible controls, and layouts from 320 to 2560px. The fixture is never imported by production code and no demo credentials work against the deployed app. These tests do **not** prove Supabase Auth correctness, RLS enforcement, Storage persistence, or deployed delivery. The real-project checks above remain outstanding until configuration is supplied.

This version is intended for a small personal journal. Administrative/public collections currently read up to 500 records; add server-side pagination before growing beyond that. There is no scheduling, permanent deletion, media-library browser, image cropping, raw HTML mode, or autosave. The original JSON files remain version-controlled as the baseline, not a second live editor after database cutover.

### Recorded development verification — 22 September 2026

- Production `npm run build`: passed; TypeScript checks passed.
- `npm test`: **121/121 passed** against the production build, including public blog/homepage regressions, typography, accessibility, responsive layouts, unconfigured admin protection, and model/import validation.
- `npm run test:cms`: **5/5 passed** against the isolated HTTP double. Includes real server-side image decoding/optimization with mocked object storage and an intercepted insertion response, not live Supabase upload verification.
- Editor tested at 320, 375, 390, 414, 768, 820, 1024, 1280, 1440, 1920, and 2560 pixels. Automated accessibility checks passed for the editor and image dialog; desktop/mobile captures were visually inspected.
- **Not verified:** actual Supabase project migration/RLS/Auth/Storage, deployment environment, real account recovery, physical devices, or field performance. No credentials were supplied and no live database was changed.
