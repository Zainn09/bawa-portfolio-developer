# Contact form delivery

## Where a submission goes today

The form in `src/components/Contact.tsx` posts JSON to the same site's `/api/contact` route. That server route validates the request and sends it to the HTTPS endpoint in **`CONTACT_WEBHOOK_URL`**. If configured, `CONTACT_WEBHOOK_TOKEN` supplies a server-side Bearer token for that endpoint.

There is **no database adapter and no built-in email sender** in this repository. The webhook's receiver decides whether to send an email, save a record, or both. Changing `profile.email` does not change form delivery.

In the workspace checked on 22 September 2026, `CONTACT_WEBHOOK_URL` and `CONTACT_WEBHOOK_TOKEN` were not configured. Valid submissions therefore receive an honest **503 “contact delivery is not connected yet”** response. They are not queued or saved for later. The typed fields remain on the current page after failure, but are not a durable backup across reloads. The separate production hosting environment has not been inspected.

## Connect delivery without a database

1. Choose a trusted HTTPS receiver that accepts JSON POST requests and handles email, CRM delivery, or storage.
2. Set `CONTACT_WEBHOOK_URL` privately in the hosting environment. Set `CONTACT_WEBHOOK_TOKEN` if the receiver requires authentication. On Vercel, these belong in the project's Environment Variables settings, scoped to the appropriate deployment environment.
3. Redeploy/restart after setting the variables. Never prefix these server secrets with `NEXT_PUBLIC_`.
4. Configure the receiver to return a successful 2xx status only after accepting the enquiry for delivery/storage. It must respond within the route's ten-second timeout and must not redirect.
5. Test end-to-end and confirm the actual email or saved record, rather than relying only on the browser's success message.

The outgoing payload contains the validated enquiry fields plus `source: "portfolio"` and an ISO `submittedAt`. The honeypot and timing fields are excluded. The route does not log enquiry bodies. A failed upstream request returns 502 without clearing the form.

## If database storage is preferred

First identify the provider (for example PostgreSQL/Supabase or MongoDB) and whether email notifications are also wanted. A database connection string alone will not activate storage: a provider adapter, schema, and server-side write flow still need to be implemented.

Add any database credential through private deployment environment variables **after** that integration is agreed. Do not paste connection strings, passwords, or tokens into chat, public source files, or documentation. Use least-privilege server credentials; enquiry records should not be publicly readable. Decide on retention and deletion rules for names, email addresses, and messages.

The form's existing validation, origin checking, honeypot, time check, and in-memory rate limit remain in place. The rate limit is per server instance, not a distributed production-wide limiter. Automated success-state tests use a simulated delivery response and do not demonstrate real email delivery.
