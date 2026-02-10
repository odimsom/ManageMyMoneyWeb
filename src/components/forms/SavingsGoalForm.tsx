import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { budgetsService } from '../../services/budgetsService';
import { useToast } from '../../hooks/useToast';

interface SavingsGoalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    currency: 'USD',
    initialContribution: '0',
    color: '#10b981',
    icon: '🎯'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await budgetsService.createSavingsGoal({
        ...formData,
        targetAmount: parseFloat(formData.targetAmount) || 0,
        initialContribution: parseFloat(formData.initialContribution) || 0
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
        <label className={labelClasses}>{t('common.name')}</label>
        <input 
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className={inputClasses}
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
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelClasses}>{t('savings_goals.target_date')}</label>
          <input 
            type="date"
            required
            value={formData.targetDate}
            onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Initial Contribution</label>
          <input 
            type="number"
            step="0.01"
            value={formData.initialContribution}
            onChange={e => setFormData({ ...formData, initialContribution: e.target.value })}
            className={inputClasses}
            placeholder="0.00"
          />
        </div>
        <div className="flex gap-4">
           <div className="flex-1">
            <label className={labelClasses}>Icon</label>
            <input 
              type="text"
              value={formData.icon}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Color</label>
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

export default SavingsGoalForm;
