import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { User, UserCheck } from 'lucide-react';
import type { User as UserType } from '@/types/api';
import type { UserFormData } from '../hooks/useUserManagement';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UserFormData) => Promise<void>;
  editingUser?: UserType | null;
  loading?: boolean;
}

export function EditUserDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  editingUser, 
  loading = false 
}: EditUserDialogProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    isAdmin: false,
  });

  // Update form data when editing user changes
  React.useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        isAdmin: editingUser.isAdmin,
      });
    } else {
      setFormData({
        name: '',
        isAdmin: false,
      });
    }
  }, [editingUser]);

  const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      await onSave(formData);
    } catch {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={editingUser?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>

          {/* User Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter user name"
              required
            />
          </div>

          {/* Admin Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isAdmin"
              checked={formData.isAdmin}
              onCheckedChange={(checked) => handleInputChange('isAdmin', checked)}
            />
            <Label htmlFor="isAdmin" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Administrator Privileges
            </Label>
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
            <Button type="submit" disabled={loading || !formData.name.trim()}>
              {loading ? 'Saving...' : 'Update User'}
            </Button>
          </DialogFooter>
        </form>      </DialogContent>
    </Dialog>
  );
}

export default EditUserDialog;
