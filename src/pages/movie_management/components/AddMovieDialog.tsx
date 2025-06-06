import { useState, useEffect, useRef } from 'react';
import { MovieCreateRequest, MovieUpdateRequest, MovieResponse, CategoryStats, CountryStats, EpisodeCreateRequest, EpisodeUpdateRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  X, 
  Check, 
  ChevronsUpDown,
  Image as ImageIcon,
  Film,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EpisodeManagement } from './EpisodeManagement';
import { useMovieEpisodes } from '../hooks/useMovieEpisodes';

interface AddMovieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: MovieCreateRequest | MovieUpdateRequest) => Promise<void>;
  editingMovie?: MovieResponse | null;
  loading?: boolean;
  categories: CategoryStats[];
  countries: CountryStats[];
}

export function AddMovieDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editingMovie, 
  loading = false,
  categories,
  countries
}: AddMovieDialogProps) {
  const [activeTab, setActiveTab] = useState('movie');
  const [savedMovieId, setSavedMovieId] = useState<string | null>(null);
    // Episode management hooks
  const {
    episodes,
    loading: episodesLoading,
    loadEpisodes,
    addEpisode,
    updateEpisode,
    deleteEpisode,
  } = useMovieEpisodes();

  // Wrapper functions to handle return type mismatch
  const handleAddEpisode = async (data: EpisodeCreateRequest): Promise<void> => {
    await addEpisode(data);
  };

  const handleUpdateEpisode = async (data: EpisodeUpdateRequest): Promise<void> => {
    await updateEpisode(data);
  };

  const handleDeleteEpisode = async (episodeId: string): Promise<void> => {
    await deleteEpisode(episodeId);
  };
  const [formData, setFormData] = useState<Partial<MovieCreateRequest>>({
    name: '',
    slug: '',
    originName: '',
    content: '',
    type: 'movie',
    status: 'completed',
    year: new Date().getFullYear(),
    categories: [],
    countries: [],
    actors: [],
    isCopyright: false,
    subDocquyen: false,
    chieurap: false,
    time: '',
    episodeCurrent: '',
    episodeTotal: '',
    quality: 'HD',
    lang: 'Vietsub',
    notify: '',
    showtimes: '',
    trailerUrl: ''
  });

  const [posterPreview, setPosterPreview] = useState<string>('');
  const [thumbPreview, setThumbPreview] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [newActor, setNewActor] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [openCategoryCombobox, setOpenCategoryCombobox] = useState(false);
  const [openCountryCombobox, setOpenCountryCombobox] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setOpenCategoryCombobox(false);
      }
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setOpenCountryCombobox(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset form when dialog opens/closes or editing movie changes
  useEffect(() => {
    if (open) {
      if (editingMovie) {
        // Populate form with editing movie data
        setFormData({
          name: editingMovie.name,
          slug: editingMovie.slug,
          originName: editingMovie.originName,
          content: editingMovie.content || '',
          type: editingMovie.type as 'movie' | 'series' | 'hoathinh',
          status: editingMovie.status as 'completed' | 'ongoing',
          year: editingMovie.year,
          categories: editingMovie.categories?.map(cat => cat.category.slug) || [],
          countries: editingMovie.countries?.map(country => country.country.slug) || [],
          actors: [],
          time: '',
          episodeCurrent: '',
          episodeTotal: '',
          quality: 'HD',
          lang: 'Vietsub',
          notify: '',
          showtimes: '',
          trailerUrl: ''
        });        setSelectedCategories(editingMovie.categories?.map(cat => cat.category.slug) || []);
        setSelectedCountries(editingMovie.countries?.map(country => country.country.slug) || []);
        setSelectedActors([]);
        setPosterPreview(editingMovie.posterUrl || '');
        setThumbPreview(editingMovie.thumbUrl || '');        setSavedMovieId(editingMovie.id);
        // Load episodes for this movie using slug
        loadEpisodes(editingMovie.slug);
        // If it's a series, show episodes tab
        if (editingMovie.type === 'series') {
          setActiveTab('episodes');
        } else {
          setActiveTab('movie');
        }
      } else {
        // Reset form for new movie
        setFormData({
          name: '',
          slug: '',
          originName: '',
          content: '',
          type: 'movie',
          status: 'completed',
          year: new Date().getFullYear(),
          categories: [],
          countries: [],
          actors: [],
          isCopyright: false,
          subDocquyen: false,
          chieurap: false,
          time: '',
          episodeCurrent: '',
          episodeTotal: '',
          quality: 'HD',
          lang: 'Vietsub',
          notify: '',
          showtimes: '',
          trailerUrl: ''
        });        setSelectedCategories([]);
        setSelectedCountries([]);
        setSelectedActors([]);
        setPosterPreview('');
        setThumbPreview('');
        setSavedMovieId(null);
        setActiveTab('movie');
      }
    }
  }, [open, editingMovie, loadEpisodes]);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  const handleInputChange = (field: string, value: string | number | boolean | File | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));    // Auto-generate slug when name changes
    if (field === 'name' && typeof value === 'string' && value) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleFileChange = (field: 'poster' | 'thumb', file: File | null) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === 'poster') {
          setPosterPreview(e.target?.result as string);
        } else {
          setThumbPreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: undefined
      }));
      
      if (field === 'poster') {
        setPosterPreview('');
      } else {
        setThumbPreview('');
      }
    }
  };  const handleCategorySelect = (categorySlug: string) => {
    const newCategories = selectedCategories.includes(categorySlug)
      ? selectedCategories.filter(slug => slug !== categorySlug)
      : [...selectedCategories, categorySlug];
    
    setSelectedCategories(newCategories);
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }));
    // Keep the popover open for multi-selection by not changing the state
  };

  const handleCountrySelect = (countrySlug: string) => {
    const newCountries = selectedCountries.includes(countrySlug)
      ? selectedCountries.filter(slug => slug !== countrySlug)
      : [...selectedCountries, countrySlug];
    
    setSelectedCountries(newCountries);
    setFormData(prev => ({
      ...prev,
      countries: newCountries
    }));
    // Keep the popover open for multi-selection by not changing the state
  };

  const handleAddActor = () => {
    if (newActor.trim() && !selectedActors.includes(newActor.trim())) {
      const newActors = [...selectedActors, newActor.trim()];
      setSelectedActors(newActors);
      setFormData(prev => ({
        ...prev,
        actors: newActors
      }));
      setNewActor('');
    }
  };

  const handleRemoveActor = (actor: string) => {
    const newActors = selectedActors.filter(a => a !== actor);
    setSelectedActors(newActors);
    setFormData(prev => ({
      ...prev,
      actors: newActors
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug || !formData.originName || !formData.content) {
      return;
    }    try {
      const submitData = editingMovie 
        ? { ...formData, id: editingMovie.id } as MovieUpdateRequest
        : formData as MovieCreateRequest;
      
      await onSave(submitData);
        // If this is a new movie and it's a series, switch to episodes tab
      if (!editingMovie && formData.type === 'series') {
        // For new movies, we'll need to implement a way to get the created movie ID
        // For now, keep the dialog open so user can manually switch to episodes
        setActiveTab('episodes');
      } else {
        onOpenChange(false);
      }
    } catch {
      // Error handling is done in parent component
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            {editingMovie ? 'Edit Movie' : 'Add New Movie'}
          </DialogTitle>
          <DialogDescription>
            {editingMovie 
              ? 'Update movie information and manage episodes' 
              : 'Fill in the details to add a new movie to the database.'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="movie" className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Movie Details
            </TabsTrigger>
            <TabsTrigger 
              value="episodes" 
              className="flex items-center gap-2"
              disabled={!savedMovieId && !editingMovie}
            >
              <Play className="h-4 w-4" />
              Episodes {episodes.length > 0 && `(${episodes.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movie">
            <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Movie Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter movie name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="movie-slug"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originName">Original Name *</Label>
              <Input
                id="originName"
                value={formData.originName}
                onChange={(e) => handleInputChange('originName', e.target.value)}
                placeholder="Enter original name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="1900"
                max={new Date().getFullYear() + 5}
                required
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Synopsis *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter movie synopsis..."
              rows={4}
              required
            />
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                  <SelectItem value="hoathinh">Animation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select
                value={formData.quality}
                onValueChange={(value) => handleInputChange('quality', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HD">HD</SelectItem>
                  <SelectItem value="FullHD">FullHD</SelectItem>
                  <SelectItem value="4K">4K</SelectItem>
                  <SelectItem value="CAM">CAM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Poster Upload */}
            <div className="space-y-2">
              <Label>Poster Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {posterPreview ? (
                  <div className="relative">
                    <img
                      src={posterPreview}
                      alt="Poster preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleFileChange('poster', null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-2">
                      <Label htmlFor="poster" className="cursor-pointer">
                        <span className="text-sm font-medium text-primary hover:underline">
                          Click to upload poster
                        </span>
                        <Input
                          id="poster"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange('poster', e.target.files?.[0] || null)}
                        />
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <Label>Thumbnail Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                {thumbPreview ? (
                  <div className="relative">
                    <img
                      src={thumbPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleFileChange('thumb', null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-2">
                      <Label htmlFor="thumb" className="cursor-pointer">
                        <span className="text-sm font-medium text-primary hover:underline">
                          Click to upload thumbnail
                        </span>
                        <Input
                          id="thumb"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange('thumb', e.target.files?.[0] || null)}
                        />
                      </Label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>          {/* Categories and Countries Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            {/* Categories Selection */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="relative" ref={categoryRef}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setOpenCategoryCombobox(!openCategoryCombobox)}
                >
                  {selectedCategories.length > 0
                    ? `${selectedCategories.length} categories selected`
                    : "Select categories..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                {openCategoryCombobox && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-64 overflow-auto">
                    <div className="p-2 border-b">
                      <Input
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="p-1">
                      {categories
                        .filter(category => 
                          category.name && 
                          category.slug && 
                          category.name.trim() !== "" && 
                          category.slug.trim() !== "" &&
                          category.name.toLowerCase().includes(categorySearch.toLowerCase())
                        )
                        .map((category) => (
                          <div
                            key={category.slug}
                            className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleCategorySelect(category.slug)}
                          >
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedCategories.includes(category.slug) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span>{category.name} ({category.movieCount} movies)</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map((slug) => {
                    const category = categories.find(cat => cat.slug === slug);
                    return (
                      <Badge key={slug} variant="secondary" className="flex items-center gap-1">
                        {category?.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleCategorySelect(slug)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>            {/* Countries Selection */}
            <div className="space-y-2">
              <Label>Countries</Label>
              <div className="relative" ref={countryRef}>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setOpenCountryCombobox(!openCountryCombobox)}
                >
                  {selectedCountries.length > 0
                    ? `${selectedCountries.length} countries selected`
                    : "Select countries..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                {openCountryCombobox && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-64 overflow-auto">
                    <div className="p-2 border-b">
                      <Input
                        placeholder="Search countries..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="p-1">
                      {countries
                        .filter(country => 
                          country.name && 
                          country.slug && 
                          country.name.trim() !== "" && 
                          country.slug.trim() !== "" &&
                          country.name.toLowerCase().includes(countrySearch.toLowerCase())
                        )
                        .map((country) => (
                          <div
                            key={country.slug}
                            className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                            onClick={() => handleCountrySelect(country.slug)}
                          >
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedCountries.includes(country.slug) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span>{country.name} ({country.movieCount} movies)</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              {selectedCountries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCountries.map((slug) => {
                    const country = countries.find(c => c.slug === slug);
                    return (
                      <Badge key={slug} variant="secondary" className="flex items-center gap-1">
                        {country?.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleCountrySelect(slug)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Actors */}
          <div className="space-y-2">
            <Label>Actors</Label>
            <div className="flex gap-2">
              <Input
                value={newActor}
                onChange={(e) => setNewActor(e.target.value)}
                placeholder="Enter actor name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddActor();
                  }
                }}
              />
              <Button type="button" onClick={handleAddActor}>
                Add
              </Button>
            </div>
            {selectedActors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedActors.map((actor) => (
                  <Badge key={actor} variant="outline" className="flex items-center gap-1">
                    {actor}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveActor(actor)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Duration</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                placeholder="e.g., 120 phút"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lang">Language</Label>
              <Select
                value={formData.lang}
                onValueChange={(value) => handleInputChange('lang', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vietsub">Vietsub</SelectItem>
                  <SelectItem value="Thuyết minh">Thuyết minh</SelectItem>
                  <SelectItem value="Lồng tiếng">Lồng tiếng</SelectItem>
                  <SelectItem value="Engsub">Engsub</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* For Series */}
          {formData.type === 'series' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="episodeCurrent">Current Episode</Label>
                <Input
                  id="episodeCurrent"
                  value={formData.episodeCurrent}
                  onChange={(e) => handleInputChange('episodeCurrent', e.target.value)}
                  placeholder="e.g., Tập 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="episodeTotal">Total Episodes</Label>
                <Input
                  id="episodeTotal"
                  value={formData.episodeTotal}
                  onChange={(e) => handleInputChange('episodeTotal', e.target.value)}
                  placeholder="e.g., 24/24"
                />
              </div>
            </div>
          )}

          {/* Trailer URL */}
          <div className="space-y-2">
            <Label htmlFor="trailerUrl">Trailer URL</Label>
            <Input
              id="trailerUrl"
              value={formData.trailerUrl}
              onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          {/* Switches */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isCopyright"
                checked={formData.isCopyright}
                onCheckedChange={(checked) => handleInputChange('isCopyright', checked)}
              />
              <Label htmlFor="isCopyright">Has Copyright</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="subDocquyen"
                checked={formData.subDocquyen}
                onCheckedChange={(checked) => handleInputChange('subDocquyen', checked)}
              />
              <Label htmlFor="subDocquyen">Has Subtitles</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="chieurap"
                checked={formData.chieurap}
                onCheckedChange={(checked) => handleInputChange('chieurap', checked)}
              />
              <Label htmlFor="chieurap">In Theaters</Label>
            </div>
          </div>          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingMovie ? 'Update Movie' : 'Add Movie'}
            </Button>
          </DialogFooter>
        </form>
        </TabsContent>        <TabsContent value="episodes">
          <div className="space-y-4">
            {(savedMovieId || editingMovie) ? (
              <EpisodeManagement
                movieId={savedMovieId || editingMovie!.id}
                movieName={formData.name || editingMovie?.name || 'Movie'}
                episodes={episodes}
                loading={episodesLoading}
                onAddEpisode={handleAddEpisode}
                onUpdateEpisode={handleUpdateEpisode}
                onDeleteEpisode={handleDeleteEpisode}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Save the movie first to manage episodes
              </div>
            )}
          </div>
        </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
