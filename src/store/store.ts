
import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";

// Change from enum to string union type to make it more flexible
export type Genre = 'Action' | 'Adventure' | 'Animation' | 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Family' | 'Fantasy' | 'Horror' | 'Sci-Fi' | 'Thriller' | 'History' | string;
export type ContentType = 'movie' | 'series';

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  genres: Genre[];
  synopsis: string;
  description?: string;
  posterUrl: string;
  backdropUrl: string;
  quality: 'HD' | '4K' | 'UHD' | string;
  isFeatured?: boolean;
  type: ContentType;
  likes?: number;
  trailer_url?: string;
}

interface StoreState {
  movies: Movie[];
  filteredMovies: Movie[];
  activeTab: ContentType;
  filters: {
    year: number | null;
    genre: Genre | null;
    rating: number | null;
    sortBy: 'newest' | 'oldest' | 'top-rated' | 'alphabetical' | 'most-liked';
  };
  searchQuery: string;
  cookieConsent: boolean | null;
  latestMovies: Movie[];
  topRatedMovies: Movie[];
  isLoading: boolean;
  setActiveTab: (tab: ContentType) => void;
  setYearFilter: (year: number | null) => void;
  setGenreFilter: (genre: Genre | null) => void;
  setRatingFilter: (rating: number | null) => void;
  setSortBy: (sortOption: 'newest' | 'oldest' | 'top-rated' | 'alphabetical' | 'most-liked') => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setCookieConsent: (consent: boolean) => void;
  addMovie: (movie: Movie) => void;
  likeMovie: (movieId: number) => void;
  unlikeMovie: (movieId: number) => void;
  updateMovieCategories: () => void;
  fetchMoviesFromSupabase: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  movies: [],
  filteredMovies: [],
  activeTab: 'movie',
  filters: {
    year: null,
    genre: null,
    rating: null,
    sortBy: 'newest'
  },
  searchQuery: '',
  cookieConsent: null,
  latestMovies: [],
  topRatedMovies: [],
  isLoading: true,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setYearFilter: (year) => set(state => ({
    filters: {
      ...state.filters,
      year
    }
  })),
  
  setGenreFilter: (genre) => set(state => ({
    filters: {
      ...state.filters,
      genre
    }
  })),
  
  setRatingFilter: (rating) => set(state => ({
    filters: {
      ...state.filters,
      rating
    }
  })),
  
  setSortBy: (sortOption) => set(state => ({
    filters: {
      ...state.filters,
      sortBy: sortOption
    }
  })),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  resetFilters: () => set({
    filters: {
      year: null,
      genre: null,
      rating: null,
      sortBy: 'newest'
    },
    searchQuery: ''
  }),
  
  addMovie: (movie) => set(state => {
    console.log("Store: Adding new movie", movie);
    
    // Make sure all required fields are set
    const newMovie: Movie = {
      ...movie,
      rating: movie.rating || 7.0,
      synopsis: movie.synopsis || movie.description || '',
      likes: movie.likes || 0,
    };
    
    // Check if the movie already exists in the store (by ID)
    const existingIndex = state.movies.findIndex(m => m.id === movie.id);
    let updatedMovies = [...state.movies];
    
    if (existingIndex >= 0) {
      // Replace existing movie
      updatedMovies[existingIndex] = newMovie;
      console.log("Updated existing movie in store");
    } else {
      // Add new movie
      updatedMovies = [newMovie, ...state.movies];
      console.log("Added new movie to store");
    }
    
    setTimeout(() => {
      console.log("Store: Re-applying filters after adding movie");
      get().applyFilters();
      get().updateMovieCategories();
    }, 0);
    
    return { movies: updatedMovies };
  }),
  
  likeMovie: (movieId) => set(state => {
    const updatedMovies = state.movies.map(movie => 
      movie.id === movieId
        ? { ...movie, likes: (movie.likes || 0) + 1, rating: Math.min(10, (movie.rating || 7) + 0.1) }
        : movie
    );
    
    setTimeout(() => {
      get().applyFilters();
      get().updateMovieCategories();
    }, 0);
    
    return { movies: updatedMovies };
  }),
  
  unlikeMovie: (movieId) => set(state => {
    const updatedMovies = state.movies.map(movie => 
      movie.id === movieId
        ? { 
            ...movie, 
            likes: Math.max(0, (movie.likes || 0) - 1),
            rating: Math.max(0, (movie.rating || 7) - 0.1)
          }
        : movie
    );
    
    setTimeout(() => {
      get().applyFilters();
      get().updateMovieCategories();
    }, 0);
    
    return { movies: updatedMovies };
  }),
  
  updateMovieCategories: () => set(state => {
    const { movies, activeTab } = state;
    
    // Filter by active tab (movie or series)
    const filteredByType = movies.filter(movie => movie.type === activeTab);
    
    // Get latest movies (by year, newest first)
    const latest = [...filteredByType]
      .sort((a, b) => b.year - a.year)
      .slice(0, 10);
      
    // Get top rated movies
    const topRated = [...filteredByType]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
      
    return {
      latestMovies: latest,
      topRatedMovies: topRated
    };
  }),
  
  applyFilters: () => {
    const { movies, filters, searchQuery, activeTab } = get();
    
    let filtered = [...movies];
    console.log("Applying filters on", movies.length, "movies, active tab:", activeTab);
    
    filtered = filtered.filter(movie => movie.type === activeTab);
    
    if (searchQuery) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filters.year) {
      filtered = filtered.filter(movie => movie.year === filters.year);
    }
    
    if (filters.genre) {
      filtered = filtered.filter(movie => 
        movie.genres.includes(filters.genre as Genre)
      );
    }
    
    if (filters.rating) {
      filtered = filtered.filter(movie => movie.rating >= filters.rating);
    }
    
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.year - b.year);
        break;
      case 'top-rated':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'most-liked':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
    }
    
    console.log("Filtered movies count:", filtered.length);
    set({ filteredMovies: filtered });
  },
  
  fetchMoviesFromSupabase: async () => {
    try {
      set({ isLoading: true });
      console.log("Fetching movies from Supabase...");
      const { data, error } = await supabase
        .from('movies')
        .select('*');
        
      if (error) {
        console.error("Error fetching movies:", error);
        set({ isLoading: false });
        return;
      }
      
      if (data && data.length > 0) {
        console.log("Fetched", data.length, "movies from Supabase");
        
        // Transform the data to match our Movie interface
        const transformedMovies: Movie[] = data.map(movie => ({
          id: movie.id,
          title: movie.title,
          year: movie.year || new Date().getFullYear(),
          rating: movie.rating || 7.0,
          genres: Array.isArray(movie.genres) ? movie.genres : [],
          synopsis: movie.description || '',
          description: movie.description || '',
          posterUrl: movie.poster_url || '',
          backdropUrl: movie.backdrop_url || '',
          quality: (movie.quality as 'HD' | '4K' | 'UHD') || 'HD',
          isFeatured: movie.is_featured || false,
          type: (movie.type as ContentType) || 'movie',
          likes: 0,
          trailer_url: movie.trailer_url || '',
        }));
        
        console.log("Transformed movies:", transformedMovies);
        set({ movies: transformedMovies, isLoading: false });
        
        // Apply filters and update categories right away
        setTimeout(() => {
          get().applyFilters();
          get().updateMovieCategories();
        }, 0);
      } else {
        console.log("No movies found in Supabase");
        set({ isLoading: false });
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      set({ isLoading: false });
    }
  },
  
  setCookieConsent: (consent) => {
    localStorage.setItem('cookieConsent', consent ? 'true' : 'false');
    set({ cookieConsent: consent });
  }
}));

// Initialize by fetching movies from Supabase
const initializeStore = async () => {
  console.log("Initializing store and fetching movies...");
  await useStore.getState().fetchMoviesFromSupabase();
  
  // Initialize movie categories and apply filters
  useStore.getState().updateMovieCategories();
  useStore.getState().applyFilters();
  
  const storedConsent = localStorage.getItem('cookieConsent');
  if (storedConsent) {
    useStore.getState().setCookieConsent(storedConsent === 'true');
  }
};

initializeStore();
