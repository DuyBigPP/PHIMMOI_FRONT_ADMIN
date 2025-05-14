import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, Movie } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Film, Plus, Edit, Trash2, Eye } from "lucide-react";

export default function MoviesListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await api.movies.getAll();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await api.movies.delete(id);
        setMovies(movies.filter(movie => movie.id !== id));
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Movies</h1>
          <p className="text-muted-foreground">Manage your movie catalog</p>
        </div>
        <Button onClick={() => navigate('/movies/add')} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Movie
        </Button>
      </header>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Movie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No movies found. Add your first movie to get started.
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie.id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{movie.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {movie.duration} min
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{movie.releaseYear}</td>
                    <td className="px-4 py-3 text-sm">{movie.rating}/10</td>
                    <td className="px-4 py-3 text-sm">
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        movie.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : movie.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{movie.views.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/movies/${movie.id}`)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/movies/${movie.id}/edit`)}
                          title="Edit movie"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(movie.id)}
                          title="Delete movie"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 