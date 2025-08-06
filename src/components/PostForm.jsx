import { useState } from 'react';

export default function PostForm({ initialValues, onSubmit, buttonLabel }) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [videoUrl, setVideoUrl] = useState(initialValues?.video_url || '');
  const [imageUrl, setImageUrl] = useState(initialValues?.image_url || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, video_url: videoUrl, image_url: imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <input
        className='w-full border p-2'
        type='text'
        placeholder='Post Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className='w-full border p-2'
        placeholder='Post content (optional)'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        className='w-full border p-2'
        type='text'
        placeholder='YouTube video URL (optional)'
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <input
        className='w-full border p-2'
        type='text'
        placeholder='Image URL (optional)'
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button type='submit' className='bg-pink-500 text-white px-4 py-2 rounded'>
        {buttonLabel}
      </button>
    </form>
  );
}