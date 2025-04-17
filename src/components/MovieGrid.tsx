
import { useStore } from "@/store/store";
import MovieCard from "./MovieCard";
import { ContentType } from "@/store/store";
import { useEffect } from "react";

const MovieGrid = () => {
  const { filteredMovies, activeTab, applyFilters, movies } = useStore();
  
  // Re-apply filters when the component mounts to ensure latest content is shown
  // Also add movies as a dependency to ensure we update when new movies are added
  useEffect(() => {
    console.log("MovieGrid: Re-applying filters, total movies:", movies.length);
    applyFilters();
  }, [applyFilters, movies]); // Add movies as a dependency to re-render when movies change
  
  const contentTypeLabel: Record<ContentType, string> = {
    movie: "movies",
    series: "series"
  };
  
  return (
    <div className="container mx-auto px-4 md:px-6 pb-16">
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredMovies.map(movie => (
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
