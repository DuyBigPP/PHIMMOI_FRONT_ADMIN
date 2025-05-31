import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CategoryStats, CountryStats } from '@/types/api';
import { Search, Filter, RefreshCcw } from 'lucide-react';

export interface FilterValues {
  search: string;
  type: string;
  category: string;
  country: string;
  year: string;
  sort: string;
}

interface MovieSearchAndFiltersProps {
  categories: CategoryStats[];
  countries: CountryStats[];
  onFilterChange: (filters: FilterValues) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

const MovieSearchAndFilters = ({
  categories,
  countries,
  onFilterChange,
  onResetFilters,
  loading = false
}: MovieSearchAndFiltersProps) => {  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    type: 'all_types',
    category: 'all_categories',
    country: 'all_countries',
    year: 'all_years',
    sort: 'latest'
  });

  // Generate year options (current year down to 1990)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => (currentYear - i).toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onFilterChange(filters);
  };
  const handleReset = () => {
    setFilters({
      search: '',
      type: 'all_types',
      category: 'all_categories',
      country: 'all_countries',
      year: 'all_years',
      sort: 'latest'
    });
    onResetFilters();
  };

  // Handle "Enter" key in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Filter className="h-5 w-5" /> 
        Search and Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="flex gap-2">
            <Input
              id="search"
              name="search"
              placeholder="Search movies..."
              value={filters.search}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <Button 
              variant="default" 
              size="icon" 
              onClick={handleSearch}
              disabled={loading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Movie Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleSelectChange(value, 'type')}
            disabled={loading}
          >            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types">All Types</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="series">Series</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleSelectChange(value, 'category')}
            disabled={loading}
          >            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_categories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.slug} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={filters.country}
            onValueChange={(value) => handleSelectChange(value, 'country')}
            disabled={loading}
          >            <SelectTrigger id="country">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_countries">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.slug} value={country.slug}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            value={filters.year}
            onValueChange={(value) => handleSelectChange(value, 'year')}
            disabled={loading}
          >            <SelectTrigger id="year">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_years">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select
            value={filters.sort}
            onValueChange={(value) => handleSelectChange(value, 'sort')}
            disabled={loading}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 flex items-end">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MovieSearchAndFilters;