<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Data access uses the browser Supabase client with RLS (no server functions needed yet) — keeps it simple for a beginner team.
- Trust status is computed client-side in `src/lib/trust.ts` from reports + `last_confirmed_at`; never stored — avoids stale persisted state.
- Report rate-limiting and `last_confirmed_at` updates live in DB triggers — clients can't bypass them.
- Demo rows are flagged `is_demo` and must always be visibly labelled.
