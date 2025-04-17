
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterSection from "@/components/FilterSection";
import MovieGrid from "@/components/MovieGrid";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AuthModal from "@/components/AuthModal";
import { useStore } from "@/store/store";

const Index = () => {
  const { movies, applyFilters } = useStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Apply filters on initial load
    applyFilters();
  }, [applyFilters]);
  
  useEffect(() => {
    // Function to check if user has scrolled to the footer
    const handleScroll = () => {
      if (footerRef.current) {
        const footerRect = footerRef.current.getBoundingClientRect();
        // If the footer is in view and auth modal hasn't been shown yet
        if (footerRect.top < window.innerHeight && !localStorage.getItem('authModalShown')) {
          setAuthModalOpen(true);
          // Mark that we've shown the auth modal
          localStorage.setItem('authModalShown', 'true');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Find the featured movie (marked as featured or first movie)
  const featuredMovie = movies.find(movie => movie.isFeatured) || movies[0];
  
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      <HeroSection movie={featuredMovie} />
      <FilterSection />
      <MovieGrid />
      <div ref={footerRef}>
        <Footer />
      </div>
      <CookieConsent />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;
