import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-screen bg-white/95 backdrop-blur-md border-t border-gray-200/50 mt-auto relative -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/3 via-pink-600/3 to-purple-600/3 pointer-events-none"></div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-8">
          
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <span className="relative text-3xl filter drop-shadow-lg">🧶</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-pacifico bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent">
                  Crochet Corner
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  Yarn & Creativity Hub
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center md:text-left max-w-xs">
              A cozy place to share your yarn creations, ideas, and projects with the crochet community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
              <span className="text-xl">🔗</span>
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">🏠</span>
                Home
              </Link>
              <Link 
                to="/create" 
                className="text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">✨</span>
                Create Post
              </Link>
              <Link 
                to="/account" 
                className="text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="group-hover:translate-x-1 transition-transform duration-200">👤</span>
                My Account
              </Link>
            </nav>
          </div>

          {/* Community Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">
              <span className="text-xl">💝</span>
              Community
            </h3>
            <div className="flex flex-col space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-pink-500">❤️</span>
                Share your creations
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">🤝</span>
                Connect with crafters
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-500">📚</span>
                Learn new techniques
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">🌟</span>
                Inspire others
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white px-4">
              <div className="flex items-center space-x-2 text-2xl">
                <span className="animate-pulse">🧵</span>
                <span className="animate-pulse delay-100">🪡</span>
                <span className="animate-pulse delay-200">✂️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-pink-500">🧵</span>
            <span>Made with love for crocheters everywhere</span>
            <span className="text-purple-500">💜</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>© {currentYear} Crochet Corner</span>
            <span className="text-pink-400">•</span>
            <span>Crafted with care</span>
          </div>
        </div>

        {/* Floating Yarn Elements */}
        <div className="absolute top-4 right-4 text-4xl opacity-10 animate-bounce delay-300 hidden lg:block">
          🧶
        </div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-10 animate-bounce delay-700 hidden lg:block">
          🪡
        </div>
      </div>
    </footer>
  );
}
