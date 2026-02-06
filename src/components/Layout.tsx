import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Statistics', path: '/', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2" /></svg>
    )},
    { name: 'Transactions', path: '/transactions', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { name: 'Budgets', path: '/budgets', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )},
    { name: 'Settings', path: '/settings', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-bg-deep text-white flex p-4 md:p-6 lg:p-10 gap-6 lg:gap-10" data-theme="night">
      
      {/* Sidebar - Floating Pill */}
      <aside className="hidden lg:flex flex-col w-20 bg-card rounded-[2.5rem] p-4 items-center justify-between border border-white/5 shadow-2xl relative z-30">
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
                    {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 px-3 py-1 bg-white text-black text-[10px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">{item.name}</div>}
                  </Link>
                 )
              })}
           </nav>
        </div>

        <div className="flex flex-col gap-6 items-center">
           <button onClick={handleLogout} className="p-4 rounded-2xl text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all" title="Logout">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Modern Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-12">
            <div className="flex items-center gap-12 flex-1">
               <div className="hidden md:flex flex-1 max-w-md relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Find transaction..." 
                    className="w-full h-14 bg-card rounded-2xl pl-16 pr-8 border border-white/5 focus:border-accent-purple/50 outline-none font-bold text-sm transition-all"
                  />
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-white">{user?.firstName} {user?.lastName}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Premium Plan</span>
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
