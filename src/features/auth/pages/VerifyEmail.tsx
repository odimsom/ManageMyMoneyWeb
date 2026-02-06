import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { authService } from '../services/authService';
import type { ApiError } from '../types/auth';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      const code = searchParams.get('code');
      if (!code) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        await authService.verifyEmail(code);
        setStatus('success');
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        setStatus('error');
        setMessage(error.response?.data?.message || error.message || 'Verification failed. Please try again.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-gray-900"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center">
            
            {status === 'verifying' && (
              <div className="animate-fade-in">
                <div className="mx-auto h-16 w-16 flex items-center justify-center mb-6">
                   <div className="relative">
                     <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                   </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email</h2>
                <p className="text-gray-500">Please wait a moment while we confirm your details.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="animate-fade-in-up">
                <div className="mx-auto h-20 w-20 flex items-center justify-center mb-6 bg-green-50 rounded-full">
                  <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                <p className="text-gray-500 mb-8">Your account has been successfully verified. You can now access all features.</p>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
                >
                  Continue to Login
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="animate-fade-in-up">
                <div className="mx-auto h-20 w-20 flex items-center justify-center mb-6 bg-red-50 rounded-full">
                  <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                <p className="text-red-500 bg-red-50 p-3 rounded-lg text-sm mb-6 border border-red-100">{message}</p>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full inline-flex justify-center items-center px-6 py-3 border-2 border-indigo-600 text-base font-medium rounded-lg text-indigo-600 bg-transparent hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Return to Login
                </button>
              </div>
            )}

          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-indigo-200 text-sm">
            &copy; {new Date().getFullYear()} ManageMyMoney. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
