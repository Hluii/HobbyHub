import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  const handleCreatePostClick = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) navigate('/login');
    else navigate('/create');
  };

  return (
    <header className="w-full bg-green backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-50 relative">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-purple-600/5 pointer-events-none"></div>
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between min-h-[80px]">
        <Link
          to="/"
          className="group flex items-center space-x-3 hover:scale-[1.02] transition-all duration-300 ease-out"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <span className="relative text-4xl sm:text-5xl group-hover:animate-bounce filter drop-shadow-lg">🧶</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-pacifico bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent group-hover:from-purple-800 group-hover:via-pink-700 group-hover:to-purple-800 transition-all duration-300">
              Crochet Corner
            </span>
            <span className="text-xs text-gray-500 font-medium tracking-wide hidden sm:block">
              Yarn & Creativity Hub
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-5 lg:gap-6">
          <button
            onClick={handleCreatePostClick}
            className="group relative px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-2xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-2xl whitespace-nowrap overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            <span className="relative flex items-center gap-2 text-base sm:text-lg">
              <span className="text-xl">✨</span>
              New Post
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-2xl shadow-sm">
                <span className="text-2xl">👋</span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-purple-800">Welcome back!</span>
                  <span className="text-xs text-purple-600">{user.email.split('@')[0]}</span>
                </div>
              </div>
              <Link 
                to="/account" 
                className="group px-5 py-3 sm:px-6 sm:py-3.5 text-purple-700 font-bold rounded-2xl border-2 border-purple-300/60 bg-purple-50/50 hover:bg-purple-100 hover:border-purple-400 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                <span className="flex items-center gap-2 text-base">
                  <span className="text-lg group-hover:rotate-12 transition-transform duration-300">👤</span>
                  Account
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="group px-5 py-3 sm:px-6 sm:py-3.5 text-red-600 font-bold rounded-2xl border-2 border-red-300/60 bg-red-50/50 hover:bg-red-100 hover:border-red-400 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                <span className="flex items-center gap-2 text-base">
                  <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🚪</span>
                  Logout
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                to="/login" 
                className="group px-5 py-3 sm:px-6 sm:py-3.5 text-purple-700 font-bold rounded-2xl border-2 border-purple-300/60 bg-purple-50/50 hover:bg-purple-100 hover:border-purple-400 hover:shadow-lg transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                <span className="flex items-center gap-2 text-base">
                  <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🔑</span>
                  Login
                </span>
              </Link>
              <Link 
                to="/signup" 
                className="group relative px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-2xl whitespace-nowrap overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                <span className="relative flex items-center gap-2 text-base sm:text-lg">
                  <span className="text-xl">🎉</span>
                  Join Us
                </span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
