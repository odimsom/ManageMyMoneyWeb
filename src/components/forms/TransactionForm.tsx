import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { accountService } from '../../services/accountService';
import type { Account } from '../../services/accountService';
import { categoryService } from '../../services/categoryService';
import { expenseService } from '../../services/expenseService';
import type { Tag, Expense } from '../../services/expenseService';
import { incomeService } from '../../services/incomeService';
import type { Income } from '../../services/incomeService';
import { useToast } from '../../hooks/useToast';

interface TransactionFormProps {
  type: 'Expense' | 'Income';
  initialData?: Expense | Income;
  onSuccess: () => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, initialData, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: initialData?.amount.toString() || '',
    description: initialData?.description || '',
    categoryId: initialData && 'categoryId' in initialData ? initialData.categoryId : (initialData && 'incomeSourceId' in initialData ? initialData.incomeSourceId : ''),
    accountId: initialData?.accountId || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    currency: (initialData && 'currencyCode' in initialData ? (initialData as Expense | Income).currencyCode : 'USD'),
    isRecurring: initialData?.isRecurring || false,
    tagIds: initialData && 'tags' in initialData ? initialData.tags?.map(t => t.id) || [] : [] as string[],
    frequency: 'Monthly' as 'Daily' | 'Weekly' | 'Monthly' | 'Yearly',
    dayOfMonth: 1,
    dayOfWeek: 1
  });

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accs, cats, tags] = await Promise.all([
          accountService.getAccounts(),
          type === 'Expense' 
            ? categoryService.getExpenseCategories() 
            : incomeService.getIncomeSources(),
          expenseService.getTags()
        ]);
        setAccounts(accs);
        setCategories(cats);
        setAvailableTags(tags);
        
        if (accs.length > 0) setFormData(prev => ({ ...prev, accountId: accs[0].id }));
        if (cats.length > 0) setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
      } catch (error) {
        console.error('Failed to fetch form data', error);
      }
    };
    fetchData();
  }, [type]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const amount = parseFloat(formData.amount);
    
    if (isNaN(amount) || amount <= 0) newErrors.amount = t('errors.amount_positive');
    if (!formData.description) newErrors.description = t('common.required');
    if (!formData.categoryId) newErrors.categoryId = t('common.required');
    if (!formData.accountId) newErrors.accountId = t('common.required');

    if (formData.isRecurring && showAdvanced) {
      if (new Date(formData.date) < new Date(new Date().setHours(0,0,0,0))) {
        newErrors.date = t('errors.past_date_prohibited');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      let createdId: string | undefined;

      if (initialData) {
        if (type === 'Expense') {
          await expenseService.updateExpense(initialData.id, {
            amount: parseFloat(formData.amount),
            description: formData.description,
            categoryId: formData.categoryId,
            accountId: formData.accountId,
            date: formData.date
          });
        } else {
          await incomeService.updateIncome(initialData.id, {
            incomeSourceId: formData.categoryId,
            accountId: formData.accountId,
            amount: parseFloat(formData.amount),
            date: formData.date,
            description: formData.description,
            isRecurring: formData.isRecurring
          });
        }
        createdId = initialData.id;
      } else {
        if (type === 'Expense') {
          if (formData.isRecurring && showAdvanced) {
            const recurringResp = await expenseService.createRecurringExpense({
              amount: parseFloat(formData.amount),
              description: formData.description,
              categoryId: formData.categoryId,
              accountId: formData.accountId,
              startDate: formData.date,
              frequency: formData.frequency,
              dayOfMonth: formData.frequency === 'Monthly' ? formData.dayOfMonth : undefined,
              dayOfWeek: formData.frequency === 'Weekly' ? formData.dayOfWeek : undefined
            });
            createdId = recurringResp.id;
          } else {
            const expenseResp = await expenseService.createExpense({
              amount: parseFloat(formData.amount),
              description: formData.description,
              categoryId: formData.categoryId,
              accountId: formData.accountId,
              date: formData.date,
              currency: formData.currency,
              isRecurring: formData.isRecurring,
              tagIds: formData.tagIds
            });
            createdId = expenseResp.id;
          }
        } else {
          const incomeResp = await incomeService.createIncome({
            incomeSourceId: formData.categoryId,
            accountId: formData.accountId,
            amount: parseFloat(formData.amount),
            date: formData.date,
            description: formData.description,
            currency: formData.currency,
            isRecurring: formData.isRecurring
          });
          createdId = incomeResp.id;
        }
      }

      // Handle attachments if it's an expense and new ones are uploaded
      if (createdId && type === 'Expense' && files.length > 0) {
        await Promise.all(files.map(file => expenseService.addAttachment(createdId!, file)));
      }

      showToast(t('common.success'), 'success');
      onSuccess();
    } catch (error) {
      console.error('Submit error:', error);
      showToast(t('common.error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  const inputClasses = (error?: string) => `w-full h-14 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl px-6 text-white placeholder:text-white/20 focus:border-accent-purple/50 focus:bg-white/[0.08] outline-none transition-all font-medium`;
  const labelClasses = "text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block ml-4";
  const errorClasses = "text-[10px] font-bold text-red-500 mt-2 ml-4 animate-fade-in";
  const checkboxClasses = "w-5 h-5 rounded border-white/10 bg-white/5 checked:bg-accent-purple transition-all cursor-pointer";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <label className={labelClasses}>{t('common.date')}</label>
          <input 
            type="date"
            required
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className={inputClasses(errors.date)}
          />
          {errors.date && <div className={errorClasses}>{errors.date}</div>}
        </div>
      </div>

      <div>
        <label className={labelClasses}>{t('common.description')}</label>
        <input 
          type="text"
          required
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className={inputClasses(errors.description)}
          placeholder="What was this for?"
        />
        {errors.description && <div className={errorClasses}>{errors.description}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>{t('common.account')}</label>
          <select 
            required
            value={formData.accountId}
            onChange={e => setFormData({ ...formData, accountId: e.target.value })}
            className={inputClasses(errors.accountId)}
          >
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id} className="bg-gray-800 text-white">{acc.name} ({acc.currency})</option>
            ))}
          </select>
          {errors.accountId && <div className={errorClasses}>{errors.accountId}</div>}
        </div>
        <div>
          <label className={labelClasses}>{t('common.category')}</label>
          <select 
            required
            value={formData.categoryId}
            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            className={inputClasses(errors.categoryId)}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id} className="bg-gray-800 text-white">{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <div className={errorClasses}>{errors.categoryId}</div>}
        </div>
      </div>

      <button 
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs font-black uppercase tracking-widest text-accent-purple/60 hover:text-accent-purple transition-colors ml-4"
      >
        {showAdvanced ? '- Hide' : '+ Show'} Advanced Options
      </button>

      {showAdvanced && (
        <div className="space-y-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <input 
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })}
              className={checkboxClasses}
            />
            <label htmlFor="isRecurring" className="text-sm font-bold text-white/60 cursor-pointer select-none">
              {t('common.is_recurring')}
            </label>
          </div>

          {formData.isRecurring && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div>
                <label className={labelClasses}>{t('common.frequency')}</label>
                <select 
                  value={formData.frequency}
                  onChange={e => setFormData({ ...formData, frequency: e.target.value as 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' })}
                  className={inputClasses()}
                >
                  <option value="Daily" className="bg-gray-800">{t('common.daily')}</option>
                  <option value="Weekly" className="bg-gray-800">{t('common.weekly')}</option>
                  <option value="Monthly" className="bg-gray-800">{t('common.monthly')}</option>
                  <option value="Yearly" className="bg-gray-800">{t('common.yearly')}</option>
                </select>
              </div>
              {formData.frequency === 'Monthly' && (
                <div>
                  <label className={labelClasses}>{t('common.day_of_month')}</label>
                  <input 
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dayOfMonth}
                    onChange={e => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                    className={inputClasses()}
                  />
                </div>
              )}
              {formData.frequency === 'Weekly' && (
                <div>
                  <label className={labelClasses}>{t('common.day_of_week')}</label>
                  <select 
                    value={formData.dayOfWeek}
                    onChange={e => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                    className={inputClasses()}
                  >
                    <option value="0" className="bg-gray-800">Sunday</option>
                    <option value="1" className="bg-gray-800">Monday</option>
                    <option value="2" className="bg-gray-800">Tuesday</option>
                    <option value="3" className="bg-gray-800">Wednesday</option>
                    <option value="4" className="bg-gray-800">Thursday</option>
                    <option value="5" className="bg-gray-800">Friday</option>
                    <option value="6" className="bg-gray-800">Saturday</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div>
            <label className={labelClasses}>{t('common.tags')}</label>
            <div className="flex flex-wrap gap-2 px-4 py-2">
              {availableTags.length === 0 && <p className="text-white/20 text-xs italic">{t('common.no_tags')}</p>}
              {availableTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-4 h-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                    formData.tagIds.includes(tag.id)
                      ? 'bg-accent-purple border-accent-purple text-white'
                      : 'border-white/10 text-white/40 hover:border-white/20'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {type === 'Expense' && (
            <div>
              <label className={labelClasses}>{t('common.attachments')}</label>
              <div className="px-4">
                <input 
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="w-full h-14 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-white/40 hover:border-accent-purple/40 hover:text-white/60 transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('common.upload_attachment')}</span>
                </label>
                {files.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-medium text-white/40">
                    {files.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full">{f.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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
          {isSubmitting ? '...' : (initialData ? t('common.save') : (type === 'Expense' ? t('dashboard.add_expense') : t('dashboard.add_income')))}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
