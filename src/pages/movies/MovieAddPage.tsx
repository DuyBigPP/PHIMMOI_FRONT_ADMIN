import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, Genre } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";

export default function MovieAddPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseYear: new Date().getFullYear(),
    duration: 120,
    posterUrl: "https://placehold.co/300x450?text=New+Movie",
    coverUrl: "https://placehold.co/1200x600?text=New+Movie+Cover",
    rating: 8.0,
    featured: false,
    status: "draft" as const
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await api.genres.getAll();
        setGenres(data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

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
      setSelectedGenres(selectedGenres.filter(id => id !== value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.movies.create({
        ...formData,
        genreIds: selectedGenres,
        views: 0,
      });
      navigate('/movies');
    } catch (error) {
      console.error("Error creating movie:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading...</div>
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
            onClick={() => navigate('/movies')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Add New Movie</h1>
            <p className="text-muted-foreground">Add a new movie to your catalog</p>
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
            onClick={() => navigate('/movies')}
          >
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" /> Save Movie
          </Button>
        </div>
      </form>
    </div>
  );
} 