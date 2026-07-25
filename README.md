# Taskly

[![Expo SDK 54](https://img.shields.io/badge/EXPO-SDK%2054-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/SUPABASE-BACKEND-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Download APK](https://img.shields.io/badge/ANDROID-DOWNLOAD%20APK-7F9C7A?style=for-the-badge&logo=android&logoColor=white)](YOUR_APK_LINK_HERE) <!-- Replace YOUR_APK_LINK_HERE with the public APK URL. -->

Taskly is an Expo SDK 54 task manager backed by Supabase. It uses React Navigation, Redux Toolkit, RTK Query, and a versioned AsyncStorage cache to provide backend-backed task management with offline reading.

## Features

- Create, edit, complete, reopen, delete, and star tasks
- Organize tasks with categories
- Search, filter, and sort tasks
- Read cached tasks offline and refresh when online

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

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.

### Table schema

| Table        | Columns                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `categories` | `id` (UUID primary key), `name` (unique text), `color` (optional text)                                                                                |
| `tasks`      | `id` (UUID primary key), `title`, `description`, `category_id` (optional foreign key), `due_date` (optional), `completed`, `created_at`, `updated_at` |

`tasks.category_id` references `categories.id` with `on delete set null`. `starred` is local-only and is not stored in Supabase.

The script seeds 3 categories (`Work`, `Personal`, `Health`) and 8 tasks. It is safe to rerun: categories use `on conflict do nothing`, and tasks seed only when the table is empty.

## Local storage choice

Taskly uses AsyncStorage (`taskly.cache.v1`) because the cache is small and JSON-shaped. It stores tasks, categories, local starred values, and the last refresh time; cached data renders first and remains available offline.

## State management choice

Taskly uses Redux Toolkit for cached tasks, categories, starred values, and sync metadata. RTK Query wraps Supabase requests, while screen-only state stays local; this keeps cached, remote, and UI state clearly separated. Redux Toolkit was chosen because the app needs predictable shared state across screens and cache updates.

## Preserving starred tasks during refresh

`starred` is stored only in AsyncStorage and is never sent to Supabase. On refresh, [`mergeRemoteTasks`](utils/task-mapper.ts) restores each cached star by task ID; new tasks default to `false`.

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

## AI usage

AI was used for requirement clarification, folder-structure suggestions, debugging ideas, and improving documentation.

The project architecture, UI, state management, navigation, task features, offline handling, and final implementation were built from scratch. All AI suggestions were reviewed and adjusted before use.

## Known limitations

- Offline access is read-only. Failed writes are reported to the user and are not queued for later synchronization.
- Authentication and per-user task ownership are intentionally omitted by the assessment, so the supplied anonymous RLS policies must be replaced before production use.
- The app does not subscribe to Supabase Realtime; changes from another client appear after a background or manual refresh.
- There is no multi-device conflict resolution for simultaneous edits.
- The current tests cover core pure logic but not navigation flows, complete screen interactions, or a live Supabase environment.

## What I would do differently with another day

With another day, I would add authenticated user ownership with restrictive RLS policies, an offline mutation queue with retry and conflict handling, and Supabase integration tests against an isolated test project. I would also add React Native Testing Library coverage for create/edit/delete and refresh interactions, improve accessibility testing, and extract the refresh workflow from the Task List screen into a focused hook so it can be tested independently.
