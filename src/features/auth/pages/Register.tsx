import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../../../hooks/useToast';
import type { RegisterRequest, ApiError } from '../types/auth';
import { useEffect } from 'react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    currency: 'USD',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      const msg = "Las contraseñas no coinciden";
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        ...formData,
        verificationUrl: `${window.location.origin}/verify-email`
      });
      showToast('¡Registro exitoso! Por favor verifica tu correo electrónico.', 'success');
      navigate('/login');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message || 'Error al procesar el registro.';
      
      let displayError = message;
      if (message.toLowerCase().includes('already') || message.toLowerCase().includes('existe')) {
        displayError = 'Este correo ya está registrado. Intenta iniciar sesión.';
      }
      
      setError(displayError);
      showToast(displayError, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mmm-mesh flex items-center justify-center p-6 relative overflow-hidden" data-theme="night">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-purple/10 rounded-full blur-[140px] animate-blob"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-yellow/5 rounded-full blur-[140px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <div className="flex justify-center mb-10 animate-fade-in">
          <div className="flex items-center gap-3 group cursor-default">
             <div className="w-10 h-10 bg-accent-purple rounded-[1rem] flex items-center justify-center rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-xl shadow-accent-purple/40">
                <span className="text-lg font-black italic text-white">M</span>
             </div>
             <span className="text-2xl font-black tracking-tighter text-white">ManageMyMoney</span>
          </div>
        </div>

        <div className="card-elite animate-fade-in-up border border-white/5 shadow-2xl relative">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black mb-2 tracking-tight text-white">Create Account</h2>
            <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[9px]">Start your financial journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-6">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-full h-14 px-8 focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all outline-none font-bold text-white placeholder:text-white/10"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-6">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-full h-14 px-8 focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all outline-none font-bold text-white placeholder:text-white/10"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-6">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-full h-14 px-8 focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all outline-none font-bold text-white placeholder:text-white/10"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-6">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-full h-14 px-8 focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all outline-none font-bold text-white appearance-none cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="DOP">DOP (RD$)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-6">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-full h-14 px-8 focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all outline-none font-bold text-white placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-6">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-full h-14 px-8 focus:border-accent-purple/50 focus:bg-white/[0.05] transition-all outline-none font-bold text-white placeholder:text-white/10"
                  placeholder="••••••••"
                />
              </div>
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
                className={`w-full h-16 rounded-full bg-accent-purple text-white font-black text-xl shadow-2xl shadow-accent-purple/20 hover:shadow-accent-purple/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <>
                    Create Account
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-white/20 text-xs font-bold">
              Already a member?{' '}
              <Link to="/login" className="text-accent-yellow hover:text-white transition-colors border-b-2 border-accent-yellow/20 hover:border-white">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
