import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        alert('Error loading post');
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setVideoUrl(data.video_url);
      setImageUrl(data.image_url || '');
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let finalImageUrl = imageUrl;

    // Upload new image if selected
    if (selectedFile) {
      console.log('Uploading new image for edit:', selectedFile.name);
      
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Image upload failed: ' + uploadError.message);
        setIsUploading(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      finalImageUrl = urlData.publicUrl;
      console.log('New image uploaded successfully:', finalImageUrl);
    }

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        content,
        video_url: videoUrl,
        image_url: finalImageUrl,
      })
      .eq('id', id);

    setIsUploading(false);
    if (error) {
      alert('Update failed');
    } else {
      navigate(`/post/${id}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      console.log('New image selected:', file.name);
    }
  };

  return (
    <div className='p-4 max-w-xl mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Edit Post</h2>
      <form onSubmit={handleUpdate} className='space-y-4'>
        <input
          className='w-full p-2 border'
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Post Title'
          required
        />
        <textarea
          className='w-full p-2 border'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Post Content'
        />
        <input
          className='w-full p-2 border'
          type='text'
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder='YouTube Video URL (optional)'
        />
        
        {/* Current Image Display */}
        {imageUrl && (
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>Current Image:</label>
            <img 
              src={imageUrl} 
              alt="Current post image" 
              className='w-full max-w-md h-48 object-cover rounded border'
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Image Upload Section */}
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-gray-700'>
            {imageUrl ? 'Replace Image (optional):' : 'Add Image (optional):'}
          </label>
          <input
            type='file'
            accept='image/jpeg,image/jpg,image/png,image/webp'
            onChange={handleFileChange}
            className='w-full p-2 border rounded'
          />
          {selectedFile && (
            <p className='text-sm text-green-600'>
              New image selected: {selectedFile.name}
            </p>
          )}
          <p className='text-xs text-gray-500'>
            Supported formats: JPEG, PNG, WebP. Max size: 5MB
          </p>
        </div>

        <button 
          className={`w-full px-4 py-2 rounded text-white ${
            isUploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'
          }`} 
          type='submit'
          disabled={isUploading}
        >
          {isUploading ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
