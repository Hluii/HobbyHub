-- Quick diagnostic queries to run in Supabase SQL Editor
-- Run these one by one to check what's missing

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('posts', 'comments', 'profiles');

-- 2. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('posts', 'comments', 'profiles');

-- 3. Check if you have any comments
SELECT COUNT(*) as comment_count FROM comments;

-- 4. Check if you have any posts
SELECT COUNT(*) as post_count FROM posts;

-- 5. Test basic insert (replace with actual user_id and post_id)
-- INSERT INTO comments (content, user_id, post_id) 
-- VALUES ('Test comment', 'YOUR_USER_ID', 'YOUR_POST_ID');
