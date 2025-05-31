import { MovieResponse } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MovieListProps {
  movies: MovieResponse[];
  onEdit: (movie: MovieResponse) => void;
  onDelete: (movieId: string) => void;
  loading?: boolean;
}

export function MovieList({ movies, onEdit, onDelete, loading }: MovieListProps) {
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Poster</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Original Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Countries</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(8)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="w-16 h-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Poster</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Original Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Countries</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
            <Play className="h-full w-full" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Movies Found</h3>
          <p className="text-muted-foreground">
            No movies match your current search and filter criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Poster</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Original Title</TableHead>
            {/* <TableHead>Type</TableHead> */}
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Countries</TableHead>
           {/*  <TableHead className="text-right">Views</TableHead> */}
            <TableHead>Updated</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id} className="hover:bg-muted/50">
              {/* Poster */}
              <TableCell>
                <div className="w-16 h-20 overflow-hidden rounded">
                  <img
                    src={movie.posterUrl || movie.thumbUrl || '/placeholder-movie.jpg'}
                    alt={movie.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-movie.jpg';
                    }}
                  />
                </div>
              </TableCell>
              
              {/* Title */}
              <TableCell className="font-medium">
                <div className="max-w-[200px]">
                  <div className="font-semibold truncate" title={movie.name}>
                    {movie.name}
                  </div>
                </div>
              </TableCell>
              
              {/* Original Title */}
              <TableCell>
                <div className="max-w-[200px] text-muted-foreground truncate" title={movie.originName}>
                  {movie.originName}
                </div>
              </TableCell>
              
              {/* Type */}
{/*               <TableCell>
                <Badge variant={movie.type === 'movie' ? 'default' : 'secondary'}>
                  {movie.type === 'movie' ? 'Movie' : movie.type === 'series' ? 'Series' : 'Animation'}
                </Badge>
              </TableCell> */}
              
              {/* Year */}
              <TableCell>{movie.year}</TableCell>
              
              {/* Status */}
              <TableCell>
                <Badge variant={movie.status === 'completed' ? 'default' : 'outline'}>
                  {movie.status === 'completed' ? 'Completed' : 'Ongoing'}
                </Badge>
              </TableCell>
              
              {/* Categories */}
              <TableCell>
                <div className="max-w-[150px] text-sm text-muted-foreground truncate" title={
                  movie.categories ? movie.categories.map(cat => cat.category.name).join(', ') : ''
                }>
                  {movie.categories && movie.categories.length > 0 
                    ? movie.categories.map(cat => cat.category.name).join(', ')
                    : '-'
                  }
                </div>
              </TableCell>
              
              {/* Countries */}
              <TableCell>
                <div className="max-w-[120px] text-sm text-muted-foreground truncate" title={
                  movie.countries ? movie.countries.map(country => country.country.name).join(', ') : ''
                }>
                  {movie.countries && movie.countries.length > 0 
                    ? movie.countries.map(country => country.country.name).join(', ')
                    : '-'
                  }
                </div>
              </TableCell>
              
              {/* Views */}
{/*               <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{movie.view.toLocaleString()}</span>
                </div>
              </TableCell> */}
              
              {/* Updated */}
              <TableCell className="text-sm text-muted-foreground">
                {new Date(movie.updatedAt).toLocaleDateString()}
              </TableCell>
              
              {/* Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(movie)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Movie
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(movie.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Movie
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
