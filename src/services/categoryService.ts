import api from './api';

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

const getCategories = async () => {
  const response = await api.get<{ data: Category[] }>(`/api/Categories`);
  return response.data.data || [];
};

export const categoryService = {
  getCategories
};
