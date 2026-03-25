import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import StatsBar from '../components/landing/StatsBar';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="bg-cream min-h-screen selection:bg-gold/30 selection:text-ink">
      <Navbar />
      
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <HowItWorks />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
