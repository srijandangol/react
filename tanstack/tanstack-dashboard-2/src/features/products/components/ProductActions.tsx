/**
 * ProductActions Component - Action buttons for product rows
 */

import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import type { Product } from '../types';

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirm(`Delete product "${product.name}"?`)) {
      setIsDeleting(true);
      onDelete(product);
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" onClick={() => onEdit(product)}>
        Edit
      </Button>

      <Button
        size="sm"
        variant="danger"
        loading={isDeleting}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
};