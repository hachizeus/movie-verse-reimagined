
import MovieCard from "./MovieCard";
import { Movie, useStore } from "@/store/store";

interface MovieGridProps {
  movies?: Movie[];
}

const MovieGrid = ({ movies }: MovieGridProps) => {
  const { activeTab, filteredMovies } = useStore();
  
  // Use provided movies or fall back to filtered movies from store
  const displayMovies = movies || filteredMovies;
  
  const contentTypeLabel: Record<'movie' | 'series', string> = {
    movie: "movies",
    series: "series"
  };
  
  return (
    <div className="container mx-auto px-4 md:px-6">
      {displayMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {displayMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-netflix-lightgray">No {contentTypeLabel[activeTab]} found with the selected filters</h3>
          <p className="text-netflix-gray mt-2">Try different filters or clear the search</p>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
