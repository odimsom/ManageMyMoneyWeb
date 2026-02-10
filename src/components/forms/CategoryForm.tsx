import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../../services/categoryService';
import type { CreateCategoryRequest } from '../../services/categoryService';
import { useToast } from '../../hooks/useToast';

interface CategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation(); 
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    icon: '📝',
    color: '#a855f7',
    type: 'Variable',
    transactionType: 'Expense'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await categoryService.createCategory(formData);
      showToast(t('common.success'), 'success');
      onSuccess();
    } catch (error) {
      console.error(error);
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 focus:border-accent-purple/50 focus:bg-white/[0.08] outline-none transition-all font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block ml-4";
  const selectClasses = "w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 focus:border-accent-purple/50 focus:bg-white/[0.08] outline-none transition-all font-medium appearance-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
        <div>
          <label className={labelClasses}>{t('categories.transaction_type')}</label>
          <select 
            value={formData.transactionType}
            onChange={e => setFormData({ ...formData, transactionType: e.target.value as 'Income' | 'Expense' })}
            className={selectClasses}
          >
            <option value="Expense" className="bg-gray-800 text-white">{t('common.expense')}</option>
            <option value="Income" className="bg-gray-800 text-white">{t('common.income')}</option>
          </select>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('common.type')}</label>
          <select 
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            className={selectClasses}
          >
            <option value="Variable" className="bg-gray-800 text-white">{t('common.variable')}</option>
            <option value="Fixed" className="bg-gray-800 text-white">{t('common.fixed')}</option>
            <option value="Discretionary" className="bg-gray-800 text-white">{t('common.discretionary')}</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>{t('common.color')}</label>
           <div className="flex items-center gap-2">
            <input 
              type="color"
              value={formData.color || '#a855f7'}
              onChange={e => setFormData({ ...formData, color: e.target.value })}
              className="h-14 w-14 rounded-2xl border-none outline-none bg-transparent cursor-pointer"
            />
            <span className="text-white/50 text-sm font-black">{formData.color}</span>
          </div>
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

      <div className="flex gap-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 h-16 rounded-2xl border border-white/5 font-black text-white/40 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-xs"
        >
          {t('common.cancel')}
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-16 rounded-2xl bg-white text-black font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-white/5 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {isSubmitting ? '...' : t('common.save')}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
