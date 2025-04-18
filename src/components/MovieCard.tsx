
import { Play, Star, ThumbsUp } from "lucide-react";
import { Movie } from "@/store/store";
import { Link } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card block">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        
        <div className="movie-card-info flex flex-col justify-end h-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium">{movie.year}</span>
            <div className="flex items-center">
              <span className="flex items-center text-xs mr-2">
                <Star className="h-3 w-3 text-yellow-400 mr-1 inline" fill="currentColor" />
                {movie.rating.toFixed(1)}
              </span>
              {movie.likes !== undefined && (
                <span className="flex items-center text-xs">
                  <ThumbsUp className="h-3 w-3 text-netflix-red mr-1 inline" />
                  {movie.likes}
                </span>
              )}
            </div>
          </div>
          
          <h3 className="text-sm font-bold line-clamp-2">{movie.title}</h3>
          
          <div className="mt-2 flex items-center">
            <span className="px-1.5 py-0.5 text-[10px] border border-white/30">{movie.quality}</span>
            <div className="ml-auto bg-netflix-red p-1">
              <Play className="h-3 w-3" fill="white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
