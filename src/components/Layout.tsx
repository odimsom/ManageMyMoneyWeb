import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { useTranslation } from 'react-i18next';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: t('dashboard.title'), path: '/', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
    )},
    { name: 'Transactions', path: '/transactions', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    )},
    { name: 'Budgets', path: '/budgets', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
    )},
    { name: 'Reports', path: '/reports', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-base-300 flex text-base-content" data-theme="night">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-base-200 border-r border-base-100 min-h-screen fixed left-0 top-0 bottom-0 z-30 shadow-2xl">
        <div className="p-8 flex items-center gap-4">
             <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <div>
                <span className="text-xl font-black tracking-tighter text-white">ManageMyMoney</span>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/60">Digital Assets</p>
             </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' 
                    : 'text-base-content/60 hover:bg-base-100 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-primary-content' : 'text-primary/70 group-hover:text-primary transition-colors'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
             )
          })}
        </nav>

        <div className="p-6 mt-auto bg-base-300/50 border-t border-base-100">
           {/* User Profile Summary */}
           <div className="flex items-center gap-4 mb-6">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-12 border-2 border-primary/20 shadow-lg">
                  <span className="text-lg font-bold">{user?.firstName?.charAt(0) || 'U'}</span>
                </div>
              </div>
              <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[11px] text-base-content/50 truncate font-mono uppercase tracking-wider">{user?.currency || 'USD'}</p>
              </div>
           </div>

           <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2 mb-2">
                 <button className={`btn btn-xs rounded-lg ${i18n.language === 'en' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => changeLanguage('en')}>EN</button>
                 <button className={`btn btn-xs rounded-lg ${i18n.language === 'es' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => changeLanguage('es')}>ES</button>
              </div>
              
              <button 
                onClick={handleLogout}
                className="btn btn-error btn-outline btn-sm w-full rounded-xl gap-2 font-bold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Logout
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-20 bg-base-200/80 backdrop-blur-xl border-b border-base-100 px-6 py-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                 <button onClick={() => setSidebarOpen(true)} className="md:hidden btn btn-ghost btn-square">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                 </button>
                 <h1 className="text-xl font-black text-white tracking-tight">
                   {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                 </h1>
             </div>

             <div className="flex items-center gap-2">
                <div className="dropdown dropdown-end">
                   <button className="btn btn-ghost btn-circle">
                      <div className="indicator">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                      </div>
                   </button>
                </div>
                
                <div className="avatar online md:hidden">
                   <div className="w-8 rounded-full border border-primary/20">
                      <span className="text-xs flex items-center justify-center h-full font-bold">{user?.firstName?.charAt(0)}</span>
                   </div>
                </div>
             </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-300 p-6 md:p-10">
            <div className="max-w-7xl mx-auto animate-fade-in">
                <Outlet />
            </div>
        </main>
      </div>

      {/* Drawer for Mobile (Redesigned with Sidebar Logic) */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <div className={`absolute top-0 left-0 w-80 h-full bg-base-200 shadow-2xl transition-transform duration-300 ease-out border-r border-base-100 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="flex flex-col h-full">
                  <div className="p-8 flex items-center justify-between border-b border-base-100">
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                              <svg className="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                          </div>
                          <span className="text-lg font-black tracking-tight text-white">MMM</span>
                      </div>
                      <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm btn-circle">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                  
                  <nav className="flex-1 p-4 space-y-1">
                      {navItems.map((item) => (
                          <Link
                              key={item.name}
                              to={item.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${ location.pathname === item.path ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'text-base-content/70 hover:bg-base-100'}`}
                          >
                              {item.icon}
                              {item.name}
                          </Link>
                      ))}
                  </nav>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Layout;
