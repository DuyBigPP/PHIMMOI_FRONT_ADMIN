import { AddMovieDialog } from "./AddMovieDialog";
import type { CategoryStats, CountryStats, MovieResponse, MovieCreateRequest, MovieUpdateRequest } from "@/types/api";

interface MovieDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  editingMovie: MovieResponse | null;
  categories: CategoryStats[];
  countries: CountryStats[];
  loading: boolean;
  onMovieSaved: (data: MovieCreateRequest | MovieUpdateRequest) => Promise<void>;
}

export function MovieDialogs({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  editingMovie,
  categories,
  countries,
  loading,
  onMovieSaved,
}: MovieDialogsProps) {
  return (
    <>
      {/* Add Movie Dialog */}
      <AddMovieDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={onMovieSaved}
        categories={categories}
        countries={countries}
        loading={loading}
      />

      {/* Edit Movie Dialog */}
      <AddMovieDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={onMovieSaved}
        editingMovie={editingMovie}
        categories={categories}
        countries={countries}
        loading={loading}
      />
    </>
  );
}
