import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../features/auth/context/AuthContext';

import NotificationList from './layout/NotificationList';

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: t('common.statistics'), path: '/', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2" /></svg>
    )},
    { name: t('reports.title'), path: '/reports', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 00-4-4H5m11 2a4 4 0 10-4-4v5m-3 3h3m6 0h3" /></svg>
    )},
    { name: t('income.title'), path: '/income', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { name: t('transactions.title_nav') || 'Transactions', path: '/transactions', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    )},
    { name: t('budgets.title'), path: '/budgets', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { name: t('categories.title'), path: '/categories', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
    )},
    { name: t('accounts.title'), path: '/accounts', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    )},
    { name: t('settings.title'), path: '/settings', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-bg-deep text-white flex p-4 md:p-6 lg:p-10 gap-6 lg:gap-10" data-theme="night">
      
      {/* Sidebar - Fixed Floating Pill */}
      <aside className="hidden lg:flex flex-col w-20 bg-card rounded-[2.5rem] p-4 items-center justify-between border border-white/5 shadow-2xl fixed left-6 top-10 bottom-10 z-30">
        <div className="flex flex-col items-center gap-10">
           <div className="w-12 h-12 bg-accent-purple rounded-2xl flex items-center justify-center rotate-12 shadow-lg shadow-accent-purple/20">
              <span className="text-xl font-black italic">M</span>
           </div>
           
           <nav className="flex flex-col gap-6">
              {navItems.map((item) => {
                 const isActive = location.pathname === item.path;
                 return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`p-4 rounded-2xl transition-all relative group ${isActive ? 'bg-accent-purple text-white' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                    title={item.name}
                  >
                    {item.icon}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full px-3 py-1 bg-white text-black text-[10px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                      {item.name}
                    </div>
                  </Link>
                 )
              })}
           </nav>
        </div>

        <div className="flex flex-col gap-6 items-center">
           <button onClick={handleLogout} className="p-4 rounded-2xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all" title={t('common.logout') || 'Logout'}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-32">
        
        {/* Modern Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-12">
            <div className="flex items-center gap-12 flex-1">
               <div className="hidden md:flex flex-1 max-w-md relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder={t('transactions.search_placeholder')} 
                    className="w-full h-14 bg-card rounded-2xl pl-16 pr-8 border border-white/5 focus:border-accent-purple/50 outline-none font-bold text-sm transition-all"
                  />
               </div>
            </div>

            <div className="flex items-center gap-6">
               <NotificationList />
               <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-white">{user?.firstName} {user?.lastName}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{t('common.premium_plan') || 'Premium Plan'}</span>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple font-black">
                  {user?.firstName?.charAt(0)}
               </div>
            </div>
        </header>


        <main className="flex-1">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
