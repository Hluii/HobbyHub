import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  // 🔒 Redirect if not logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        alert('You must be logged in to create a post.');
        navigate('/login');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Get user safely
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      alert('You must be logged in to create a post.');
      return;
    }

    let imageUrl = '';
    if (imageFile) {
      // Check file size (limit to 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        alert('Image file is too large. Please choose a file smaller than 5MB.');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP).');
        return;
      }

      const fileName = `${Date.now()}-${imageFile.name}`;
      console.log('Uploading file:', fileName, 'Size:', imageFile.size, 'Type:', imageFile.type);
      
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`public/${fileName}`, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          alert(`Upload failed due to security policy. Please:\n1. Go to Supabase Dashboard > Storage > Policies\n2. Add a policy to allow authenticated users to upload to the 'images' bucket\n3. Or temporarily disable RLS for testing\n\nError: ${error.message}`);
        } else {
          alert(`Image upload failed: ${error.message}`);
        }
        return;
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(`public/${fileName}`);

      imageUrl = urlData.publicUrl;
      console.log('Public URL:', imageUrl);
      
      // Test if the URL is accessible
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('Image URL is not publicly accessible:', response.status);
          alert('Image uploaded but may not be publicly viewable. Check your Supabase storage bucket policies.');
        }
      } catch (e) {
        console.warn('Could not verify image URL accessibility:', e);
      }
    }

    const { error: insertError } = await supabase.from('posts').insert({
      title,
      content,
      video_url: videoUrl,
      image_url: imageUrl,
      user_id: user.id,
    });

    if (insertError) {
      alert('Post creation failed!');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Crochet Post 🧶</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border"
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border"
          placeholder="Tell us about your crochet project..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="w-full p-2 border"
          type="text"
          placeholder="YouTube Video URL (optional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded-lg focus:border-purple-400 focus:outline-none"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {imageFile && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <p><strong>Selected file:</strong> {imageFile.name}</p>
            <p><strong>Size:</strong> {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>Type:</strong> {imageFile.type}</p>
          </div>
        )}
        <div className="text-sm text-gray-500">
          <p>📸 Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)</p>
        </div>
        <button
          className="bg-pink-400 text-white px-4 py-2 rounded"
          type="submit"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
}
