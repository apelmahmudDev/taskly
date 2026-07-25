# Taskly

Expo SDK 54 task manager backed by Supabase, with Redux Toolkit/RTK Query and an AsyncStorage offline cache.

## Setup

1. Run `npm install`.
2. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor. It creates the tables, client policies, three categories, and eight sample tasks.
3. Copy `.env.example` to `.env` and enter the project URL and publishable (anon) key. Never use a service-role key in this client.
4. Run `npx expo start`.

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## Data model

`categories`: `id uuid` primary key, unique `name text`, optional `color text`.

`tasks`: `id uuid` primary key, `title text`, `description text`, nullable `category_id uuid`, nullable `due_date timestamptz`, `completed boolean`, `created_at timestamptz`, and `updated_at timestamptz`. The device-only `starred` value is deliberately absent.

Task and category cache data uses the versioned AsyncStorage key `taskly.cache.v1`. Cached content hydrates first; an online Supabase refresh then merges local starred values and replaces the cache only after success.
