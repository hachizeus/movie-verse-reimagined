
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useStore, Genre } from "@/store/store";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const FilterSection = () => {
  const { 
    filters,
    setYearFilter, 
    setGenreFilter, 
    setRatingFilter, 
    setSortBy,
    resetFilters,
    applyFilters
  } = useStore();
  
  const [availableYears] = useState(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2000; year--) {
      years.push(year);
    }
    return years;
  });
  
  const genres: Genre[] = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", 
    "Documentary", "Drama", "Family", "Fantasy", "Horror", 
    "Sci-Fi", "Thriller"
  ];
  
  const ratings = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "top-rated", label: "Top Rated" },
    { value: "alphabetical", label: "Alphabetical" }
  ];
  
  useEffect(() => {
    applyFilters();
  }, [filters, applyFilters]);
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
        <h2 className="text-2xl font-bold">Latest Additions</h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Year filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-1 bg-netflix-darkgray rounded hover:bg-netflix-darkgray/80 transition-colors">
              <span className="text-sm font-medium">Year: {filters.year || 'All'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-netflix-dark border border-netflix-darkgray">
              <DropdownMenuItem 
                onClick={() => setYearFilter(null)}
                className="text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray"
              >
                All
              </DropdownMenuItem>
              {availableYears.map(year => (
                <DropdownMenuItem 
                  key={year} 
                  onClick={() => setYearFilter(year)}
                  className="text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray"
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Genre filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-1 bg-netflix-darkgray rounded hover:bg-netflix-darkgray/80 transition-colors">
              <span className="text-sm font-medium">Genre: {filters.genre || 'All'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-netflix-dark border border-netflix-darkgray">
              <DropdownMenuItem 
                onClick={() => setGenreFilter(null)}
                className="text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray"
              >
                All
              </DropdownMenuItem>
              {genres.map(genre => (
                <DropdownMenuItem 
                  key={genre} 
                  onClick={() => setGenreFilter(genre)}
                  className="text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray"
                >
                  {genre}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Rating filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-1 bg-netflix-darkgray rounded hover:bg-netflix-darkgray/80 transition-colors">
              <span className="text-sm font-medium">Rating: {filters.rating ? `${filters.rating}+` : 'All'}</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-netflix-dark border border-netflix-darkgray">
              <DropdownMenuItem 
                onClick={() => setRatingFilter(null)}
                className="text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray"
              >
                All
              </DropdownMenuItem>
              {ratings.map(rating => (
                <DropdownMenuItem 
                  key={rating} 
                  onClick={() => setRatingFilter(rating)}
                  className="text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray"
                >
                  {rating}+
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort by */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-1 bg-netflix-darkgray rounded hover:bg-netflix-darkgray/80 transition-colors">
              <span className="text-sm font-medium">Sort By</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-netflix-dark border border-netflix-darkgray">
              {sortOptions.map(option => (
                <DropdownMenuItem 
                  key={option.value} 
                  onClick={() => setSortBy(option.value as any)}
                  className="text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Reset filters */}
          <button 
            onClick={resetFilters}
            className="px-3 py-1 text-sm font-medium text-netflix-red hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
