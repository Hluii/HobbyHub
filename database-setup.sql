-- Complete database setup for HobbyHub
-- Run this in your Supabase SQL Editor

-- Create posts table if not exists
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    image_url TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create comments table if not exists
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profiles table for user settings
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for posts table
CREATE POLICY "Anyone can view posts" 
    ON posts 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

CREATE POLICY "Users can create posts" 
    ON posts 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
    ON posts 
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
    ON posts 
    FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- Policies for comments table
CREATE POLICY "Anyone can view comments" 
    ON comments 
    FOR SELECT 
    TO anon, authenticated 
    USING (true);

CREATE POLICY "Authenticated users can create comments" 
    ON comments 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
    ON comments 
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
    ON comments 
    FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- Policies for profiles table
CREATE POLICY "Users can view any profile" 
    ON profiles 
    FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Users can update their own profile" 
    ON profiles 
    FOR ALL 
    TO authenticated 
    USING (auth.uid() = id);

-- Create storage bucket for avatars if not exists
-- This is usually done through the Supabase dashboard
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('images', 'images', true) 
-- ON CONFLICT (id) DO NOTHING;

-- Optional: Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, bio, avatar_url)
    VALUES (NEW.id, '', '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Trigger to create profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
