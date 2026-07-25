# Taskly

Taskly is an Expo SDK 54 task manager backed by Supabase. It uses React Navigation, Redux Toolkit, RTK Query, and a versioned AsyncStorage cache to provide backend-backed task management with offline reading.

## Setup

### Prerequisites

- Node.js 20.19 or newer
- npm
- A Supabase project
- Expo Go or an Android/iOS simulator

### Application setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`.

3. Add the Supabase project URL and publishable key:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   The client must not use a Supabase service-role key.

4. Complete the backend setup described below.

5. Start Expo:

   ```bash
   npx expo start
   ```

6. Scan the QR code with Expo Go or choose an Android/iOS simulator from the Expo terminal.

## Backend schema and seed data

Open the Supabase SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql). The script enables `pgcrypto`, creates the `categories` and `tasks` tables, enables row-level security, and adds the policies and grants needed by the unauthenticated assessment client.

The schema contains:

- `categories`: UUID primary key, unique name, and optional color.
- `tasks`: UUID primary key, title, description, optional category reference, optional due date, completion status, created time, and updated time.
- The task-to-category foreign key uses `on delete set null`, so deleting a category does not delete its tasks.
- `starred` is intentionally absent because it is a device-local field.

The same SQL file seeds three categories (`Work`, `Personal`, and `Health`) and eight tasks. Category inserts use `on conflict (name) do nothing`, and task seed rows are inserted only when the tasks table is empty. This makes the setup safe to rerun without repeatedly duplicating the supplied seed data.

The included RLS policies allow anonymous read/write access only to support the assessment's no-authentication scope. They are not appropriate for a production multi-user application.

## Local storage choice

Taskly uses AsyncStorage with the versioned key `taskly.cache.v1`. The cached object contains its schema version, tasks, categories, device-local starred values, and the last successful refresh timestamp. AsyncStorage is appropriate here because the cache is small, JSON-shaped, and only needs simple whole-document hydration and persistence. The application reads this cache before contacting Supabase so previously downloaded tasks appear immediately and remain available when the device is offline or a refresh fails.

## State management choice

Redux Toolkit provides predictable local application state for hydrated tasks, categories, starred values, cache hydration, and the last refresh timestamp. RTK Query is configured with `fakeBaseQuery` because Supabase requests are made through the Supabase JavaScript SDK; task and category endpoint files inject their queries and mutations into one root API. Transient screen controls such as the current search text and open filter modal remain local to the screen. Backend writes are not optimistic: the app waits for Supabase success, updates the Redux slice, and then persists the new state to AsyncStorage.

## Preserving starred tasks during refresh

`starred` is stored only in the local task cache and is never sent to Supabase. During a successful backend refresh, `mergeRemoteTasks` builds a map from cached task IDs to their starred values. Each downloaded task is then combined with the matching local value; tasks that were not previously cached receive `starred: false`. Only after this merge does the app update Redux and AsyncStorage, so refreshing backend data cannot erase the user's device-local stars.

## Testing approach

The project uses Jest with the Expo preset. Run the test suite once with:

```bash
npm test -- --runInBand --watchAll=false
```

The tests focus on deterministic business rules where a regression would be easy to miss during manual UI checks:

- Filter and sort tests verify combined title/category/status filtering, due-date ordering, and created-time ordering.
- The task mapper test verifies conversion from Supabase column names and nullable values into the application's `TaskItem` model.
- The refresh merge test verifies that cached starred values survive a backend refresh and that newly downloaded tasks default to unstarred.

These are unit tests rather than live Supabase tests, so they are fast, repeatable, and do not require network access or test database credentials.

## Known limitations

- Offline access is read-only. Failed writes are reported to the user and are not queued for later synchronization.
- Authentication and per-user task ownership are intentionally omitted by the assessment, so the supplied anonymous RLS policies must be replaced before production use.
- The app does not subscribe to Supabase Realtime; changes from another client appear after a background or manual refresh.
- There is no multi-device conflict resolution for simultaneous edits.
- The current tests cover core pure logic but not navigation flows, complete screen interactions, or a live Supabase environment.

## What I would do differently with another day

With another day, I would add authenticated user ownership with restrictive RLS policies, an offline mutation queue with retry and conflict handling, and Supabase integration tests against an isolated test project. I would also add React Native Testing Library coverage for create/edit/delete and refresh interactions, improve accessibility testing, and extract the refresh workflow from the Task List screen into a focused hook so it can be tested independently.
