import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EpisodeResponse, EpisodeCreateRequest, EpisodeUpdateRequest } from '@/types/api';
import { addEpisode, updateEpisode, deleteEpisode} from '@/services/function';

export function useMovieEpisodes() {
  const { toast } = useToast();
  const [episodes, setEpisodes] = useState<EpisodeResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Load episodes for a movie
  const loadEpisodes = useCallback(async (movieId: string) => {
    if (!movieId) {
      setEpisodes([]);
      return;
    }

    setLoading(true);
    try {
      // Since there's no direct endpoint to get episodes by movieId,
      // we'll manage episodes locally and load them when editing
      // For now, we'll start with empty episodes and let users add them
      setEpisodes([]);
    } catch (error) {
      console.error('Failed to load episodes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load episodes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add new episode
  const handleAddEpisode = useCallback(async (episodeData: EpisodeCreateRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await addEpisode(episodeData);
      if (response.success) {
        setEpisodes(prev => [...prev, response.data]);
        toast({
          title: 'Success',
          description: 'Episode added successfully',
        });
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to add episode:', error);
      toast({
        title: 'Error',
        description: 'Failed to add episode',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update episode
  const handleUpdateEpisode = useCallback(async (episodeData: EpisodeUpdateRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await updateEpisode(episodeData);
      if (response.success) {
        setEpisodes(prev => 
          prev.map(ep => ep.id === episodeData.id ? response.data : ep)
        );
        toast({
          title: 'Success',
          description: 'Episode updated successfully',
        });
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to update episode:', error);
      toast({
        title: 'Error',
        description: 'Failed to update episode',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete episode
  const handleDeleteEpisode = useCallback(async (episodeId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await deleteEpisode(episodeId);
      if (response.success) {
        setEpisodes(prev => prev.filter(ep => ep.id !== episodeId));
        toast({
          title: 'Success',
          description: 'Episode deleted successfully',
        });
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to delete episode:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete episode',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    episodes,
    loading,
    loadEpisodes,
    addEpisode: handleAddEpisode,
    updateEpisode: handleUpdateEpisode,
    deleteEpisode: handleDeleteEpisode,
  };
}
