import { useState, useEffect } from 'react';
import type { Product, CreateProductInput, UpdateProductInput } from '../types';

const LOCAL_STORAGE_KEY = 'products';

export const useProducts = () => {
  // Load products from localStorage if available
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Product[];
    return [
      { id: '1', name: 'Laptop', price: 999, category: 'Electronics' },
      { id: '2', name: 'Book', price: 20, category: 'Education' },
      { id: '3', name: 'Chair', price: 150, category: 'Furniture' },
    ];
  });

  // Sync products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = (input: CreateProductInput) => {
    const newProduct: Product = { id: Date.now().toString(), ...input };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (input: UpdateProductInput) => {
    setProducts(prev =>
      prev.map(product => (product.id === input.id ? { ...product, ...input } : product))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return { products, addProduct, updateProduct, deleteProduct };
};