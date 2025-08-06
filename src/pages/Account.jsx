import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Account() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ bio: '', avatar_url: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return navigate('/login');

      setUser(user);

      // Fetch or create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Fetch user posts
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setPosts(data);
    };

    fetchUserData();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) {
      alert('Failed to delete post');
    } else {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalAvatarUrl = profile.avatar_url;

    // Upload new avatar if selected
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        alert('Avatar upload failed: ' + uploadError.message);
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      finalAvatarUrl = urlData.publicUrl;
    }

    // Update or insert profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        bio: profile.bio,
        avatar_url: finalAvatarUrl,
        updated_at: new Date().toISOString(),
      });

    setIsUploading(false);
    if (error) {
      console.error('Profile update error:', error);
      alert('Profile update failed');
    } else {
      setProfile({ ...profile, avatar_url: finalAvatarUrl });
      setSelectedFile(null);
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className='p-4 max-w-4xl mx-auto'>
      <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
        <div className='flex items-start space-x-6'>
          {/* Avatar Section */}
          <div className='flex-shrink-0'>
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile avatar" 
                className='w-24 h-24 rounded-full object-cover border-4 border-purple-200'
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random&color=fff&size=96`;
                }}
              />
            ) : (
              <div className='w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold border-4 border-purple-200'>
                {user.email.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className='flex-grow'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {user.email.split('@')[0]}
            </h1>
            <p className='text-gray-600 mb-4'>
              {profile.bio || 'No bio yet - click edit to add one!'}
            </p>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200'
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className='mt-6 pt-6 border-t border-gray-200'>
            <form onSubmit={handleProfileUpdate} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder='Tell us about your crochet journey...'
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  rows='3'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Profile Picture
                </label>
                <input
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/webp'
                  onChange={handleFileChange}
                  className='w-full p-2 border border-gray-300 rounded-lg'
                />
                {selectedFile && (
                  <p className='text-sm text-green-600 mt-2'>
                    New avatar selected: {selectedFile.name}
                  </p>
                )}
                <p className='text-xs text-gray-500 mt-1'>
                  Supported formats: JPEG, PNG, WebP. Max size: 5MB
                </p>
              </div>

              <button
                type='submit'
                disabled={isUploading}
                className={`px-6 py-2 rounded-lg text-white ${
                  isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                } transition-colors duration-200`}
              >
                {isUploading ? 'Updating...' : 'Save Profile'}
              </button>
            </form>
          </div>
        )}
      </div>

      <h2 className='text-3xl font-bold mb-6 text-gray-900'>My Crochet Posts</h2>
      {posts.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-600 mb-4'>You haven't created any posts yet.</p>
          <Link 
            to='/create' 
            className='bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg inline-block transition-colors duration-200'
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {posts.map((post) => (
            <div key={post.id} className='bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200'>
              <div className='flex justify-between items-start'>
                <div className='flex-grow'>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>{post.title}</h3>
                  <p className='text-sm text-gray-500 mb-3'>
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                  {post.content && (
                    <p className='text-gray-700 line-clamp-2 mb-3'>{post.content}</p>
                  )}
                </div>
                
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className='w-20 h-20 object-cover rounded-lg ml-4 flex-shrink-0'
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              <div className='flex space-x-3 mt-4'>
                <Link 
                  to={`/post/${post.id}`} 
                  className='text-blue-500 hover:text-blue-700 font-medium'
                >
                  View
                </Link>
                <Link 
                  to={`/edit/${post.id}`} 
                  className='text-yellow-600 hover:text-yellow-800 font-medium'
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(post.id)} 
                  className='text-red-500 hover:text-red-700 font-medium'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}