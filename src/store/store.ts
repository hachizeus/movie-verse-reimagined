
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
  movies: [
    {
      id: 1,
      title: 'Alice Through the Looking Glass',
      year: 2016,
      rating: 6.5,
      genres: ['Family', 'Fantasy', 'Adventure'],
      synopsis: 'Alice returns to the whimsical world of Wonderland and travels back in time to help the Mad Hatter.',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80',
      quality: '4K',
      isFeatured: true,
      type: 'movie'
    },
    {
      id: 2,
      title: 'X-Men: Apocalypse',
      year: 2016,
      rating: 7.1,
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      synopsis: 'After the re-emergence of the world\'s first mutant, the X-Men must unite to defeat his extinction level plan.',
      posterUrl: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1624462966581-6eb1f32560d6?auto=format&fit=crop&q=80',
      quality: 'UHD',
      type: 'movie'
    },
    {
      id: 3,
      title: 'The Jungle Book',
      year: 2016,
      rating: 7.6,
      genres: ['Adventure', 'Drama', 'Family'],
      synopsis: 'After a threat from the tiger Shere Khan forces him to flee the jungle, a man-cub named Mowgli embarks on a journey of self discovery.',
      posterUrl: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
      quality: 'HD',
      type: 'movie'
    },
    {
      id: 4,
      title: 'Captain America: Civil War',
      year: 2016,
      rating: 7.8,
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      synopsis: 'Political involvement in the Avengers\' affairs causes a rift between Captain America and Iron Man.',
      posterUrl: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1569701813229-33284b643e3c?auto=format&fit=crop&q=80',
      quality: '4K',
      type: 'movie'
    },
    {
      id: 5,
      title: 'Stranger Things',
      year: 2016,
      rating: 8.5,
      genres: ['Drama', 'Fantasy', 'Horror'],
      synopsis: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
      posterUrl: 'https://images.unsplash.com/photo-1580130379624-3a069adbf713?auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1461696114087-397271a7aedc?auto=format&fit=crop&q=80',
      quality: 'UHD',
      type: 'series'
    },
    {
      id: 6,
      title: 'The Crown',
      year: 2016,
      rating: 8.7,
      genres: ['Drama', 'History'],
      synopsis: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
      posterUrl: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80',
      quality: '4K',
      type: 'series'
    },
    {
      id: 7,
      title: 'Narcos',
      year: 2015,
      rating: 8.8,
      genres: ['Crime', 'Drama', 'Thriller'],
      synopsis: 'A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.',
      posterUrl: 'https://images.unsplash.com/photo-1560759226-14da22a643ef?auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&q=80',
      quality: 'HD',
      type: 'series'
    },
    {
      id: 8,
      title: 'The Revenant',
      year: 2015,
      rating: 8.0,
      genres: ['Action', 'Adventure', 'Drama'],
      synopsis: 'A frontiersman on a fur trading expedition in the 1820s fights for survival after being mauled by a bear and left for dead by members of his own hunting team.',
      posterUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80',
      quality: '4K',
      type: 'movie'
    }
  ],
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
    
    const updatedMovies = [newMovie, ...state.movies];
    
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
      console.log("Fetching movies from Supabase...");
      const { data, error } = await supabase
        .from('movies')
        .select('*');
        
      if (error) {
        console.error("Error fetching movies:", error);
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
          genres: movie.genres || [],
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
        
        set({ movies: transformedMovies });
        setTimeout(() => {
          get().applyFilters();
          get().updateMovieCategories();
        }, 0);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    }
  },
  
  setCookieConsent: (consent) => {
    localStorage.setItem('cookieConsent', consent ? 'true' : 'false');
    set({ cookieConsent: consent });
  }
}));

// Initialize by fetching movies from Supabase
const initializeStore = async () => {
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
