import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='card border border-purple-100 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-xl mx-auto group'>
      {/* Image Thumbnail */}
      {post.image_url && (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          {/* Fallback for broken images */}
          <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 text-purple-400">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🧶</span>
              <span className="text-sm">Image not available</span>
            </div>
          </div>
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      
      {/* No image placeholder */}
      {!post.image_url && (
        <div className="h-32 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 flex items-center justify-center">
          <div className="text-center text-purple-400">
            <span className="text-3xl mb-1 block">🧶</span>
            <span className="text-sm font-medium">Crochet Project</span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6">
        <h2 className='text-xl font-bold text-purple-700 mb-2 line-clamp-2'>
          <Link to={`/post/${post.id}`} className='hover:text-purple-900 transition-colors duration-200'>
            {post.title}
          </Link>
        </h2>
        
        {/* Content Preview */}
        {post.content && (
          <p className='text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed'>
            {post.content}
          </p>
        )}
        
        {/* Post Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="text-pink-500">🧡</span>
              {post.upvotes} upvotes
            </span>
            <span className="flex items-center gap-1">
              <span className="text-purple-500">📅</span>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          
          {/* Read More Button */}
          <Link 
            to={`/post/${post.id}`}
            className="text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors duration-200"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}