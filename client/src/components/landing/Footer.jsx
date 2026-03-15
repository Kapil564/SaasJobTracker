export default function Footer() {
  return (
    <footer id="footer" className="flex items-center justify-between px-10 py-6 border-t border-warm-border
      max-[768px]:flex-col max-[768px]:gap-4 max-[768px]:text-center max-[768px]:px-5">
      <div className="flex items-center gap-2.5">
        <div className="w-[22px] h-[22px] rounded-[5px] bg-dark flex items-center justify-center text-cream text-[11px] font-serif">
          J
        </div>
        <span className="text-[13px] font-light text-body">© 2024 JobTrackr</span>
      </div>

      <div className="flex gap-6 max-[768px]:gap-4">
        <a href="#" id="footer-privacy" className="text-[13px] font-light text-body hover:text-dark transition-colors">
          Privacy
        </a>
        <a href="#" id="footer-terms" className="text-[13px] font-light text-body hover:text-dark transition-colors">
          Terms
        </a>
        <a href="#" id="footer-github" className="text-[13px] font-light text-body hover:text-dark transition-colors">
          GitHub
        </a>
      </div>
    </footer>
  )
}
