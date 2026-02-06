import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { transactionsService } from '../services/transactionsService';
import type { Transaction, TransactionFilters } from '../services/transactionsService';
import { categoryService } from '../services/categoryService';
import type { Category } from '../services/categoryService';
import { useToast } from '../hooks/useToast';

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<TransactionFilters>({
    pageNumber: 1,
    pageSize: 20,
    search: '',
    categoryId: ''
  });

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await transactionsService.getTransactions(filters);
      setTransactions(response.data);
    } catch {
      showToast('Error al cargar transacciones', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, pageNumber: 1 }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, categoryId: e.target.value, pageNumber: 1 }));
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-black text-white">{t('dashboard.recent_transactions')}</h1>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              value={filters.search}
              onChange={handleSearchChange}
              className="h-12 bg-card rounded-xl pl-12 pr-6 border border-white/5 focus:border-accent-purple/50 outline-none font-bold text-xs transition-all w-64"
            />
          </div>

          <select 
            value={filters.categoryId}
            onChange={handleCategoryChange}
            className="h-12 bg-card rounded-xl px-6 border border-white/5 focus:border-accent-purple/50 outline-none font-black text-[10px] uppercase tracking-widest transition-all appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] p-10 border border-white/5">
        {isLoading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/5 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-white/20">
                  <th className="px-6 pb-2">Description</th>
                  <th className="px-6 pb-2">Category</th>
                  <th className="px-6 pb-2">Account</th>
                  <th className="px-6 pb-2">Date</th>
                  <th className="px-6 pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-white/10 font-black uppercase tracking-widest text-sm italic">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="group hover:bg-white/[0.03] transition-all">
                      <td className="px-6 py-4 bg-white/[0.02] rounded-l-[1.5rem] border-y border-l border-white/5 group-hover:border-accent-purple/50">
                        <div className="font-black text-white group-hover:text-accent-purple transition-colors">{t.description}</div>
                      </td>
                      <td className="px-6 py-4 bg-white/[0.02] border-y border-white/5 group-hover:border-accent-purple/50">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/40">
                          {t.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 bg-white/[0.02] border-y border-white/5 group-hover:border-accent-purple/50 text-[10px] font-black uppercase tracking-widest text-white/20">
                        {t.accountName}
                      </td>
                      <td className="px-6 py-4 bg-white/[0.02] border-y border-white/5 group-hover:border-accent-purple/50 text-[10px] font-black uppercase tracking-widest text-white/20">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 bg-white/[0.02] rounded-r-[1.5rem] border-y border-r border-white/5 group-hover:border-accent-purple/50 text-right">
                        <div className="text-lg font-black text-white">{formatCurrency(t.amount, t.currency)}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
