import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getUserList, updateUser, deleteUser } from "@/services/function";
import type { User } from "@/types/api";

export interface UserFormData {
  name: string;
  isAdmin: boolean;
}

export function useUserManagement() {
  const { toast } = useToast();
  
  // State for dialog management
  const [users, setUsers] = useState<User[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); 
  const [usersLoading, setUsersLoading] = useState(false);
    // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  // Load users
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      console.log('Loading users...');
      const response = await getUserList();
      console.log('getUserList response:', response);
      
      if (response.success) {
        setUsers(response.data || []);
        console.log('Successfully loaded users:', response.data?.length || 0);
      } else {
        console.error('API returned error:', response.message);
        throw new Error(response.message || "Failed to load users");
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setUsersLoading(false);
    }
  }, [toast]);
  // Filter users based on search term, status, and role
  useEffect(() => {
    let filtered = users;
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply role filter
    if (roleFilter !== "all") {
      if (roleFilter === "admin") {
        filtered = filtered.filter(user => user.isAdmin);
      } else if (roleFilter === "user") {
        filtered = filtered.filter(user => !user.isAdmin);
      }
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Edit user functions
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (formData: UserFormData) => {
    if (!editingUser) return;
    
    setLoading(true);
    try {
      const response = await updateUser(editingUser.id, formData.name, formData.isAdmin);
      
      if (response.success) {
        await loadUsers(); // Reload users list
        setIsEditDialogOpen(false);
        setEditingUser(null);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        throw new Error(response.message || "Failed to update user");
      }    } catch (error: unknown) {
      console.error("Failed to update user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete user function
  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await deleteUser(userId);
      
      if (response.success) {
        await loadUsers(); // Reload users list
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      } else {
        throw new Error(response.message || "Failed to delete user");
      }    } catch (error: unknown) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Search function
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Stats calculations
  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(user => user.isAdmin).length,
    regularUsers: users.filter(user => !user.isAdmin).length,
    recentUsers: users.filter(user => {
      const createdAt = new Date(user.createdAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return createdAt >= oneWeekAgo;
    }).length
  };
  // Additional handler functions needed by the main page
  const handleToggleUserStatus = async (userId: string) => {
    // Since the API doesn't have a status field, this could be a placeholder
    // or you might want to implement this differently
    console.log("Toggle status for user:", userId);
  };

  const handleSaveUser = async (userData: UserFormData) => {
    return handleUpdateUser(userData);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
  };

  return {
    // State
    users: filteredUsers,
    editingUser,
    loading,
    usersLoading,
    searchTerm,
    statusFilter,
    roleFilter,
    isUpdating: loading,
    stats,
    
    // Dialog state
    isEditDialogOpen,
    setIsEditDialogOpen,
    
    // Functions
    loadUsers,
    handleEditUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleSaveUser,
    handleSearch,
    setEditingUser,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    resetFilters,
  };
}
