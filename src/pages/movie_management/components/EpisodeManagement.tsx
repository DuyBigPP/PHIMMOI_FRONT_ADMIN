import { useState, useEffect } from 'react';

import { EpisodeCreateRequest, EpisodeUpdateRequest, EpisodeResponse } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play,
  Calendar,
  Server
} from 'lucide-react';

interface EpisodeManagementProps {
  movieId: string;
  movieName: string;
  episodes: EpisodeResponse[];
  onAddEpisode: (data: EpisodeCreateRequest) => Promise<void>;
  onUpdateEpisode: (data: EpisodeUpdateRequest) => Promise<void>;
  onDeleteEpisode: (episodeId: string) => Promise<void>;
  loading?: boolean;
}

interface EpisodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: EpisodeCreateRequest | EpisodeUpdateRequest) => Promise<void>;
  editingEpisode?: EpisodeResponse | null;
  movieId: string;
  loading?: boolean;
}

function EpisodeDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editingEpisode, 
  movieId, 
  loading = false 
}: EpisodeDialogProps) {
  const [formData, setFormData] = useState<Partial<EpisodeCreateRequest>>({
    name: '',
    slug: '',
    movieId: movieId,
    serverName: 'Default',
    video: undefined
  });

  useEffect(() => {
    if (open) {
      if (editingEpisode) {
        setFormData({
          name: editingEpisode.name,
          slug: editingEpisode.slug,
          movieId: editingEpisode.movieId,
          serverName: editingEpisode.serverName,
          video: undefined // File uploads need to be re-selected
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          movieId: movieId,
          serverName: 'Default',
          video: undefined
        });
      }
    }
  }, [open, editingEpisode, movieId]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'name' && value) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug || (!editingEpisode && !formData.video)) {
      return;
    }

    try {
      const submitData = editingEpisode 
        ? { ...formData, id: editingEpisode.id } as EpisodeUpdateRequest
        : formData as EpisodeCreateRequest;
      
      await onSave(submitData);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            {editingEpisode ? 'Edit Episode' : 'Add New Episode'}
          </DialogTitle>
          <DialogDescription>
            {editingEpisode 
              ? 'Update the episode information below.' 
              : 'Fill in the details to add a new episode.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Episode Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Tập 1, Episode 1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="episode-slug"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serverName">Server Name</Label>
            <Input
              id="serverName"
              value={formData.serverName}
              onChange={(e) => handleInputChange('serverName', e.target.value)}
              placeholder="Default"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video File {!editingEpisode && '*'}</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => handleInputChange('video', e.target.files?.[0] || undefined)}
              required={!editingEpisode}
            />
            {editingEpisode && (
              <p className="text-sm text-muted-foreground">
                Leave empty to keep the current video file
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingEpisode ? 'Update Episode' : 'Add Episode'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EpisodeManagement({ 
  movieId, 
  movieName, 
  episodes, 
  onAddEpisode, 
  onUpdateEpisode, 
  onDeleteEpisode, 
  loading = false 
}: EpisodeManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<EpisodeResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const handleAddEpisode = async (data: EpisodeCreateRequest | EpisodeUpdateRequest) => {
    try {
      setSaving(true);
      if ('id' in data) {
        await onUpdateEpisode(data);
      } else {
        await onAddEpisode(data);
      }
      setEditingEpisode(null);
    } finally {
      setSaving(false);
    }
  };

  const handleEditEpisode = (episode: EpisodeResponse) => {
    setEditingEpisode(episode);
    setDialogOpen(true);
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    const episode = episodes.find(ep => ep.id === episodeId);
    if (!episode) return;

    if (!window.confirm(`Are you sure you want to delete episode "${episode.name}"? This action cannot be undone.`)) {
      return;
    }

    await onDeleteEpisode(episodeId);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Episode Management
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage episodes for "{movieName}"
            </p>
          </div>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Episode
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : episodes.length === 0 ? (
          <div className="text-center py-8">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Episodes</h3>
            <p className="text-muted-foreground mb-4">
              This movie doesn't have any episodes yet.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Episode
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Episode</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {episodes.map((episode) => (
                  <TableRow key={episode.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{episode.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {episode.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Server className="h-3 w-3" />
                        {episode.serverName}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(episode.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(episode.updatedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
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
                          <DropdownMenuItem onClick={() => handleEditEpisode(episode)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEpisode(episode.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <EpisodeDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingEpisode(null);
            }
          }}
          onSave={handleAddEpisode}
          editingEpisode={editingEpisode}
          movieId={movieId}
          loading={saving}
        />
      </CardContent>
    </Card>
  );
}
