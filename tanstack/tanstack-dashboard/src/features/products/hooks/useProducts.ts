/**
 * useProducts hook - Manages product state
 */

import { useState } from 'react';
import type { Product, CreateProductInput, UpdateProductInput } from '../types';

const initialProducts: Product[] = [
  { id: '1', name: 'Laptop', price: 999, category: 'Electronics' },
  { id: '2', name: 'Book', price: 20, category: 'Education' },
  { id: '3', name: 'Chair', price: 150, category: 'Furniture' },
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (input: CreateProductInput) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...input,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (input: UpdateProductInput) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === input.id ? { ...product, ...input } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};