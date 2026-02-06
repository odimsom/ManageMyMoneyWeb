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
    <div className="flex min-h-screen">
      {/* Abstract Design Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-800 opacity-90"></div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

        <div className="relative z-10 p-12 text-white max-w-lg">
           <div className="mb-8 flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <span className="text-3xl font-bold tracking-tight">ManageMyMoney</span>
           </div>
           
           <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
             Master your finances, <br />
             <span className="text-blue-200">secure your future.</span>
           </h1>
           <p className="text-lg text-indigo-100 leading-relaxed font-light">
             Join thousands of users who have transformed their financial life with our comprehensive tracking and budgeting tools.
           </p>

           <div className="mt-10 flex gap-4">
              <div className="flex -space-x-2">
                 <div className="w-10 h-10 rounded-full bg-indigo-300 border-2 border-indigo-900"></div>
                 <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-indigo-900"></div>
                 <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-900"></div>
              </div>
              <p className="text-sm font-medium text-indigo-200 self-center">Trusted by 10k+ users</p>
           </div>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center lg:text-left mb-10">
               <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign in</h2>
               <p className="mt-2 text-sm text-gray-600">
                  New to ManageMyMoney?{' '}
                  <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Create an account
                  </Link>
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                   </label>
                   <div className="text-sm">
                      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                   </div>
                </div>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-100 animate-fade-in">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all transform active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

               {/* Social Login Divider (Optional Future Proofing) */}
               <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-50 px-2 text-sm text-gray-500">Or continue with</span>
                  </div>
               </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button type="button" className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent">
                      <span className="text-sm font-medium">Google</span>
                    </button>
                    <button type="button" className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent">
                         <span className="text-sm font-medium">Microsoft</span>
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
