import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, Genre } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, X, Save, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGenre, setCurrentGenre] = useState<Partial<Genre>>({
    name: "",
    slug: "",
    description: ""
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

  const handleDialogOpen = (genre?: Genre) => {
    if (genre) {
      setIsEditing(true);
      setCurrentGenre({
        id: genre.id,
        name: genre.name,
        slug: genre.slug,
        description: genre.description
      });
    } else {
      setIsEditing(false);
      setCurrentGenre({
        name: "",
        slug: "",
        description: ""
      });
    }
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentGenre({
      name: "",
      slug: "",
      description: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentGenre({
      ...currentGenre,
      [name]: value
    });

    // Auto-generate slug when name changes if it's a new genre
    if (name === 'name' && !isEditing) {
      setCurrentGenre(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentGenre.id) {
        await api.genres.update(currentGenre.id, currentGenre);
        setGenres(genres.map(g => g.id === currentGenre.id ? { ...g, ...currentGenre } as Genre : g));
      } else {
        const newGenre = await api.genres.create(currentGenre as Omit<Genre, 'id' | 'movieCount'>);
        setGenres([...genres, newGenre]);
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error saving genre:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this genre?")) {
      try {
        await api.genres.delete(id);
        setGenres(genres.filter(genre => genre.id !== id));
      } catch (error) {
        console.error("Error deleting genre:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading genres...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Genres</h1>
          <p className="text-muted-foreground">Manage movie categories and genres</p>
        </div>
        <Button onClick={() => handleDialogOpen()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Genre
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre) => (
          <div key={genre.id} className="rounded-lg border bg-card shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{genre.name}</h3>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDialogOpen(genre)}
                    title="Edit genre"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(genre.id)}
                    title="Delete genre"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="mt-2 text-sm text-muted-foreground">
                {genre.description.length > 120 
                  ? `${genre.description.substring(0, 120)}...` 
                  : genre.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Slug: {genre.slug}</span>
                <span className="font-medium">{genre.movieCount} movies</span>
              </div>
            </div>
            <div className="bg-muted/50 p-4 border-t">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full"
                onClick={() => navigate(`/genres/${genre.id}`)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
        
        {genres.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No genres found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Add your first genre to start organizing your movies
            </p>
            <Button onClick={() => handleDialogOpen()}>
              <Plus className="mr-2 h-4 w-4" /> Add Genre
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Genre" : "Add New Genre"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={currentGenre.name}
                onChange={handleInputChange}
                required
                placeholder="Genre name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug
              </label>
              <Input
                id="slug"
                name="slug"
                value={currentGenre.slug}
                onChange={handleInputChange}
                required
                placeholder="genre-slug"
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers, and hyphens only"
              />
              <p className="text-xs text-muted-foreground">
                Used in URLs. Only lowercase letters, numbers, and hyphens.
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={currentGenre.description}
                onChange={handleInputChange}
                required
                placeholder="Genre description"
                rows={4}
              />
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={handleDialogClose}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> {isEditing ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 