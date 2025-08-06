import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">

        <div className="bg-pink-50 p-6 rounded-lg shadow mb-8 border border-pink-200">
        <h1 className="text-4xl mb-2 brand">Welcome to Crochet Corner 🧶</h1>
            <p className="text-md text-gray-600">A cozy place to share your yarn creations, ideas, and projects with the crochet community.</p>
        </div>

        <div className="divider"></div>
        {posts.length === 0 ? (
            <p>No posts yet. Be the first to share your crochet project!</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
            </div>
        )}
    </div>
  );
}
