
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  color text
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  description text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  due_date timestamptz,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.tasks enable row level security;

grant select, insert, update, delete
  on table public.categories
  to anon, authenticated;

grant select, insert, update, delete
  on table public.tasks
  to anon, authenticated;

drop policy if exists "assessment categories read" on public.categories;
drop policy if exists "assessment categories insert" on public.categories;
drop policy if exists "assessment categories update" on public.categories;
drop policy if exists "assessment categories delete" on public.categories;
drop policy if exists "assessment tasks read" on public.tasks;
drop policy if exists "assessment tasks insert" on public.tasks;
drop policy if exists "assessment tasks update" on public.tasks;
drop policy if exists "assessment tasks delete" on public.tasks;

create policy "assessment categories read"
  on public.categories
  for select
  using (true);

create policy "assessment categories insert"
  on public.categories
  for insert
  with check (true);

create policy "assessment categories update"
  on public.categories
  for update
  using (true)
  with check (true);

create policy "assessment categories delete"
  on public.categories
  for delete
  using (true);

create policy "assessment tasks read"
  on public.tasks
  for select
  using (true);

create policy "assessment tasks insert"
  on public.tasks
  for insert
  with check (true);

create policy "assessment tasks update"
  on public.tasks
  for update
  using (true)
  with check (true);

create policy "assessment tasks delete"
  on public.tasks
  for delete
  using (true);


insert into public.categories (name, color)
values
  ('Work', '#7768E5'),
  ('Personal', '#E5A668'),
  ('Health', '#68B984')
on conflict (name) do nothing;


insert into public.tasks (
  title,
  description,
  category_id,
  due_date
)
select
  seed.title,
  seed.description,
  category.id,
  now() + seed.days_until_due * interval '1 day'
from (
  values
    ('Plan sprint', 'Prepare the next sprint backlog', 1, 'Work'),
    ('Review pull request', 'Review the open mobile PR', 2, 'Work'),
    ('Write release notes', 'Summarize this release', 3, 'Work'),
    ('Buy groceries', 'Milk, vegetables and rice', 1, 'Personal'),
    ('Call family', 'Weekly family call', 2, 'Personal'),
    ('Book appointment', 'Schedule the annual checkup', 4, 'Health'),
    ('Morning walk', 'Walk for thirty minutes', 1, 'Health'),
    ('Prepare lunch', 'Make lunch for tomorrow', 2, 'Personal')
) as seed(title, description, days_until_due, category_name)
join public.categories as category
  on category.name = seed.category_name
where not exists (
  select 1
  from public.tasks
);
