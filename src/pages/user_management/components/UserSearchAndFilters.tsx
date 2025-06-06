import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw } from 'lucide-react';

interface UserSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  onReset: () => void;
  loading?: boolean;
}

export function UserSearchAndFilters({ 
  searchTerm, 
  onSearchChange, 
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  onReset, 
  loading = false 
}: UserSearchAndFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleReset = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onRoleFilterChange('all');
    onReset();
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || roleFilter !== 'all';

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange} disabled={loading}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select value={roleFilter} onValueChange={onRoleFilterChange} disabled={loading}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
        {/* Reset Button */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={loading || !hasActiveFilters}
          size="sm"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}

export default UserSearchAndFilters;
