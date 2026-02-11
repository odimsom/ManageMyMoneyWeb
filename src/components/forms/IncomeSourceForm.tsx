import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { incomeService } from '../../services/incomeService';
import type { CreateIncomeSourceRequest, IncomeSource } from '../../services/incomeService';
import { useToast } from '../../hooks/useToast';

interface IncomeSourceFormProps {
  initialData?: IncomeSource;
  onSuccess: () => void;
  onCancel: () => void;
}

const IncomeSourceForm: React.FC<IncomeSourceFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateIncomeSourceRequest>({
    name: initialData?.name || '',
    description: initialData?.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (initialData) {
        await incomeService.updateIncomeSource(initialData.id, formData);
      } else {
        await incomeService.createIncomeSource(formData);
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
          placeholder={t('income.source_name_placeholder') || "e.g. Salary, Freelance"}
        />
      </div>

      <div>
        <label className={labelClasses}>{t('common.description')}</label>
        <textarea 
          value={formData.description || ''}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className={`${inputClasses} h-32 py-4 resize-none`}
          placeholder={t('common.description_placeholder') || "Optional description"}
        />
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

export default IncomeSourceForm;
