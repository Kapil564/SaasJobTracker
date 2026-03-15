import { useState, useEffect } from 'react'

export default function Navbar({ onLogin, onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 h-[58px] flex items-center justify-between px-10
        border-b border-warm-border transition-all duration-300
        ${scrolled ? 'bg-cream/95 backdrop-blur-md' : 'bg-cream/80 backdrop-blur-sm'}
        max-[768px]:px-5`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-dark flex items-center justify-center text-cream text-[14px] font-serif">
          J
        </div>
        <span className="text-[15px] font-normal text-dark tracking-[-0.02em]">
          JobTrackr
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          id="nav-login-btn"
          className="px-4 py-1.5 border border-dark/30 text-dark text-[14px] font-normal rounded-[6px]
            bg-transparent hover:border-dark hover:bg-dark hover:text-cream transition-all"
          onClick={onLogin}
        >
          Login
        </button>
        <button
          id="nav-signup-btn"
          className="px-4 py-1.5 bg-dark text-cream text-[14px] font-normal rounded-[6px]
            hover:bg-dark/85 transition-colors"
          onClick={onGetStarted}
        >
          Get started →
        </button>
      </div>
    </nav>
  )
}
