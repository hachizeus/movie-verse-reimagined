
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, ChevronLeft, Download, Plus, ThumbsUp, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore, Movie } from "@/store/store";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies, likeMovie, unlikeMovie } = useStore();
  const { toast } = useToast();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundMovie = movies.find(m => m.id === parseInt(id));
      if (foundMovie) {
        setMovie(foundMovie);
        
        // Find similar movies (same genre)
        const similar = movies
          .filter(m => 
            m.id !== foundMovie.id && 
            m.genres.some(g => foundMovie.genres.includes(g))
          )
          .slice(0, 6);
        
        setSimilarMovies(similar);
        
        // Check if user has liked this movie
        const checkLikeStatus = async () => {
          try {
            const { data: session } = await supabase.auth.getSession();
            if (session?.session?.user) {
              const { data } = await supabase
                .from('favorites')
                .select('*')
                .eq('user_id', session.session.user.id)
                .eq('movie_id', foundMovie.id)
                .single();
                
              setIsLiked(!!data);
            }
          } catch (error) {
            console.error("Error checking like status:", error);
          }
        };
        
        checkLikeStatus();
      }
    }
  }, [id, movies]);
  
  const handleWatchNow = () => {
    if (movie?.trailer_url) {
      window.open(movie.trailer_url, '_blank');
    } else {
      toast({
        title: "No Trailer Available",
        description: "Sorry, there is no trailer available for this movie.",
        variant: "destructive",
      });
    }
  };
  
  const handleDownload = () => {
    if (movie?.trailer_url) {
      window.open(movie.trailer_url, '_blank');
    } else {
      toast({
        title: "No Download Available",
        description: "Sorry, there is no download available for this movie.",
        variant: "destructive",
      });
    }
  };
  
  const handleLikeToggle = async () => {
    if (!movie) return;
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to like movies",
          variant: "destructive",
        });
        return;
      }
      
      const userId = session.session.user.id;
      
      if (isLiked) {
        // Unlike movie
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('movie_id', movie.id);
          
        unlikeMovie(movie.id);
        setIsLiked(false);
        toast({
          title: "Removed from favorites",
          description: `You've removed "${movie.title}" from your favorites`,
        });
      } else {
        // Like movie
        await supabase
          .from('favorites')
          .insert([
            { user_id: userId, movie_id: movie.id }
          ]);
          
        likeMovie(movie.id);
        setIsLiked(true);
        toast({
          title: "Added to favorites",
          description: `You've added "${movie.title}" to your favorites`,
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent"></div>
        </div>
        
        <div className="absolute top-0 left-0 p-4 md:p-6 pt-20">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-white hover:text-netflix-red transition-colors"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Poster */}
          <div className="md:col-span-3">
            <div className="aspect-[2/3] overflow-hidden shadow-xl">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Details */}
          <div className="md:col-span-9">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center space-x-4 mb-6">
              <span className="text-netflix-red font-semibold">{movie.year}</span>
              <span className="flex items-center bg-netflix-darkgray px-2 py-0.5 text-sm">
                <span className="text-netflix-red font-bold mr-1">IMDB</span> 
                {movie.rating}
              </span>
              <span className="px-1.5 py-0.5 border border-white/30 text-xs">{movie.quality}</span>
            </div>
            
            <div className="mb-6">
              {movie.genres.map((genre, index) => (
                <span key={index} className="tag">{genre}</span>
              ))}
            </div>
            
            <p className="text-netflix-lightgray mb-8 max-w-3xl">
              {movie.synopsis}
            </p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              <Button 
                className="netflix-button flex items-center space-x-2"
                onClick={handleWatchNow}
              >
                <Play className="h-5 w-5" />
                <span>Watch Now</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 flex items-center space-x-2"
                onClick={handleDownload}
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </Button>
              
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>My List</span>
              </Button>
              
              <Button 
                variant="outline" 
                className={`border-white/30 text-white hover:bg-white/10 rounded-full p-2 ${isLiked ? 'bg-netflix-red border-netflix-red text-white' : ''}`} 
                size="icon"
                onClick={handleLikeToggle}
              >
                <ThumbsUp className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full p-2" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Related Movies */}
            <div className="pt-6 border-t border-netflix-darkgray">
              <h3 className="text-xl font-bold mb-4">Similar Movies</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similarMovies.map(similarMovie => (
                  <MovieCard key={similarMovie.id} movie={similarMovie} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default MovieDetail;
