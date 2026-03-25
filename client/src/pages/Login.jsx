import { Link } from 'react-router-dom';
import LoginForm from '../components/login/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#4f46e5]/30 selection:text-[#0f172a]">
      <div className="max-w-md w-full space-y-8">
        
        <div className="text-center">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 justify-center mb-6">
            <div className="w-10 h-10 bg-[#0f172a] rounded-lg flex items-center justify-center shadow-md border border-[rgba(15,23,42,0.06)]">
              <svg className="w-6 h-6 text-[#4f46e5]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
              </svg>
            </div>
            <span className="font-serif font-bold text-2xl text-[#0f172a] tracking-tight">CareerTransit</span>
          </Link>
          <h2 className="text-3xl font-serif font-bold text-[#0f172a]">Welcome back</h2>
          <p className="mt-2 text-sm text-[#64748b]">
            Please enter your details to sign in.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl sm:px-10 border border-[rgba(15,23,42,0.06)]">
          <LoginForm />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-[#64748b]">Don't have an account? </span>
            <Link to="/signup" className="font-medium text-[#4f46e5] hover:text-[#4338ca] transition-colors">
              Sign up for free
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
