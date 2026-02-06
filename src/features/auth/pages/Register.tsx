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
        verificationUrl: `${window.location.origin}/verify-email`
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
    <div className="flex min-h-screen">
      {/* Abstract Design Side (Left) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-800 to-indigo-700 opacity-90"></div>
        
        {/* Decorative Circles */}
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-400 opacity-10 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>

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
             Start your journey <br />
             <span className="text-purple-200">to financial freedom.</span>
           </h1>
           <p className="text-lg text-indigo-100 leading-relaxed font-light">
             Create an account today to track expenses, set budgets, and achieve your financial goals with ease.
           </p>

           <div className="mt-12 grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                   <div className="text-2xl font-bold">100%</div>
                   <div className="text-xs text-indigo-200 uppercase tracking-wider mt-1">Free to start</div>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                   <div className="text-2xl font-bold">Secure</div>
                   <div className="text-xs text-indigo-200 uppercase tracking-wider mt-1">Bank-level Security</div>
               </div>
           </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 py-12 lg:py-0">
        <div className="mx-auto w-full max-w-lg">
            <div className="text-center lg:text-left mb-8">
               <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h2>
               <p className="mt-2 text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                    Sign in here
                  </Link>
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
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
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                <div className="mt-1">
                    <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all bg-white"
                    >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="DOP">DOP - Dominican Peso</option>
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-all"
                        placeholder="••••••••"
                      />
                    </div>
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
                    'Create Account'
                  )}
                </button>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                  By signing up, you agree to our <a href="#" className="underline hover:text-gray-900">Terms of Service</a> and <a href="#" className="underline hover:text-gray-900">Privacy Policy</a>.
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};


export default Register;
