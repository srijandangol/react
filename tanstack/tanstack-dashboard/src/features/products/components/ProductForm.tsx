/**
 * ProductForm - Improved with validation
 */

import React, { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type {
  CreateProductInput,
  UpdateProductInput,
  Product,
} from '../types';

interface ProductFormProps {
  product?: Product;
  isLoading?: boolean;
  onSubmit: (data: CreateProductInput | UpdateProductInput) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  isLoading = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateProductInput>({
    name: product?.name || '',
    price: product?.price || 0,
    category: product?.category || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (product) {
      onSubmit({ id: product.id, ...formData } as UpdateProductInput);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Price"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        required
      />

      <Input
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        error={errors.category}
        required
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>

        <Button variant="primary" type="submit" loading={isLoading}>
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};