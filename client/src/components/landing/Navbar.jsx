import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 md:top-4 md:left-1/2 md:-translate-x-1/2 w-full md:w-[95%] md:max-w-6xl z-50 transition-all duration-300 backdrop-blur-[12px] bg-[rgba(248,250,252,0.85)] border-b md:border border-border rounded-b-2xl md:rounded-4xl ${scrolled ? 'py-3 shadow-md' : 'py-3'}`}>
      <div className="max-w-6xl mx-auto px-6 max-sm:px-4 flex justify-between items-center relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 w-1/4">
          <div className="w-8 h-8 bg-[#0f172a] rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-[#4f46e5]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
            </svg>
          </div>
          <Link to="/">
          <span className="font-serif font-bold text-xl text-[#0f172a]">CareerTransit</span>
          </Link>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex flex-1 justify-center gap-8 text-sm font-sans font-medium text-ink">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-ink transition-colors">Testimonials</a>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-4 w-1/4">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden sm:block text-sm font-sans font-medium text-[#0f172a] hover:text-[#0f172a]/70 transition-colors">Dashboard</Link>
              <button onClick={logout} className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0f172a] text-sm font-sans font-medium py-1.5 px-4 rounded-full transition-all shadow-sm whitespace-nowrap cursor-pointer">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-sans font-medium text-ink hover:text-ink/70 transition-colors">Log in</Link>
              <Link to="/signup" className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-sans font-medium py-1.5 px-3 rounded-2xl transition-all shadow-sm whitespace-nowrap">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
