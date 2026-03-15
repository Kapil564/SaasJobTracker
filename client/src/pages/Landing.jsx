import Navbar    from '../components/landing/Navbar'
import Hero      from '../components/landing/Hero'
import Features  from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import StatsBar  from '../components/landing/StatsBar'
import CTASection from '../components/landing/CTASection'
import Footer    from '../components/landing/Footer'

export default function Landing() {
  const handleGetStarted = () => { /* navigate to /register */ }
  const handleLogin      = () => { /* navigate to /login */ }
  const handleHowItWorks = () => document.getElementById('how-it-works')
                                    ?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="min-h-screen bg-cream">
      <Navbar onLogin={handleLogin} onGetStarted={handleGetStarted} />
      <Hero onGetStarted={handleGetStarted} onHowItWorks={handleHowItWorks} />
      <Features />
      <div id="how-it-works"><HowItWorks /></div>
      <StatsBar />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  )
}
