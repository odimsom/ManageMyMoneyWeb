import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../../services/categoryService';
import type { Category, CreateCategoryRequest } from '../../services/categoryService';
import { useToast } from '../../hooks/useToast';

interface CategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation(); 
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [parentId, setParentId] = useState<string>('');
  
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    icon: '📝',
    color: '#a855f7',
    type: 'Variable',
    transactionType: 'Expense'
  });

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const data = await categoryService.getCategories(formData.transactionType);
        setParentCategories(data);
      } catch (error) {
        console.error('Failed to fetch parent categories', error);
      }
    };
    fetchParents();
  }, [formData.transactionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (parentId) {
        await categoryService.createSubcategory({
          categoryId: parentId,
          name: formData.name,
          description: formData.description
        });
      } else {
        await categoryService.createCategory(formData);
      }
      showToast(t('common.success'), 'success');
      onSuccess();
    } catch (error) {
      console.error(error);
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full h-14 bg-glass border border-border-subtle rounded-2xl px-6 text-base-content placeholder:text-base-content-muted focus:border-accent-purple/50 focus:bg-glass/20 outline-none transition-all font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-base-content-muted mb-2 block ml-4";
  const selectClasses = "w-full h-14 bg-glass border border-border-subtle rounded-2xl px-6 text-base-content placeholder:text-base-content-muted focus:border-accent-purple/50 focus:bg-glass/20 outline-none transition-all font-medium appearance-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('categories.transaction_type')}</label>
            <select 
              value={formData.transactionType}
              onChange={e => {
                setFormData({ ...formData, transactionType: e.target.value as 'Income' | 'Expense' });
                setParentId(''); // Reset parent when type changes
              }}
              className={selectClasses}
            >
              <option value="Expense" className="bg-card text-base-content">{t('common.expense')}</option>
              <option value="Income" className="bg-card text-base-content">{t('common.income')}</option>
            </select>
        </div>
        <div>
          <label className={labelClasses}>{t('categories.subcategories')} ({t('common.optional')})</label>
            <select 
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              className={selectClasses}
            >
              <option value="" className="bg-card text-base-content">{t('common.none') || 'None (Top Level)'}</option>
              {parentCategories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-card text-base-content">
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('common.name')}</label>
          <input 
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className={inputClasses}
            placeholder="e.g. Groceries"
          />
        </div>
        {!parentId && (
           <div>
            <label className={labelClasses}>{t('common.type')}</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className={selectClasses}
              >
                <option value="Variable" className="bg-card text-base-content">{t('common.variable')}</option>
                <option value="Fixed" className="bg-card text-base-content">{t('common.fixed')}</option>
                <option value="Discretionary" className="bg-card text-base-content">{t('common.discretionary')}</option>
              </select>
          </div>
        )}
      </div>

      <div>
        <label className={labelClasses}>{t('common.description')}</label>
        <input 
          type="text"
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className={inputClasses}
          placeholder="Optional description"
        />
      </div>

      {!parentId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>{t('common.color')}</label>
             <div className="flex items-center gap-2">
              <input 
                type="color"
                value={formData.color || '#a855f7'}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                className="h-14 w-14 rounded-2xl border-none outline-none bg-transparent cursor-pointer"
              />
                <span className="text-base-content-muted text-sm font-black">{formData.color}</span>
            </div>
          </div>
          <div>
            <label className={labelClasses}>{t('common.icon')}</label>
            <input 
              type="text"
              value={formData.icon || ''}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              className={inputClasses}
              placeholder="e.g. 🛒"
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 h-16 rounded-2xl border border-border-subtle bg-glass font-black text-base-content-muted hover:bg-glass/20 hover:text-base-content transition-all uppercase tracking-widest text-xs"
        >
          {t('common.cancel')}
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-16 rounded-2xl bg-accent-purple text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent-purple/20 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {isSubmitting ? '...' : t('common.save')}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
