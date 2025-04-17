
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/store/store";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection = ({ movie }: HeroSectionProps) => {
  return (
    <div className="relative w-full h-[70vh] md:h-[80vh]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-6 pt-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-netflix-red font-semibold">{movie.year}</span>
              <span className="flex items-center bg-netflix-darkgray px-2 py-0.5 rounded text-sm">
                <span className="text-netflix-red font-bold mr-1">IMDB</span> 
                {movie.rating}
              </span>
              <span className="px-1.5 py-0.5 border border-white/30 text-xs rounded">{movie.quality}</span>
            </div>
            
            <div className="mb-6">
              {movie.genres.map((genre, index) => (
                <span key={index} className="tag">{genre}</span>
              ))}
            </div>
            
            <p className="text-netflix-lightgray mb-8 line-clamp-3 md:line-clamp-none">
              {movie.synopsis}
            </p>
            
            <div className="flex flex-wrap space-x-4">
              <Button className="netflix-button flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch Now</span>
              </Button>
              
              <Link to={`/movie/${movie.id}`}>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>More Information</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
