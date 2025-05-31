import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCategoryStats, getCountryStats } from "@/services/function";
import { getMovies, createMovie, updateMovieById, deleteMovieById } from "@/services/movieService";
import type { CategoryStats, CountryStats, MovieResponse, MovieCreateRequest, MovieUpdateRequest, Pagination, MovieListParams } from "@/types/api";
import type { FilterValues } from "../components/MovieSearchAndFilters";

export function useMovieManagement() {
  const { toast } = useToast();
  
  // State for dialog management
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [countries, setCountries] = useState<CountryStats[]>([]);
  const [movies, setMovies] = useState<MovieResponse[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MovieResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [moviesLoading, setMoviesLoading] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    type: "all_types",
    category: "all_categories",
    country: "all_countries",
    year: "all_years",
    sort: "latest"
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Load filter data on component mount
  const loadFilterData = useCallback(async () => {
    try {
      const [categoryResponse, countryResponse] = await Promise.all([
        getCategoryStats(),
        getCountryStats(),
      ]);
      
      setCategories((categoryResponse.data || []).filter(cat => 
        cat.name && cat.slug && cat.name.trim() !== "" && cat.slug.trim() !== ""
      ));
      setCountries((countryResponse.data || []).filter(country => 
        country.name && country.slug && country.name.trim() !== "" && country.slug.trim() !== ""
      ));
    } catch (error) {
      console.error("Failed to load filter data:", error);
      toast({
        title: "Error",
        description: "Failed to load categories and countries",
        variant: "destructive",
      });
    }
  }, [toast]);  // Load movies with pagination
  const loadMovies = useCallback(async (page: number = 1, filterParams?: Partial<FilterValues>) => {
    setMoviesLoading(true);
    try {
      const params: Partial<MovieListParams> = { 
        page, 
        limit: 10 
      };
        // Add filter parameters if they exist
      if (filterParams) {
        if (filterParams.search && filterParams.search.trim() !== '') {
          params.search = filterParams.search.trim();
        }
        
        if (filterParams.type && filterParams.type !== '' && filterParams.type !== 'all_types') {
          if (filterParams.type === 'single' || filterParams.type === 'series') {
            params.type = filterParams.type;
          }
        }
        
        if (filterParams.category && filterParams.category !== '' && filterParams.category !== 'all_categories') {
          params.category = filterParams.category;
        }
        
        if (filterParams.country && filterParams.country !== '' && filterParams.country !== 'all_countries') {
          params.country = filterParams.country;
        }
        
        if (filterParams.year && filterParams.year !== '' && filterParams.year !== 'all_years') {
          params.year = parseInt(filterParams.year);
        }
        
        if (filterParams.sort && filterParams.sort !== '') {
          if (['latest', 'popular', 'rating'].includes(filterParams.sort)) {
            params.sort = filterParams.sort as 'latest' | 'popular' | 'rating';
          }
        }
      }
      
      const response = await getMovies(params);
      if (response.success) {
        setMovies(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Failed to load movies:", error);
      toast({
        title: "Error",
        description: "Failed to load movies",
        variant: "destructive",
      });
    } finally {
      setMoviesLoading(false);
    }
  }, [toast]);
  // Handle page change
  const handlePageChange = useCallback(async (page: number) => {
    setCurrentPage(page);
    await loadMovies(page, filters);
  }, [loadMovies, filters]);  useEffect(() => {
    loadFilterData();
    loadMovies(1);
  }, [loadFilterData, loadMovies]);

  const handleAddMovie = () => {
    setEditingMovie(null);
    setIsAddDialogOpen(true);
  };

  const handleEditMovie = (movie: MovieResponse) => {
    setEditingMovie(movie);
    setIsEditDialogOpen(true);
  };

  const handleMovieSaved = async (data: MovieCreateRequest | MovieUpdateRequest) => {
    setLoading(true);
    try {
      if (editingMovie) {        // Update existing movie
        const response = await updateMovieById(data as MovieUpdateRequest);
        if (response.success) {
          toast({
            title: "Success",
            description: "Movie updated successfully",
          });
          await loadMovies(currentPage); // Reload the current page
        }
      } else {
        // Create new movie
        const response = await createMovie(data as MovieCreateRequest);
        if (response.success) {
          toast({
            title: "Success",
            description: "Movie created successfully",
          });
          await loadMovies(1); // Go to first page to see new movie
          setCurrentPage(1);
        }
      }
      
      // Close dialogs
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingMovie(null);
    } catch (error) {
      console.error("Failed to save movie:", error);
      toast({
        title: "Error",
        description: editingMovie ? "Failed to update movie" : "Failed to create movie",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteMovie = async (movieId: string) => {
    setLoading(true);
    try {
      const response = await deleteMovieById(movieId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Movie deleted successfully",
        });
        // If we're on a page with only one movie and it's not the first page, go back one page
        if (movies.length === 1 && currentPage > 1) {
          const newPage = currentPage - 1;
          setCurrentPage(newPage);
          await loadMovies(newPage);
        } else {
          await loadMovies(currentPage); // Reload the current page
        }
      }
    } catch (error) {
      console.error("Failed to delete movie:", error);
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    loadMovies(1, newFilters);
  }, [loadMovies]);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    const defaultFilters = {
      search: "",
      type: "all_types",
      category: "all_categories",
      country: "all_countries",
      year: "all_years",
      sort: "latest"
    };
    setFilters(defaultFilters);
    setCurrentPage(1);
    loadMovies(1);
  }, [loadMovies]);
  return {
    categories,
    countries,
    movies,
    filters,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingMovie,
    loading,
    moviesLoading,
    currentPage,
    pagination,
    handleAddMovie,
    handleEditMovie,
    handleMovieSaved,
    handleDeleteMovie,
    handlePageChange,
    handleFilterChange,
    handleResetFilters,
    loadMovies,
  };
}
