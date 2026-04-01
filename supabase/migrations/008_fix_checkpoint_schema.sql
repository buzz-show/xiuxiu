-- 修复 checkpoints 表与 @langchain/langgraph-checkpoint-postgres 的字段不匹配问题
-- 库期望 parent_checkpoint_id，现有迁移建的是 parent_id

-- 1. 添加 parent_checkpoint_id 列（如果不存在）
ALTER TABLE checkpoints ADD COLUMN IF NOT EXISTS parent_checkpoint_id TEXT;

-- 2. 将旧数据从 parent_id 迁移到 parent_checkpoint_id
UPDATE checkpoints SET parent_checkpoint_id = parent_id WHERE parent_checkpoint_id IS NULL AND parent_id IS NOT NULL;

-- 3. 创建 checkpoint_migrations 表（库用来跟踪 schema 版本）
CREATE TABLE IF NOT EXISTS checkpoint_migrations (
  v INTEGER PRIMARY KEY
);

-- 4. 标记已执行的 migration 版本（库有 5 个 migration：0-4）
INSERT INTO checkpoint_migrations (v) VALUES (0),(1),(2),(3),(4)
ON CONFLICT (v) DO NOTHING;
