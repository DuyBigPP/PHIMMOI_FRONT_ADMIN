import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieManagementHeaderProps {
  onAddMovie: () => void;
}

export function MovieManagementHeader({ onAddMovie }: MovieManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Movie Management</h1>
        <p className="text-muted-foreground">
          Manage your movie collection, episodes, and metadata
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAddMovie}>
          <Plus className="h-4 w-4 mr-2" />
          Add Movie
        </Button>
      </div>
    </div>
  );
}
