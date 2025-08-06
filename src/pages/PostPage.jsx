import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import CommentSection from '../components/CommentSection';

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data: postData } = await supabase.from('posts').select('*').eq('id', id).single();
      setPost(postData);
    };
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    fetchPost();
    getUser();
  }, [id]);

const handleUpvote = async () => {
  const { error } = await supabase
    .from('posts')
    .update({ upvotes: post.upvotes + 1 })
    .eq('id', post.id);

  if (error) {
    alert('Failed to upvote!');
    console.error(error);
    return;
  }

  // Re-fetch updated post
  const { data: updated, error: fetchError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', post.id)
    .single();

  if (fetchError) {
    alert('Failed to refresh post.');
    console.error(fetchError);
  } else {
    setPost(updated);
  }
};

  if (!post) return <p>Loading...</p>;

  return (
    <div className='p-4 max-w-3xl mx-auto'>
      <h2 className='text-3xl font-bold mb-2'>{post.title}</h2>
      <p className='mb-4'>{post.content}</p>
      
      {/* Enhanced image display with error handling */}
      {post.image_url && (
        <div className="mb-4">
          <img 
            src={post.image_url} 
            alt='crochet project' 
            className='max-w-full h-auto rounded-lg shadow-md border border-purple-200' 
            onError={(e) => {
              console.error('Image failed to load:', post.image_url);
              e.target.style.display = 'none';
              // Show fallback message
              const fallback = document.createElement('div');
              fallback.className = 'bg-gray-100 border border-gray-300 rounded-lg p-4 text-center text-gray-500';
              fallback.innerHTML = '🖼️ Image could not be loaded<br><small>URL: ' + post.image_url + '</small>';
              e.target.parentNode.appendChild(fallback);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', post.image_url);
            }}
          />
        </div>
      )}
      
      {/* Debug info for development */}
      {post.image_url && (
        <div className="mb-4 text-xs text-gray-400 bg-gray-50 p-2 rounded">
          <strong>Debug:</strong> Image URL: <a href={post.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{post.image_url}</a>
        </div>
      )}
      
      {post.video_url && <iframe width='100%' height='315' src={post.video_url} title='Crochet video' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen></iframe>}
      <p className='text-sm text-gray-500 mt-4'>Upvotes: {post.upvotes}</p>
      <button onClick={handleUpvote} className='bg-pink-400 text-white px-4 py-2 rounded mt-2'>Upvote 🧡</button>

      {/* ✅ Only show edit link if user is creator */}
      {userId === post.user_id && (
        <div className='mt-4'>
          <Link to={`/edit/${post.id}`} className='text-yellow-500'>Edit this post</Link>
        </div>
      )}

      {/* Use the improved CommentSection component */}
      <CommentSection postId={id} />
    </div>
  );
}
