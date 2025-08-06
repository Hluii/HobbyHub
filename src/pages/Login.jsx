import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else navigate('/');
  };

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h2 className='text-2xl font-bold mb-4'>Login</h2>
      <form onSubmit={handleLogin} className='space-y-4'>
        <input className='w-full border p-2' type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className='w-full border p-2' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className='bg-blue-500 text-white px-4 py-2 rounded' type='submit'>Login</button>
      </form>
    </div>
  );
}