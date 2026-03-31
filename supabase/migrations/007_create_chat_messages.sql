-- 聊天消息表

create table if not exists chat_messages (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null references chat_sessions(id) on delete cascade,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  role        text        not null check (role in ('user', 'assistant')),
  content     text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists chat_messages_session_created
  on chat_messages(session_id, created_at asc);

alter table chat_messages enable row level security;

create policy "chat_messages: 用户只能操作自己的消息"
  on chat_messages
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
