import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';
import HowItWorks from '@/components/landing/HowItWorks';
import SocialProof from '@/components/landing/SocialProof';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <HowItWorks />
      <SocialProof />
      <FAQSection />
      <Footer />
    </main>
  );
}
