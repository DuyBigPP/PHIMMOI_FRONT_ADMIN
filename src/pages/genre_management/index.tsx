import { useState, useEffect} from 'react';
import { CategoryStats } from '@/types/api';
import { getCategoryStats, addCategory, updateCategory, deleteCategory } from '@/services/function';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Tag,
  AlertTriangle
} from 'lucide-react';
import { CategoryList } from './components/CategoryList';
import { AddCategoryDialog } from './components/AddCategoryDialog';
import { CategoryStatsOverview } from './components/CategoryStatsOverview';

const GenreManagement = () => {
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryStats | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load categories data
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategoryStats();
      
      if (response && response.data) {
        setCategories(response.data);
        setFilteredCategories(response.data);
        toast({
          title: "Success",
          description: `Loaded ${response.data.length} categories`,
          duration: 3000,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      // Set empty array as fallback
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };  // Initial load
  useEffect(() => {
    loadCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);
  // Handle adding new category or editing existing one
  const handleAddCategory = async (data: { name: string; slug: string }) => {
    try {
      setSaving(true);
      let response;
      
      if (editingCategory) {
        // Update existing category
        response = await updateCategory(editingCategory.id, data.name, data.slug);
        toast({
          title: "Success",
          description: `Category "${data.name}" updated successfully`,
          duration: 3000,
        });
      } else {
        // Add new category
        response = await addCategory(data.name, data.slug);
        toast({
          title: "Success",
          description: `Category "${data.name}" created successfully`,
          duration: 3000,
        });
      }
      
      if (response && response.data) {
        await loadCategories(); // Reload to get updated data
        setEditingCategory(null); // Clear editing state
      } else {
        throw new Error(`Failed to ${editingCategory ? 'update' : 'create'} category`);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingCategory ? 'update' : 'create'} category. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
      throw error; // Re-throw to prevent dialog from closing
    } finally {
      setSaving(false);
    }
  };

  // Handle editing category
  const handleEditCategory = (category: CategoryStats) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  // Handle deleting category
  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    // Show confirmation dialog
    if (!window.confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      await loadCategories(); // Reload to get updated data
      toast({
        title: "Success",
        description: `Category "${category.name}" deleted successfully`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadCategories();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Genre Management</h1>
            <p className="text-muted-foreground">
              Manage movie categories and genres
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <CategoryStatsOverview categories={categories} loading={loading} />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Showing {filteredCategories.length} of {categories.length} categories</span>
        </div>
      </div>

      {/* Category List */}
      <CategoryList
        categories={filteredCategories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        loading={loading}
      />

      {/* Add/Edit Category Dialog */}
      <AddCategoryDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingCategory(null);
          }
        }}
        onSave={handleAddCategory}
        editingCategory={editingCategory}
        loading={saving}
      />

      {/* Status Messages */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Categories Available</h3>
          <p className="text-muted-foreground mb-4">
            There are no categories to display. This might be due to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-6">
            <li>• No categories have been created yet</li>
            <li>• The API is currently unavailable</li>
            <li>• You don't have permission to view categories</li>
          </ul>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create First Category
          </Button>
        </div>
      )}

      {!loading && categories.length > 0 && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground">
            No categories match your search for "{searchTerm}". Try adjusting your search terms.
          </p>
        </div>
      )}
    </div>
  );
};

export default GenreManagement;