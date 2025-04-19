
import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FilterSection from "@/components/FilterSection";
import MovieGrid from "@/components/MovieGrid";
import MovieCarousel from "@/components/MovieCarousel";
import MoviePagination from "@/components/MoviePagination";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import AuthModal from "@/components/AuthModal";
import SocialShareModal from "@/components/SocialShareModal";
import { useStore } from "@/store/store";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Index = () => {
  const location = useLocation();
  const { 
    movies, 
    filteredMovies, 
    latestMovies, 
    topRatedMovies, 
    applyFilters, 
    updateMovieCategories, 
    fetchMoviesFromSupabase,
    isLoading 
  } = useStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalDismissCount, setShareModalDismissCount] = useState(() => {
    return parseInt(localStorage.getItem('shareModalDismissCount') || '0');
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const footerRef = useRef<HTMLDivElement>(null);
  
  // Calculate total pages based on filtered movies
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  
  // Get current movies for the page
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Fetch movies whenever the component mounts or location changes
  useEffect(() => {
    console.log("Index: Fetching movies from Supabase");
    fetchMoviesFromSupabase()
      .then(() => {
        applyFilters();
        updateMovieCategories();
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
      });
  }, [fetchMoviesFromSupabase, applyFilters, updateMovieCategories, location]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredMovies.length]);
  
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
  
  // Show social share modal every 1 minute
  useEffect(() => {
    // Only show if not dismissed twice already
    if (shareModalDismissCount < 2) {
      const interval = setInterval(() => {
        setShareModalOpen(true);
      }, 60000); // 1 minute in milliseconds
      
      return () => clearInterval(interval);
    }
  }, [shareModalDismissCount]);
  
  // Find the featured movie (marked as featured or first movie)
  const featuredMovie = movies.find(movie => movie.isFeatured) || movies[0];
  
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-10 w-10 animate-spin text-netflix-red" />
          <span className="ml-2 text-xl">Loading movies...</span>
        </div>
      ) : (
        <>
          {featuredMovie && <HeroSection movie={featuredMovie} />}
          <FilterSection />
          
          <div className="container mx-auto px-4 md:px-6 py-8">
            {latestMovies.length > 0 && (
              <MovieCarousel title="Latest Posted Movies" movies={latestMovies} />
            )}
            
            {topRatedMovies.length > 0 && (
              <MovieCarousel title="Most Rated Movies" movies={topRatedMovies} />
            )}
            
            <h2 className="text-2xl font-bold mb-4 mt-12">All Movies</h2>
            <MovieGrid movies={currentMovies} />
            
            {filteredMovies.length > itemsPerPage && (
              <MoviePagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
            
            {filteredMovies.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-netflix-lightgray text-lg">No movies found. Try changing your filters or add new movies.</p>
              </div>
            )}
          </div>
        </>
      )}
      
      <div ref={footerRef}>
        <Footer />
      </div>
      
      <CookieConsent />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <SocialShareModal open={shareModalOpen} onOpenChange={handleShareModalOpenChange} />
    </div>
  );
  
  // Handle social share modal close
  function handleShareModalOpenChange(open: boolean) {
    if (!open && shareModalOpen) {
      // User closed the modal
      const newCount = shareModalDismissCount + 1;
      setShareModalDismissCount(newCount);
      localStorage.setItem('shareModalDismissCount', newCount.toString());
    }
    setShareModalOpen(open);
  }
};

export default Index;
