import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../features/auth/context/AuthContext';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-10">
      <header>
        <h1 className="text-4xl font-black tracking-tighter mb-2">{t('settings.title')}</h1>
        <p className="text-white/40 font-medium">{t('settings.description')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* Language Settings */}
          <div className="bg-card rounded-[2.5rem] p-10 border border-white/5">
            <h3 className="text-xl font-black mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              </div>
              {t('settings.language')}
            </h3>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => changeLanguage('en')}
                className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${i18n.language === 'en' ? 'bg-accent-purple/10 border-accent-purple text-white' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="font-black uppercase tracking-widest text-sm">English</span>
                </div>
                {i18n.language === 'en' && <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </button>

              <button 
                onClick={() => changeLanguage('es')}
                className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${i18n.language === 'es' ? 'bg-accent-purple/10 border-accent-purple text-white' : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🇪🇸</span>
                  <span className="font-black uppercase tracking-widest text-sm">Español</span>
                </div>
                {i18n.language === 'es' && <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </button>
            </div>
          </div>

          {/* Appearance (Placeholder) */}
          <div className="bg-card rounded-[2.5rem] p-10 border border-white/5">
            <h3 className="text-xl font-black mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              {t('settings.appearance')}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-accent-purple/10 border border-accent-purple flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-white/5 shadow-inner"></div>
                <span className="font-black uppercase tracking-widest text-[10px]">{t('settings.night_mode')}</span>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-transparent opacity-40 flex flex-col items-center gap-4 cursor-not-allowed">
                <div className="w-12 h-12 rounded-full bg-white border border-white/5 shadow-inner"></div>
                <span className="font-black uppercase tracking-widest text-[10px]">{t('settings.light_mode')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Profile Summary */}
          <div className="bg-card rounded-[2.5rem] p-10 border border-white/5">
            <h3 className="text-xl font-black mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              {t('settings.profile')}
            </h3>
            
            <div className="flex flex-col items-center py-6">
              <div className="w-24 h-24 rounded-[2rem] bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-4xl font-black text-accent-purple mb-6 shadow-2xl">
                {user?.firstName?.charAt(0)}
              </div>
              <h4 className="text-2xl font-black">{user?.firstName} {user?.lastName}</h4>
              <p className="text-white/20 font-medium mb-10">{user?.email}</p>
              
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="text-[10px] font-black uppercase text-white/20 mb-1">Account Type</div>
                   <div className="text-sm font-black uppercase tracking-widest text-accent-purple">Premium</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="text-[10px] font-black uppercase text-white/20 mb-1">Member Since</div>
                   <div className="text-sm font-black uppercase tracking-widest text-white/60">Feb 2026</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-accent-purple to-purple-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-accent-purple/20 relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-black mb-4">Refer & Earn</h3>
                <p className="text-white/80 font-medium mb-8">Share ManageMyMoney with your friends and get 3 months of Premium for free.</p>
                <button className="h-14 px-8 bg-white text-accent-purple font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20">
                   Get Invite Link
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl shadow-inner"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
