/**
 * UserActions Component - Action buttons for user rows
 */

import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import type { User } from '../types';

interface UserActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ user, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      setIsDeleting(true);
      onDelete(user);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onEdit(user)}
      >
        Edit
      </Button>
      <Button
        variant="danger"
        size="sm"
        loading={isDeleting}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};
