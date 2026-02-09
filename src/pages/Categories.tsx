import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../services/categoryService';
import type { Category, Subcategory } from '../services/categoryService';
import { useToast } from '../hooks/useToast';
import Modal from '../components/ui/Modal';
import CategoryForm from '../components/forms/CategoryForm';

interface CategoryWithSubs extends Category {
  subcategories?: Subcategory[];
}

const Categories: React.FC = () => {
  const { t } = useTranslation(); 
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getExpenseCategories();
      // Fetch subcategories for each category (simplified for demo)
      const withSubs = await Promise.all(data.map(async (cat) => {
        try {
          const subs = await categoryService.getSubcategories(cat.id);
          return { ...cat, subcategories: subs };
        } catch {
          return { ...cat, subcategories: [] };
        }
      }));
      setCategories(withSubs);
    } catch {
      showToast('Error loading categories', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchCategories();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-white/5 rounded-[2.5rem]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-white">{t('categories.title', { defaultValue: 'Expense Categories' })}</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 h-14 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20"
        >
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full bg-card rounded-[2.5rem] p-20 border border-white/5 flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
              <span className="text-4xl">🏷️</span>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-white mb-2">No categories found</div>
              <p className="text-white/20 font-medium">Create custom categories to organize your expenses.</p>
            </div>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-card rounded-[2.5rem] p-8 border border-white/5 hover:border-accent-purple/30 transition-all group overflow-hidden relative flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner"
                  style={{ backgroundColor: category.color || '#333' }}
                >
                  {category.icon || '📝'}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/20 bg-white/5 px-3 py-1 rounded-full">
                  {category.type}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-black text-white group-hover:text-accent-purple transition-colors truncate">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm text-white/40 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>

              {category.subcategories && category.subcategories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/10 mb-2">Subcategories</div>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map(sub => (
                      <span key={sub.id} className="text-[9px] font-bold px-2 py-1 bg-white/5 rounded-lg text-white/40 group-hover:text-white/60 transition-colors">
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
             
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-purple/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Expense Category"
      >
        <CategoryForm onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Categories;
