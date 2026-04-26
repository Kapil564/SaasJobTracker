import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.file',
    flow: 'auth-code',
    prompt: 'consent',
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      const result = await googleLogin(tokenResponse.code);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Google login failed');
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleLogin}>
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-[#0f172a]/80 mb-1.5" htmlFor="email">
          Email address
        </label>
        <input 
          id="email" 
          type="email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[rgba(15,23,42,0.12)] placeholder-[#64748b]/50 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all bg-white"
          placeholder="Enter your email" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0f172a]/80 mb-1.5" htmlFor="password">
          Password
        </label>
        <input 
          id="password" 
          type="password" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[rgba(15,23,42,0.12)] placeholder-[#64748b]/50 text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all bg-white"
          placeholder="••••••••" 
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <input 
            id="remember-me" 
            name="remember-me" 
            type="checkbox" 
            className="h-4 w-4 rounded border-[rgba(15,23,42,0.12)] text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer" 
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-[#64748b] cursor-pointer">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-[#4f46e5] hover:text-[#4338ca] transition-colors">
            Forgot password?
          </a>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all disabled:opacity-70 mt-6"
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[rgba(15,23,42,0.06)]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-[#64748b]">Or continue with</span>
        </div>
      </div>

      <button 
        type="button"
        onClick={() => handleGoogleLogin()}
        className="mt-6 w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-[rgba(15,23,42,0.12)] rounded-lg shadow-sm bg-white text-sm font-medium text-[#0f172a] hover:bg-[#f8fafc] transition-all"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Google
      </button>
    </form>
  );
}
