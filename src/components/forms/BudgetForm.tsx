import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { budgetsService } from '../../services/budgetsService';
import type { Budget } from '../../services/budgetsService';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../services/categoryService';
import { useToast } from '../../hooks/useToast';

interface BudgetFormProps {
  initialData?: Budget;
  onSuccess: () => void;
  onCancel: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    categoryId: initialData?.categoryId || '',
    amount: initialData?.amount.toString() || '',
    period: (initialData?.period as 'Monthly' | 'Yearly') || 'Monthly',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    currency: initialData?.currency || 'USD'
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getExpenseCategories();
        setCategories(data);
      } catch {
        showToast(t('common.error'), 'error');
      }
    };
    fetchCategories();
  }, [showToast, t]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.categoryId) newErrors.categoryId = t('common.required');
    if (parseFloat(formData.amount) <= 0) newErrors.amount = t('errors.amount_positive');
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = t('errors.date_range_invalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (initialData) {
        await budgetsService.updateBudget(initialData.id, {
          amount: parseFloat(formData.amount),
          period: formData.period,
          startDate: formData.startDate,
          endDate: formData.endDate
        });
      } else {
        await budgetsService.createBudget({
          ...formData,
          amount: parseFloat(formData.amount) || 0
        });
      }
      showToast(t('common.success'), 'success');
      onSuccess();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (error?: string) => `w-full h-14 bg-glass border ${error ? 'border-red-500' : 'border-border-subtle'} rounded-2xl px-6 text-base-content placeholder:text-base-content-muted focus:border-accent-purple/50 focus:bg-glass/20 outline-none transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed`;
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-base-content-muted mb-2 block ml-4";
  const errorClasses = "text-[10px] font-bold text-red-500 mt-2 ml-4 animate-fade-in";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClasses}>{t('common.category')}</label>
        <select 
          required
          disabled={!!initialData}
          value={formData.categoryId}
          onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
          className={inputClasses(errors.categoryId)}
        >
          <option value="" className="bg-card text-base-content">{t('common.select_category')}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-card text-base-content">{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <div className={errorClasses}>{errors.categoryId}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('common.amount')}</label>
          <input 
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            className={inputClasses(errors.amount)}
            placeholder="0.00"
          />
          {errors.amount && <div className={errorClasses}>{errors.amount}</div>}
        </div>
        <div>
          <label className={labelClasses}>{t('budgets.period')}</label>
            <select 
              value={formData.period}
              onChange={e => setFormData({ ...formData, period: e.target.value as 'Monthly' | 'Yearly' })}
              className={inputClasses()}
            >
              <option value="Monthly" className="bg-card text-base-content">{t('common.monthly')}</option>
              <option value="Yearly" className="bg-card text-base-content">{t('common.yearly')}</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('common.start_date')}</label>
          <input 
            type="date"
            required
            value={formData.startDate}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            className={inputClasses()}
          />
        </div>
        <div>
          <label className={labelClasses}>{t('common.end_date')}</label>
          <input 
            type="date"
            required
            value={formData.endDate}
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            className={inputClasses(errors.endDate)}
          />
          {errors.endDate && <div className={errorClasses}>{errors.endDate}</div>}
        </div>
      </div>

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

export default BudgetForm;
