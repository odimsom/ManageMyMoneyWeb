import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { incomeService } from '../services/incomeService';
import type { Income, IncomeSource } from '../services/incomeService';
import { accountService } from '../services/accountService';
import type { Account } from '../services/accountService';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/forms/TransactionForm';

import IncomeSourceForm from '../components/forms/IncomeSourceForm';

const IncomePage: React.FC = () => {
  const { t } = useTranslation();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [sources, setSources] = useState<IncomeSource[]>([]);
  const [, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<IncomeSource | undefined>(undefined);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [incomeData, sourceData, accountData] = await Promise.all([
        incomeService.getIncomes({ pageSize: 10 }),
        incomeService.getIncomeSources(),
        accountService.getAccounts()
      ]);
      setIncomes(incomeData.data.items || []);
      setSources(sourceData);
      setAccounts(accountData);
    } catch (error) {
      console.error('Failed to fetch income data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const handleAddSource = () => {
    setSelectedSource(undefined);
    setIsSourceModalOpen(true);
  };

  const handleEditSource = (source: IncomeSource) => {
    setSelectedSource(source);
    setIsSourceModalOpen(true);
  };

  const handleSourceSuccess = () => {
    setIsSourceModalOpen(false);
    fetchData();
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-40 bg-glass rounded-[2.5rem]"></div>
      <div className="h-96 bg-glass rounded-[2.5rem]"></div>
    </div>;
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-base-content">{t('income.title')}</h1>
          <p className="text-base-content-muted font-medium">{t('income.description')}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-16 px-10 bg-accent-purple text-white font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20 flex items-center gap-4"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          {t('income.add_new')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-[2.5rem] p-10 border border-border-subtle">
            <h3 className="text-xl font-black mb-8 text-base-content">{t('income.recent_records')}</h3>
            <div className="space-y-4">
              {incomes.length === 0 ? (
                <div className="text-center py-20 text-base-content-muted font-black uppercase text-sm italic">
                  {t('income.no_records')}
                </div>
              ) : (
                incomes.map((income) => (
                  <div key={income.id} className="group flex items-center justify-between p-6 rounded-[2rem] hover:bg-glass/20 transition-all border border-transparent hover:border-border-subtle">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500/20 transition-all">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <div className="font-black text-base-content group-hover:text-green-500 transition-colors">{income.description || income.incomeSourceName}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-base-content-muted">{income.incomeSourceName} • {new Date(income.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-green-400">+{formatCurrency(income.amount)}</div>
                      <div className="text-[9px] font-black uppercase tracking-tighter text-base-content-muted">{income.accountName}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-card rounded-[2.5rem] p-10 border border-border-subtle">
            <h3 className="text-lg font-black mb-8 text-base-content">{t('income.sources')}</h3>
            <div className="space-y-6">
              {sources.map(source => (
                <div key={source.id} className="flex items-center justify-between text-base-content-muted hover:text-base-content transition-colors">
                  <div>
                    <div className="text-sm font-black">{source.name}</div>
                    {source.averageAmount && <div className="text-[9px] font-black uppercase text-base-content-muted/60">{t('income.avg')}: {formatCurrency(source.averageAmount)}</div>}
                  </div>
                  <div 
                    onClick={() => handleEditSource(source)}
                    className="w-10 h-10 rounded-xl bg-glass flex items-center justify-center text-base-content-muted hover:text-base-content hover:bg-glass/20 cursor-pointer transition-all border border-border-subtle"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleAddSource}
                className="w-full h-12 rounded-2xl border-2 border-dashed border-border-subtle hover:border-accent-purple/40 hover:bg-accent-purple/5 transition-all text-[10px] font-black uppercase text-base-content-muted hover:text-base-content"
              >
                {t('income.add_source')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={t('income.add_new')}
      >
        <TransactionForm 
          type="Income" 
          onCancel={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      </Modal>

      <Modal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        title={selectedSource ? t('income.edit_source') : t('income.add_source')}
      >
        <IncomeSourceForm 
          initialData={selectedSource}
          onSuccess={handleSourceSuccess}
          onCancel={() => setIsSourceModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default IncomePage;
