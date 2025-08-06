import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 state toggle
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else navigate('/login');
  };

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Signup</h2>
      <form onSubmit={handleSignup} className='space-y-4'>
        <input
          className='w-full border p-2'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <input
            className='w-full border p-2 pr-10'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-sm text-blue-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          className='bg-green-500 text-white px-4 py-2 rounded'
          type='submit'
        >
          Signup
        </button>
      </form>
    </div>
  );
}
