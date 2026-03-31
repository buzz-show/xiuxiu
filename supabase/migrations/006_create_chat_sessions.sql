-- 聊天会话表
-- session.id 直接作为 LangGraph thread_id，无需额外映射

create table if not exists chat_sessions (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  title       text        not null default '新对话',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists chat_sessions_user_updated
  on chat_sessions(user_id, updated_at desc);

alter table chat_sessions enable row level security;

create policy "chat_sessions: 用户只能操作自己的会话"
  on chat_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
