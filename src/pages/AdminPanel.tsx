import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useStore, Genre, ContentType } from "@/store/store";
import ImageUploader from "@/components/ImageUploader";
import { ArrowLeft } from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addMovie, fetchMoviesFromSupabase } = useStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    genres: "",
    quality: "HD",
    type: "movie",
    poster_url: "",
    backdrop_url: "",
    trailer_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.title || !formData.description || !formData.genres) {
        throw new Error("Title, description, and genres are required fields");
      }
      
      if (!formData.poster_url) {
        throw new Error("Please upload a poster image");
      }
      
      if (!formData.backdrop_url) {
        throw new Error("Please upload a backdrop image");
      }
      
      const genresArray = formData.genres.split(',').map(g => g.trim()) as Genre[];
      
      console.log("Attempting to insert movie with data:", {
        ...formData,
        genres: genresArray,
        year: parseInt(formData.year),
        is_featured: true,
        type: formData.type as ContentType
      });
      
      const { data: movieData, error: movieError } = await supabase.rpc(
        'admin_add_content',
        {
          p_title: formData.title,
          p_description: formData.description,
          p_year: parseInt(formData.year) || null,
          p_genres: genresArray,
          p_quality: formData.quality,
          p_type: formData.type,
          p_poster_url: formData.poster_url,
          p_backdrop_url: formData.backdrop_url,
          p_trailer_url: formData.trailer_url,
          p_is_featured: true
        }
      );

      if (movieError) {
        console.error("Error inserting content:", movieError);
        throw new Error(movieError.message || "Failed to add content");
      }

      const contentId = (movieData && typeof movieData === 'number') ? movieData : 1;
      
      console.log("Movie added successfully with ID:", contentId);

      const { error: notifyError } = await supabase.rpc(
        'notify_all_users', 
        {
          notification_title: `New ${formData.type} Added`,
          notification_message: `Check out "${formData.title}" - now available to watch!`,
          content_id: contentId,
          content_type: formData.type
        }
      );

      if (notifyError) {
        console.error("Error sending notifications:", notifyError);
      }

      const newMovie = {
        id: contentId,
        title: formData.title,
        year: parseInt(formData.year) || new Date().getFullYear(),
        genres: genresArray,
        description: formData.description,
        synopsis: formData.description,
        posterUrl: formData.poster_url,
        backdropUrl: formData.backdrop_url,
        quality: formData.quality as 'HD' | '4K' | 'UHD',
        isFeatured: true,
        type: formData.type as ContentType,
        likes: 0,
        rating: 7.0,
        trailer_url: formData.trailer_url,
      };
      
      console.log("Adding movie to store:", newMovie);
      
      addMovie(newMovie);
      
      await fetchMoviesFromSupabase();

      toast({
        title: "Success",
        description: `${formData.type === 'movie' ? 'Movie' : 'Series'} added successfully`,
      });

      setFormData({
        title: "",
        description: "",
        year: "",
        genres: "",
        quality: "HD",
        type: "movie",
        poster_url: "",
        backdrop_url: "",
        trailer_url: "",
      });
      
      navigate('/');
    } catch (error) {
      console.error("Error in submission:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add content",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePosterUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, poster_url: url }));
  };

  const handleBackdropUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, backdrop_url: url }));
  };

  return (
    <div className="min-h-screen bg-netflix-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 text-white hover:text-netflix-red transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-netflix-darkgray/50 border-netflix-darkgray"
              required
            />
            <Input
              placeholder="Year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="bg-netflix-darkgray/50 border-netflix-darkgray"
            />
            <Input
              placeholder="Genres (comma-separated)"
              value={formData.genres}
              onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
              className="bg-netflix-darkgray/50 border-netflix-darkgray"
              required
            />
            <select
              value={formData.quality}
              onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
              className="bg-netflix-darkgray/50 border-netflix-darkgray rounded-md p-2"
            >
              <option value="HD">HD</option>
              <option value="4K">4K</option>
              <option value="UHD">UHD</option>
            </select>
            
            <Input
              placeholder="Trailer URL"
              value={formData.trailer_url}
              onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
              className="bg-netflix-darkgray/50 border-netflix-darkgray"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="bg-netflix-darkgray/50 border-netflix-darkgray rounded-md p-2"
            >
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
          </div>
          
          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-netflix-darkgray/50 border-netflix-darkgray min-h-[100px]"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader 
              onImageUploaded={handlePosterUploaded}
              label="Poster Image"
              bucket="movieverse"
              folderPath="posters"
            />
            
            <ImageUploader 
              onImageUploaded={handleBackdropUploaded}
              label="Backdrop Image"
              bucket="movieverse"
              folderPath="backdrops"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : `Add ${formData.type === 'movie' ? 'Movie' : 'Series'}`}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
