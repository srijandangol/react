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
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // 🔹 SEARCH STATE
  const [filters, setFilters] = useState({
    search: '',
  });

  // 🔹 CLIENT SIDE FILTERING
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(undefined);
  };

  const handleSubmit = (data: CreateProductInput | UpdateProductInput) => {
    if ('id' in data) {
      updateProduct(data);
    } else {
      addProduct(data);
    }
    handleCloseModal();
  };

  const handleDelete = (product: Product) => {
    deleteProduct(product.id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>

        <Button onClick={() => handleOpenModal()}>
          + New Product
        </Button>
      </div>

      {/* 🔍 SEARCH BAR */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ search: e.target.value })
          }
          className="border px-3 py-2 rounded-lg w-80"
        />
      </div>

      {/* TABLE */}
      <ProductsTable
        data={filteredProducts}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        totalCount={filteredProducts.length}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct ? 'Edit Product' : 'Create Product'}
      >
        <ProductForm
          key={selectedProduct ? selectedProduct.id : 'new'}
          product={selectedProduct}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

    </div>
  );
};