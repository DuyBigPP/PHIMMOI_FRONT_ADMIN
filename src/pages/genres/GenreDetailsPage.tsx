import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, Genre, Movie } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Film, Tag, BarChart } from "lucide-react";

export default function GenreDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        const genreData = await api.genres.getById(id);
        setGenre(genreData || null);
        
        if (genreData) {
          // In a real app, you would have an API endpoint to get movies by genre
          // Here we're using the mock data and filtering it
          const allMovies = await api.movies.getAll();
          const filteredMovies = allMovies.filter(movie => movie.genreIds.includes(id));
          setMovies(filteredMovies);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!genre || !id) return;
    
    if (window.confirm(`Are you sure you want to delete the "${genre.name}" genre?`)) {
      try {
        await api.genres.delete(id);
        navigate('/genres');
      } catch (error) {
        console.error("Error deleting genre:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading genre...</div>
      </div>
    );
  }

  if (!genre) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-lg text-muted-foreground">Genre not found</div>
        <Button onClick={() => navigate('/genres')}>
          Back to Genres
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/genres')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <h1 className="text-3xl font-extrabold text-foreground">{genre.name}</h1>
            </div>
            <p className="text-muted-foreground">
              {genre.movieCount} movies • Slug: {genre.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/genres')}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">
            {genre.description}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Movies in this Genre</h2>
            <span className="text-sm text-muted-foreground">{movies.length} movies</span>
          </div>
          
          {movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Film className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No movies in this genre</h3>
              <p className="text-muted-foreground mt-2 mb-4">
                Add movies to this genre to see them listed here
              </p>
              <Button onClick={() => navigate('/movies/add')}>
                Add Movie
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="rounded-md border overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  <div className="aspect-[2/3] relative">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {movie.featured && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium truncate">{movie.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{movie.releaseYear}</span>
                      <span className="text-xs">{movie.rating}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-md bg-muted p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Movies</div>
                <div className="text-2xl font-bold">{movies.length}</div>
              </div>
              <Film className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="rounded-md bg-muted p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Views</div>
                <div className="text-2xl font-bold">
                  {movies.reduce((total, movie) => total + movie.views, 0).toLocaleString()}
                </div>
              </div>
              <BarChart className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div className="rounded-md bg-muted p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
                <div className="text-2xl font-bold">
                  {movies.length 
                    ? (movies.reduce((total, movie) => total + movie.rating, 0) / movies.length).toFixed(1)
                    : "N/A"}
                </div>
              </div>
              <svg 
                className="h-8 w-8 text-yellow-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-4">Featured Movies</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {movies.filter(m => m.featured).slice(0, 2).map((movie) => (
                <div 
                  key={movie.id}
                  className="flex gap-3 rounded-md border p-3 cursor-pointer"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  <div className="h-20 w-14 overflow-hidden rounded-sm flex-shrink-0">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{movie.title}</h4>
                    <p className="text-xs text-muted-foreground truncate mt-1">{movie.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs">{movie.releaseYear}</span>
                      <span className="text-xs">{movie.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {movies.filter(m => m.featured).length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground">
                  No featured movies in this genre.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 