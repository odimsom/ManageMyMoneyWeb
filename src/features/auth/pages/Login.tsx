import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuth } from '../../auth/context/AuthContext';
import { useToast } from '../../../hooks/useToast';
import type { LoginRequest, ApiError } from '../../auth/types/auth';
import { useEffect } from 'react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(formData);
      showToast('Acceso concedido. Bienvenido a ManageMyMoney.', 'success');
      navigate('/');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Identidad no reconocida. Acceso denegado.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mmm-mesh flex items-center justify-center p-6 relative overflow-hidden" data-theme="night">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/10 rounded-full blur-[140px] animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-yellow/5 rounded-full blur-[140px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-[480px] z-10">
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="flex items-center gap-3 group cursor-default">
             <div className="w-12 h-12 bg-accent-purple rounded-[1.25rem] flex items-center justify-center rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-2xl shadow-accent-purple/40">
                <span className="text-xl font-black italic text-white">M</span>
             </div>
             <span className="text-3xl font-black tracking-tighter text-white">ManageMyMoney</span>
          </div>
        </div>

        <div className="card-elite animate-fade-in-up border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black mb-2 tracking-tight text-white">Secure Access</h2>
            <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px]">Manage your wealth with confidence</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-6">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-full h-16 px-8 focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all outline-none font-bold text-lg text-white placeholder:text-white/10"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-6">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Password</label>
                <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-purple hover:text-white transition-colors">Forgot?</a>
              </div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-full h-16 px-8 focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all outline-none font-bold text-lg text-white placeholder:text-white/10"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] p-4 text-center text-sm font-bold animate-fade-in shadow-xl">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-16 rounded-full bg-accent-purple text-white font-black text-xl shadow-2xl shadow-accent-purple/20 hover:shadow-accent-purple/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <>
                    Sign In
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-white/20 text-xs font-bold">
              New here?{' '}
              <Link to="/register" className="text-accent-yellow hover:text-white transition-colors border-b-2 border-accent-yellow/20 hover:border-white">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
           <div className="flex items-center gap-2 opacity-10 hover:opacity-50 transition-opacity cursor-default">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Server Online</span>
           </div>
           <div className="flex items-center gap-2 opacity-10">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">MMM Core v1.2</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
