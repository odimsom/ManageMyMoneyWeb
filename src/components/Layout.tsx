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
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
    )},
    { name: 'Transactions', path: '/transactions', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    )},
    { name: 'Budgets', path: '/budgets', icon: (
      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
    )},
    { name: 'Reports', path: '/reports', icon: (
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" data-theme="light">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-indigo-900 text-white min-h-screen fixed left-0 top-0 bottom-0 z-30 shadow-xl transition-all duration-300 ease-in-out">
        <div className="p-6 border-b border-indigo-800 flex items-center gap-3">
             <div className="bg-white/10 p-1.5 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <span className="text-lg font-bold tracking-tight">ManageMyMoney</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-700 text-white shadow-md translate-x-1' 
                    : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
             )
          })}
        </nav>

        <div className="p-4 border-t border-indigo-800 space-y-4">
           {/* Language Switcher */}
           <div className="flex gap-2 justify-center pb-2">
                 <button className={`btn btn-xs ${i18n.language === 'en' ? 'btn-primary' : 'btn-ghost text-white'}`} onClick={() => changeLanguage('en')}>EN</button>
                 <button className={`btn btn-xs ${i18n.language === 'es' ? 'btn-primary' : 'btn-ghost text-white'}`} onClick={() => changeLanguage('es')}>ES</button>
           </div>
           
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg border-2 border-indigo-400">
                 {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                  <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-indigo-300 truncate w-32">{user?.email}</p>
              </div>
           </div>
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-200 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-colors"
           >
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
             Logout
           </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
               <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={() => setSidebarOpen(false)}></div>
               <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-900 text-white">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <svg className="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="p-6 border-b border-indigo-800 flex items-center gap-3">
                     <span className="text-xl font-bold">ManageMyMoney</span>
                  </div>
                  <nav className="flex-1 px-4 py-4 space-y-2">
                       {navItems.map((item) => (
                           <Link
                              key={item.name}
                              to={item.path}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium ${ location.pathname === item.path ? 'bg-indigo-700' : 'hover:bg-white/10'}`}
                           >
                             {item.icon}
                             {item.name}
                           </Link>
                       ))}
                  </nav>
               </div>
          </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-indigo-900 text-white p-4 flex items-center justify-between shadow-md">
            <span className="font-bold text-lg">ManageMyMoney</span>
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-white/10">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
        </div>

        {/* Top Header (Desktop Optional - Simple) */}
        <header className="bg-white shadow-sm border-b border-gray-100 hidden md:flex items-center justify-between px-8 py-4">
             <h1 className="text-2xl font-bold text-gray-800">
               {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
             </h1>
             <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
             </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
