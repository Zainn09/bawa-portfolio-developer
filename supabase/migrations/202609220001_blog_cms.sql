-- Run once in the Supabase SQL editor. No credentials or administrator emails are stored here.
begin;
create table public.blog_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.blog_admins enable row level security;
create policy "Read your own administrator membership" on public.blog_admins for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.blog_admins from anon, authenticated;
grant select on public.blog_admins to authenticated;
create function public.is_blog_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.blog_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_blog_admin() from public;
grant execute on function public.is_blog_admin() to anon, authenticated;

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) <= 120 and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(title) between 1 and 160),
  excerpt text not null default '', category text not null default 'Editorial', project text not null default '',
  tags text[] not null default '{}',
  content jsonb not null default '{"type":"doc","content":[{"type":"paragraph"}]}',
  cover jsonb, url_locked boolean not null default false, status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz, seo_title text not null default '', seo_description text not null default '',
  featured boolean not null default false, source_notes text not null default '', sources jsonb not null default '[]',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (jsonb_typeof(content) = 'object' and content->>'type' = 'doc'),
  check (status <> 'published' or published_at is not null)
);
create index blog_posts_public_date on public.blog_posts (published_at desc) where status='published';
alter table public.blog_posts enable row level security;
create policy "Published articles are public" on public.blog_posts for select to anon, authenticated
  using ((status='published' and published_at<=now()) or (select public.is_blog_admin()));
create policy "Administrators create articles" on public.blog_posts for insert to authenticated with check ((select public.is_blog_admin()));
create policy "Administrators edit articles" on public.blog_posts for update to authenticated using ((select public.is_blog_admin())) with check ((select public.is_blog_admin()));
revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon,authenticated;
grant insert,update on public.blog_posts to authenticated;
revoke delete on public.blog_posts from anon,authenticated;
create function public.stamp_blog_post() returns trigger language plpgsql set search_path='' as $$
begin
  if TG_OP = 'UPDATE' then
    if old.url_locked and new.slug <> old.slug then
      raise exception 'Published article URLs are locked. Create a new article instead.';
    end if;
    new.url_locked = old.url_locked or new.status = 'published';
  else
    new.url_locked = new.status = 'published';
  end if;
  new.updated_at = clock_timestamp();
  return new;
end;
$$;
create trigger stamp_blog_post before insert or update on public.blog_posts for each row execute function public.stamp_blog_post();

-- Files are intentionally public website assets. Never upload confidential documents.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('blog-media','blog-media',true,4194304,array['image/webp']);
create policy "Administrators upload blog images" on storage.objects for insert to authenticated
  with check (bucket_id='blog-media' and (select public.is_blog_admin()) and (storage.foldername(name))[1]=(select auth.uid())::text);
-- Public bucket serves images without exposing administrative storage listings.
create policy "Administrators list blog images" on storage.objects for select to authenticated
  using (bucket_id='blog-media' and (select public.is_blog_admin()));
commit;
