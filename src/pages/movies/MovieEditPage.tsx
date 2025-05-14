import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, Movie, Genre } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";

export default function MovieEditPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseYear: 2023,
    duration: 120,
    posterUrl: "",
    coverUrl: "",
    rating: 8.0,
    featured: false,
    status: "published" as const
  });
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
          setFormData({
            title: movieData.title,
            description: movieData.description,
            releaseYear: movieData.releaseYear,
            duration: movieData.duration,
            posterUrl: movieData.posterUrl,
            coverUrl: movieData.coverUrl,
            rating: movieData.rating,
            featured: movieData.featured,
            status: movieData.status,
          });
          setSelectedGenres(movieData.genreIds);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedGenres([...selectedGenres, value]);
    } else {
      setSelectedGenres(selectedGenres.filter(genreId => genreId !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;
      
      await api.movies.update(id, {
        ...formData,
        genreIds: selectedGenres,
      });
      
      navigate(`/movies/${id}`);
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

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
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/movies/${id}`)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Edit Movie</h1>
            <p className="text-muted-foreground">{movie.title}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Movie title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="releaseYear" className="text-sm font-medium">
              Release Year
            </label>
            <Input
              id="releaseYear"
              name="releaseYear"
              type="number"
              min="1900"
              max="2099"
              value={formData.releaseYear}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="text-sm font-medium">
              Duration (minutes)
            </label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="rating" className="text-sm font-medium">
              Rating
            </label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="posterUrl" className="text-sm font-medium">
              Poster URL
            </label>
            <Input
              id="posterUrl"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/poster.jpg"
            />
            {formData.posterUrl && (
              <div className="mt-2 h-20 w-16 overflow-hidden rounded">
                <img
                  src={formData.posterUrl}
                  alt="Poster preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="coverUrl" className="text-sm font-medium">
              Cover URL
            </label>
            <Input
              id="coverUrl"
              name="coverUrl"
              value={formData.coverUrl}
              onChange={handleInputChange}
              required
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Movie description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="space-y-2 flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <Input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
              Featured Movie
            </label>
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium">Genres</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 border rounded-md">
              {genres.map((genre) => (
                <label key={genre.id} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Input
                    type="checkbox"
                    value={genre.id}
                    checked={selectedGenres.includes(genre.id)}
                    onChange={handleGenreChange}
                    className="h-4 w-4"
                  />
                  {genre.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/movies/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Update Movie
          </Button>
        </div>
      </form>
    </div>
  );
} 