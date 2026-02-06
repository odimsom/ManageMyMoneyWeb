import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuth } from '../context/AuthContext';
import type { RegisterRequest, ApiError } from '../types/auth';

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
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await register({
        ...formData,
        verificationUrl: `${window.location.origin}/verify-email?token=`
      });
      alert('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-mesh text-white overflow-hidden" data-theme="night">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Abstract Design Side (Left) */}
      <div className="hidden lg:flex lg:w-[40%] relative justify-center items-center overflow-hidden border-r border-white/5">
        <div className="relative z-10 p-16 max-w-xl animate-fade-in-up">
           <div className="mb-12 flex items-center gap-4">
             <div className="p-3 bg-primary/20 rounded-2xl backdrop-blur-xl border border-primary/30">
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <span className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">ManageMyMoney</span>
           </div>
           
           <h2 className="text-5xl font-black tracking-tight leading-[1.1] mb-8">
             Your journey to <br />
             <span className="text-accent underline decoration-primary/30 underline-offset-8">Financial Freedom</span> <br />
             starts here.
           </h2>
           <p className="text-lg text-white/50 leading-relaxed font-medium mb-12">
             Configure your workspace in seconds. Track expenses, manage assets, and grow your wealth with professional-grade tools.
           </p>

           <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-colors">
                    <div className="text-3xl font-black text-primary">100%</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-2 font-bold group-hover:text-white/60 transition-colors">Free Analytics</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl group hover:bg-white/10 transition-colors">
                    <div className="text-3xl font-black text-accent">Vault</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-2 font-bold group-hover:text-white/60 transition-colors">Secure Encryption</div>
                </div>
           </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 py-12 lg:py-0 relative z-10 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="mb-10">
               <h2 className="text-4xl font-black text-white tracking-tight mb-3">Create Account</h2>
               <p className="text-white/40 font-medium">
                  Already participating?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-bold border-b-2 border-primary/20 hover:border-primary">
                    Secure Login
                  </Link>
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-white/50 text-xs uppercase tracking-widest">First Name</span>
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input input-bordered w-full h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary focus:ring-0 transition-all font-medium text-white"
                    placeholder="John"
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-bold text-white/50 text-xs uppercase tracking-widest">Last Name</span>
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input input-bordered w-full h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary focus:ring-0 transition-all font-medium text-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-bold text-white/50 text-xs uppercase tracking-widest">Email Address</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input input-bordered w-full h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary focus:ring-0 transition-all font-medium text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-bold text-white/50 text-xs uppercase tracking-widest">Default Currency</span>
                    </label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="select select-bordered w-full h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary focus:ring-0 transition-all font-bold text-white"
                    >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="DOP">DOP - Dominican Peso</option>
                    </select>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-bold text-white/50 text-xs uppercase tracking-widest">Security Pin</span>
                    </label>
                    <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input input-bordered w-full h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary focus:ring-0 transition-all font-medium text-white"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-bold text-white/50 text-xs uppercase tracking-widest">Confirm Pin</span>
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input input-bordered w-full h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary focus:ring-0 transition-all font-medium text-white"
                      placeholder="••••••••"
                    />
                  </div>
              </div>

              {error && (
                <div className="alert alert-error rounded-2xl border-none bg-error/20 text-error-content shadow-lg animate-fade-in-up">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold">{error}</span>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`btn btn-primary w-full h-14 rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-primary/20 border-none transition-all active:scale-[0.98] ${isLoading ? 'loading' : ''}`}
                >
                  {isLoading ? 'Processing Registration...' : 'Initialize Account'}
                </button>
              </div>
              
              <div className="text-center">
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] leading-loose">
                    By initializing your account, you agree to our <br />
                    <a href="#" className="text-white/40 hover:text-primary transition-colors border-b border-primary/20">Terms of Governance</a> and <a href="#" className="text-white/40 hover:text-primary transition-colors border-b border-primary/20">Data Privacy Protocol</a>.
                  </p>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};


export default Register;
