import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useAuth } from '../../auth/context/AuthContext';
import type { LoginRequest, ApiError } from '../../auth/types/auth';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      navigate('/');
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-mesh text-white overflow-hidden" data-theme="night">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Abstract Design Side */}
      <div className="hidden lg:flex lg:w-[45%] relative justify-center items-center overflow-hidden border-r border-white/5">
        <div className="relative z-10 p-16 max-w-xl animate-fade-in-up">
           <div className="mb-12 flex items-center gap-4 group">
             <div className="p-3 bg-primary/20 rounded-2xl backdrop-blur-xl border border-primary/30 group-hover:scale-110 transition-transform duration-500">
                <svg className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <span className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">ManageMyMoney</span>
           </div>
           
           <h1 className="text-6xl font-black tracking-tight leading-[1.1] mb-8">
             Master your <br />
             <span className="text-primary italic">Finances</span>, secure <br />
             your <span className="opacity-60 font-light">future.</span>
           </h1>
           <p className="text-xl text-white/50 leading-relaxed font-medium mb-12">
             Join the next generation of financial management. Professional tools, advanced insights, and absolute security.
           </p>

           <div className="flex gap-12 items-center">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className={`w-12 h-12 rounded-full border-4 border-[#0a0c10] bg-base-200 flex items-center justify-center text-[10px] font-bold overflow-hidden`}>
                      <div className={`w-full h-full bg-gradient-to-br ${i % 2 === 0 ? 'from-primary to-accent' : 'from-secondary to-primary'} opacity-80`}></div>
                   </div>
                 ))}
              </div>
              <div>
                 <p className="text-sm font-bold text-white">Trusted by 25k+ professionals</p>
                 <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Enterprise Ready</p>
              </div>
           </div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative z-10">
        <div className="mx-auto w-full max-w-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="mb-12">
               <div className="lg:hidden mb-10 flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-xl">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                  </div>
                  <span className="text-2xl font-black">MMM</span>
               </div>
               <h2 className="text-4xl font-black text-white tracking-tight mb-3">Welcome Back</h2>
               <p className="text-white/40 font-medium">
                  Don't have an account yet?{' '}
                  <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-bold border-b-2 border-primary/20 hover:border-primary">
                    Join the waitlist
                  </Link>
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-white/50 text-xs uppercase tracking-widest">Email Address</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary focus:ring-0 transition-all font-medium text-white placeholder:text-white/20"
                  placeholder="name@company.com"
                />
              </div>

              <div className="form-control w-full">
                <div className="flex justify-between items-center mb-1">
                   <label className="label py-0">
                     <span className="label-text font-bold text-white/50 text-xs uppercase tracking-widest">Security Code</span>
                   </label>
                   <a href="#" className="text-xs font-bold text-primary/60 hover:text-primary transition-colors">
                      Forgot?
                   </a>
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary focus:ring-0 transition-all font-medium text-white placeholder:text-white/20"
                  placeholder="••••••••"
                />
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
                  {isLoading ? 'Verifying...' : 'System Access'}
                </button>
              </div>

               <div className="divider opacity-10 uppercase text-[10px] font-bold tracking-[0.3em] my-10 text-white">Secure Authentication</div>

                <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="btn btn-ghost bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl h-14 gap-3 font-bold group">
                      <span className="text-sm opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Google</span>
                    </button>
                    <button type="button" className="btn btn-ghost bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl h-14 gap-3 font-bold group">
                         <span className="text-sm opacity-60 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Github</span>
                    </button>
                </div>
            </form>
            
            <footer className="mt-20 flex justify-between items-center opacity-30">
               <p className="text-[10px] font-bold uppercase tracking-widest">v2.4.0 Stable</p>
               <div className="flex gap-4">
                   <div className="w-2 h-2 rounded-full bg-success"></div>
                   <p className="text-[10px] font-bold uppercase tracking-widest">All Systems Operational</p>
               </div>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
