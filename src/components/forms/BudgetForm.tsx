import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { budgetsService } from '../../services/budgetsService';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../services/categoryService';
import { useToast } from '../../hooks/useToast';

interface BudgetFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'Monthly' as 'Monthly' | 'Yearly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    currency: 'USD'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await budgetsService.createBudget({
        ...formData,
        amount: parseFloat(formData.amount) || 0
      });
      showToast(t('common.success'), 'success');
      onSuccess();
    } catch {
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 focus:border-accent-purple/50 focus:bg-white/[0.08] outline-none transition-all font-medium";
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block ml-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClasses}>{t('common.type')}</label>
        <select 
          required
          value={formData.categoryId}
          onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
          className={inputClasses}
        >
          <option value="">{t('common.select_category')}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
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
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClasses}>{t('budgets.period')}</label>
          <select 
            value={formData.period}
            onChange={e => setFormData({ ...formData, period: e.target.value as 'Monthly' | 'Yearly' })}
            className={inputClasses}
          >
            <option value="Monthly">{t('common.monthly')}</option>
            <option value="Yearly">{t('common.yearly')}</option>
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
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>{t('common.end_date')}</label>
          <input 
            type="date"
            required
            value={formData.endDate}
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
            className={inputClasses}
          />
        </div>
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

export default BudgetForm;
