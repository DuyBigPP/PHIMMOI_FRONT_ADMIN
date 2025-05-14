import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, Movie, Genre } from "@/services/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Play, Clock, Star, Eye, Calendar, Award } from "lucide-react";

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        
        const [movieData, genresData] = await Promise.all([
          api.movies.getById(id),
          api.genres.getAll()
        ]);

        if (movieData) {
          setMovie(movieData);
        }
        
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!movie || !id) return;
    
    if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      try {
        await api.movies.delete(id);
        navigate('/movies');
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  // Filter genres to get only those related to this movie
  const movieGenres = genres.filter(genre => movie?.genreIds.includes(genre.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-lg text-muted-foreground">Movie not found</div>
        <Button onClick={() => navigate('/movies')}>
          Back to Movies
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
            onClick={() => navigate('/movies')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">{movie.title}</h1>
            <p className="text-muted-foreground">
              {movie.releaseYear} • {movieGenres.map(g => g.name).join(', ')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/movies/${id}/edit`)}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden border">
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-md bg-muted p-3 flex flex-col items-center justify-center">
                <Star className="h-5 w-5 mb-1 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Rating</span>
                <span className="font-bold">{movie.rating}/10</span>
              </div>
              <div className="rounded-md bg-muted p-3 flex flex-col items-center justify-center">
                <Eye className="h-5 w-5 mb-1 text-blue-500" />
                <span className="text-sm text-muted-foreground">Views</span>
                <span className="font-bold">{movie.views.toLocaleString()}</span>
              </div>
              <div className="rounded-md bg-muted p-3 flex flex-col items-center justify-center">
                <Clock className="h-5 w-5 mb-1 text-green-500" />
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-bold">{movie.duration} min</span>
              </div>
              <div className="rounded-md bg-muted p-3 flex flex-col items-center justify-center">
                <Calendar className="h-5 w-5 mb-1 text-purple-500" />
                <span className="text-sm text-muted-foreground">Year</span>
                <span className="font-bold">{movie.releaseYear}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Status</h3>
              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                movie.status === 'published' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : movie.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}
              </div>
              
              {movie.featured && (
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>Featured Movie</span>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movieGenres.map(genre => (
                  <span 
                    key={genre.id}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Last Updated</h3>
              <div className="text-sm text-muted-foreground">
                {new Date(movie.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg overflow-hidden border">
            <div className="relative pb-[56.25%] bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                    <Play className="h-6 w-6" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Play Trailer</span>
                </div>
              </div>
              <img 
                src={movie.coverUrl} 
                alt={`${movie.title} cover`} 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Overview</h2>
            <p className="text-base text-card-foreground">
              {movie.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Cast & Crew</h2>
            <p className="text-muted-foreground">Cast and crew information will be available soon.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Related Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {genres.slice(0, 3).map(genre => (
                <div key={genre.id} className="rounded-md border overflow-hidden group">
                  <div className="aspect-[2/3] relative">
                    <img 
                      src={`https://placehold.co/300x450?text=Related`} 
                      alt="Related movie" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="text-sm font-medium truncate">Related Movie</h4>
                    <p className="text-xs text-muted-foreground">{genre.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 