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

const getCategories = async (transactionType?: string) => {
  const url = transactionType 
    ? `/api/Categories?transactionType=${transactionType}`
    : `/api/Categories`;
  const response = await api.get<{ data: Category[] }>(url);
  return response.data.data || [];
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

const deleteCategory = async (id: string) => {
    await api.delete(`/api/Categories/${id}`);
};

export const categoryService = {
  getCategories,
  getExpenseCategories,
  getIncomeCategories,
  createCategory,
  deleteCategory
};
