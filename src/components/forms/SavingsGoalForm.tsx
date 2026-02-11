import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { budgetsService } from '../../services/budgetsService';
import { useToast } from '../../hooks/useToast';

import type { SavingsGoal } from '../../services/budgetsService';

interface SavingsGoalFormProps {
  initialData?: SavingsGoal;
  onSuccess: () => void;
  onCancel: () => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    targetAmount: initialData?.targetAmount.toString() || '',
    targetDate: initialData?.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    currency: initialData?.currency || 'USD',
    initialContribution: '0',
    color: initialData?.color || '#10b981',
    icon: initialData?.icon || '🎯'
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const amount = parseFloat(formData.targetAmount);
    const initial = parseFloat(formData.initialContribution);

    if (amount <= 0) newErrors.targetAmount = t('errors.amount_positive');
    if (new Date(formData.targetDate) <= new Date()) newErrors.targetDate = t('errors.future_date_required');
    if (initial > amount) newErrors.initialContribution = t('errors.initial_contribution_exceeds_target');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (initialData) {
        await budgetsService.updateSavingsGoal(initialData.id, {
          name: formData.name,
          targetAmount: parseFloat(formData.targetAmount),
          targetDate: formData.targetDate,
          color: formData.color,
          icon: formData.icon
        });
      } else {
        await budgetsService.createSavingsGoal({
          ...formData,
          targetAmount: parseFloat(formData.targetAmount) || 0,
          initialContribution: parseFloat(formData.initialContribution) || 0
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
        <label className={labelClasses}>{t('common.name')}</label>
        <input 
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className={inputClasses()}
          placeholder="e.g. New Car, Vacation"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('savings_goals.target_amount')}</label>
          <input 
            type="number"
            step="0.01"
            required
            value={formData.targetAmount}
            onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
            className={inputClasses(errors.targetAmount)}
            placeholder="0.00"
          />
          {errors.targetAmount && <div className={errorClasses}>{errors.targetAmount}</div>}
        </div>
        <div>
          <label className={labelClasses}>{t('savings_goals.target_date')}</label>
          <input 
            type="date"
            required
            value={formData.targetDate}
            onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
            className={inputClasses(errors.targetDate)}
          />
          {errors.targetDate && <div className={errorClasses}>{errors.targetDate}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('savings_goals.initial_contribution')}</label>
          <input 
            type="number"
            step="0.01"
            disabled={!!initialData}
            value={formData.initialContribution}
            onChange={e => setFormData({ ...formData, initialContribution: e.target.value })}
            className={inputClasses(errors.initialContribution)}
            placeholder="0.00"
          />
          {errors.initialContribution && <div className={errorClasses}>{errors.initialContribution}</div>}
        </div>
        <div className="flex gap-4">
           <div className="flex-1">
            <label className={labelClasses}>{t('common.icon')}</label>
            <input 
              type="text"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              className={inputClasses()}
            />
          </div>
          <div>
            <label className={labelClasses}>{t('common.color')}</label>
            <input 
              type="color"
              value={formData.color}
              onChange={e => setFormData({ ...formData, color: e.target.value })}
              className="h-14 w-14 rounded-2xl border-none outline-none bg-transparent cursor-pointer"
            />
          </div>
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

export default SavingsGoalForm;
