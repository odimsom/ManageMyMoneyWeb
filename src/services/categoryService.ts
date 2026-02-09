import api from './api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  type: string;
  transactionType: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  type: string;
  transactionType: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
}

export interface CreateSubcategoryRequest {
  categoryId: string;
  name: string;
  description?: string;
}

export interface CategoryBudget {
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
}

const getCategories = async (transactionType?: string) => {
  const response = await api.get<{ data: Category[] }>(`/api/Categories`, {
    params: { transactionType }
  });
  return response.data.data || [];
};

const getCategoryById = async (id: string) => {
  const response = await api.get<{ data: Category }>(`/api/Categories/${id}`);
  return response.data.data;
};

const getExpenseCategories = async () => {
  const response = await api.get<{ data: Category[] }>(`/api/Categories/expenses`);
  return response.data.data || [];
};

const getIncomeCategories = async () => {
  const response = await api.get<{ data: Category[] }>(`/api/Categories/income`);
  return response.data.data || [];
};

const createCategory = async (category: CreateCategoryRequest) => {
  const response = await api.post<{ data: Category }>(`/api/Categories`, category);
  return response.data.data;
};

const updateCategory = async (id: string, data: UpdateCategoryRequest) => {
  const response = await api.put<{ data: Category }>(`/api/Categories/${id}`, data);
  return response.data.data;
};

const deleteCategory = async (id: string) => {
  await api.delete(`/api/Categories/${id}`);
};

const createSubcategory = async (data: CreateSubcategoryRequest) => {
  const response = await api.post<{ data: Subcategory }>('/api/Categories/subcategories', data);
  return response.data.data;
};

const getSubcategories = async (categoryId: string) => {
  const response = await api.get<{ data: Subcategory[] }>(`/api/Categories/${categoryId}/subcategories`);
  return response.data.data || [];
};

const deleteSubcategory = async (subcategoryId: string) => {
  await api.delete(`/api/Categories/subcategories/${subcategoryId}`);
};

const getCategoryBudgets = async () => {
  const response = await api.get<{ data: CategoryBudget[] }>('/api/Categories/budgets');
  return response.data.data || [];
};

const initializeDefaults = async () => {
  await api.post('/api/Categories/initialize-defaults');
};

export const categoryService = {
  getCategories,
  getCategoryById,
  getExpenseCategories,
  getIncomeCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  getSubcategories,
  deleteSubcategory,
  getCategoryBudgets,
  initializeDefaults
};
