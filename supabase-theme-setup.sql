create table if not exists public.theme_select (
    user_id uuid primary key references auth.users (id) on delete cascade,
    theme text not null default 'light'
        check (theme in ('light', 'dark', 'liquid-glass', 'custom')),
    created_at timestamptz not null default now()
);

alter table public.theme_select
    add column if not exists user_id uuid references auth.users (id) on delete cascade;

alter table public.theme_select
    add column if not exists theme text not null default 'light';

create unique index if not exists theme_select_user_id_key
    on public.theme_select (user_id);

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'theme_select_theme_check'
          and conrelid = 'public.theme_select'::regclass
    ) then
        alter table public.theme_select
            add constraint theme_select_theme_check
            check (theme in ('light', 'dark', 'liquid-glass', 'custom'));
    end if;
end;
$$;

alter table public.theme_select enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.theme_select to authenticated;

drop policy if exists "Users can read their own theme" on public.theme_select;
create policy "Users can read their own theme"
    on public.theme_select for select to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own theme" on public.theme_select;
create policy "Users can create their own theme"
    on public.theme_select for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own theme" on public.theme_select;
create policy "Users can update their own theme"
    on public.theme_select for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create or replace function public.create_default_theme_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.theme_select (user_id, theme)
    values (new.id, 'light')
    on conflict (user_id) do nothing;

    return new;
end;
$$;

drop trigger if exists create_theme_for_new_user on auth.users;
create trigger create_theme_for_new_user
    after insert on auth.users
    for each row execute function public.create_default_theme_for_new_user();
