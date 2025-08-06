import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      console.log('Fetching comments for post:', postId);
      
      // Start with basic comments first, then enhance with profiles
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
        // Try without RLS to see if table exists
        return;
      }

      console.log('Comments fetched:', commentsData);

      if (commentsData && commentsData.length > 0) {
        // Try to get profiles for each comment user
        const userIds = [...new Set(commentsData.map(c => c.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, bio, avatar_url')
          .in('id', userIds);

        console.log('Profiles data:', profilesData, 'Error:', profilesError);

        // Create profile map
        const profileMap = {};
        if (profilesData) {
          profilesData.forEach(profile => {
            profileMap[profile.id] = profile;
          });
        }

        // Combine comments with profiles
        const commentsWithUsers = commentsData.map(comment => ({
          ...comment,
          user_email: `user_${comment.user_id.substring(0, 8)}@example.com`, // Placeholder
          profile: profileMap[comment.user_id] || { bio: '', avatar_url: '' }
        }));

        setComments(commentsWithUsers);
      } else {
        setComments([]);
      }
    };

    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    fetchComments();
    getCurrentUser();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    console.log('Attempting to add comment...');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No user found');
      setIsSubmitting(false);
      return alert('You must be logged in to comment.');
    }

    console.log('Current user:', user.id);

    if (!newComment.trim()) {
      setIsSubmitting(false);
      alert('Please enter a comment.');
      return;
    }

    console.log('Inserting comment:', {
      content: newComment.trim(),
      user_id: user.id,
      post_id: postId
    });

    const { data, error } = await supabase.from('comments').insert({
      content: newComment.trim(),
      user_id: user.id,
      post_id: postId,
    }).select();

    if (error) {
      console.error('Comment insert error:', error);
      setIsSubmitting(false);
      alert(`Failed to add comment: ${error.message}`);
      return;
    }

    console.log('Comment inserted successfully:', data);

    if (data && data.length > 0) {
      // Get the current user's profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('bio, avatar_url')
        .eq('id', user.id)
        .single();

      console.log('User profile data:', profileData);

      // Add the new comment with user info to the list
      const newCommentWithUser = {
        ...data[0],
        user_email: user.email,
        profile: profileData || { bio: '', avatar_url: '' }
      };
      
      console.log('Adding comment to UI:', newCommentWithUser);
      setComments([...comments, newCommentWithUser]);
      setNewComment('');
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      setComments(comments.filter(c => c.id !== commentId));
    } else {
      alert('Failed to delete comment');
    }
  };

  return (
    <div className='mt-8'>
      <h3 className='text-xl font-semibold mb-4 flex items-center gap-2'>
        <span className="text-2xl">💬</span>
        Comments ({comments.length})
      </h3>
      
      <form onSubmit={handleAddComment} className='mb-6'>
        <textarea
          className='w-full border-2 border-purple-200 rounded-lg p-3 focus:border-purple-400 focus:outline-none transition-colors duration-200'
          placeholder='Share your thoughts about this crochet project...'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <button
          type='submit'
          disabled={isSubmitting || !newComment.trim()}
          className={`px-6 py-2 rounded-lg mt-3 font-medium transition-all duration-200 ${
            isSubmitting || !newComment.trim()
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
          }`}
        >
          {isSubmitting ? '⏳ Adding...' : '💬 Add Comment'}
        </button>
      </form>

      <div className='space-y-4'>
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">💭</span>
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className='bg-white border-2 border-purple-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200'>
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  {comment.profile?.avatar_url ? (
                    <img 
                      src={comment.profile.avatar_url} 
                      alt={`${comment.user_email}'s avatar`} 
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                      onError={(e) => {
                        // Fallback to generated avatar
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user_email || 'User')}&background=random&color=fff&size=40`;
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {comment.user_email ? comment.user_email.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    <span className="font-semibold text-purple-700 text-sm">
                      {comment.user_email ? comment.user_email.split('@')[0] : 'Unknown user'}
                    </span>
                    {comment.profile?.bio && (
                      <span className="text-xs text-gray-600 italic truncate max-w-48">
                        {comment.profile.bio}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                {/* Delete button - only show if current user owns the comment */}
                {currentUser && currentUser.id === comment.user_id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-all duration-200 group"
                    title="Delete comment"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">🗑️</span>
                  </button>
                )}
              </div>
              
              {/* Comment Content */}
              <div className="pl-13">
                <p className='text-gray-700 leading-relaxed'>{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
