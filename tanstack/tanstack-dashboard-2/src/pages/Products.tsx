/**
 * Products Page - Products management with table and form
 */

import React, { useState } from 'react';
import { useProducts } from '../features/products/hooks/useProducts';
import { ProductsTable } from '../features/products/components/ProductsTable';
import { ProductForm } from '../features/products/components/ProductForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '../features/products/types';

export const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  // ✅ Pagination state (NEW)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  // Modal handlers
  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  // Form submit
  const handleFormSubmit = (data: CreateProductInput | UpdateProductInput) => {
    if ('id' in data) {
      updateProduct(data as UpdateProductInput);
    } else {
      addProduct(data as CreateProductInput);
    }
    handleCloseModal();
  };

  // ❗ FIX: now receives full product (not id)
  const handleDelete = (product: Product) => {
    deleteProduct(product.id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>

        <Button variant="primary" onClick={() => handleOpenModal()}>
          + New Product
        </Button>
      </div>

      {/* Table */}
      <ProductsTable
        data={products}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct ? 'Edit Product' : 'Create New Product'}
        footer={null}
      >
        <ProductForm
          key={selectedProduct ? selectedProduct.id : 'new'}
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};