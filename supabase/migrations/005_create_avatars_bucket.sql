-- 创建宠物头像 Storage bucket（公开读取）
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pet-avatars',
  'pet-avatars',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- 允许已登录用户上传自己目录下的文件
create policy "authenticated users can upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'pet-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 允许已登录用户删除自己目录下的文件
create policy "authenticated users can delete own avatars"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'pet-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 公开读取
create policy "public can read avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'pet-avatars');
