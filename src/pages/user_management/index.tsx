import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserStatsOverview, 
  UserSearchAndFilters, 
  UserList, 
  EditUserDialog 
} from './components';
import { useUserManagement } from './hooks/useUserManagement';

const UserManagement = () => {
  const userManagement = useUserManagement();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, view statistics, and control user permissions
          </p>
        </div>      </div>

      {/* Statistics Overview */}
      <UserStatsOverview 
        stats={userManagement.stats}
        loading={userManagement.usersLoading}
      />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserSearchAndFilters
            searchTerm={userManagement.searchTerm}
            onSearchChange={userManagement.setSearchTerm}
            statusFilter={userManagement.statusFilter}
            onStatusFilterChange={userManagement.setStatusFilter}
            roleFilter={userManagement.roleFilter}
            onRoleFilterChange={userManagement.setRoleFilter}
            onReset={userManagement.resetFilters}
            loading={userManagement.usersLoading}
          />
        </CardContent>
      </Card>

      {/* User List */}
      <UserList
        users={userManagement.users}
        onEdit={userManagement.handleEditUser}
        onDelete={userManagement.handleDeleteUser}
        loading={userManagement.usersLoading}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        open={userManagement.isEditDialogOpen}
        onOpenChange={userManagement.setIsEditDialogOpen}
        onSave={userManagement.handleSaveUser}
        editingUser={userManagement.editingUser}
        loading={userManagement.loading}
      />
    </div>
  );
};

export default UserManagement;