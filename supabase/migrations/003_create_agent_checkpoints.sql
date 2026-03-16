-- LangGraph Checkpoint 表，用于持久化 Agent 多轮对话状态
-- 参考 @langchain/langgraph-checkpoint-supabase 官方 schema

create table if not exists checkpoints (
  thread_id     text   not null,
  checkpoint_ns text   not null default '',
  checkpoint_id text   not null,
  parent_id     text,
  type          text,
  checkpoint    jsonb  not null default '{}',
  metadata      jsonb  not null default '{}',
  primary key (thread_id, checkpoint_ns, checkpoint_id)
);

create table if not exists checkpoint_blobs (
  thread_id     text  not null,
  checkpoint_ns text  not null default '',
  channel       text  not null,
  version       text  not null,
  type          text  not null,
  blob          bytea,
  primary key (thread_id, checkpoint_ns, channel, version)
);

create table if not exists checkpoint_writes (
  thread_id     text    not null,
  checkpoint_ns text    not null default '',
  checkpoint_id text    not null,
  task_id       text    not null,
  idx           integer not null,
  channel       text    not null,
  type          text,
  blob          bytea   not null,
  primary key (thread_id, checkpoint_ns, checkpoint_id, task_id, idx)
);

-- Checkpoint 表不启用 RLS（由 server_role key 操作，服务端鉴权）
-- 若需更严格隔离，可按 thread_id 前缀 user_id 来限制
