import { MovieManagementHeader, MovieList, MoviePagination, MovieDialogs, MovieSearchAndFilters } from "./components";
import { useMovieManagement } from "./hooks/useMovieManagement";

const MovieManagement = () => {
  const {
    categories,
    countries,
    movies,
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
  } = useMovieManagement();
  return (
    <div className="space-y-6">
      <MovieManagementHeader onAddMovie={handleAddMovie} />
      
      <MovieSearchAndFilters
        categories={categories}
        countries={countries}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        loading={moviesLoading}
      />
      
      <div className="space-y-4">
        <MovieList 
          movies={movies} 
          onEdit={handleEditMovie}
          onDelete={handleDeleteMovie}
          loading={moviesLoading}
        />
        
        <MoviePagination 
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          loading={moviesLoading}
        />
      </div>
      
      <MovieDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        editingMovie={editingMovie}
        categories={categories}
        countries={countries}
        loading={loading}
        onMovieSaved={handleMovieSaved}
      />
    </div>
  );
};

export default MovieManagement;