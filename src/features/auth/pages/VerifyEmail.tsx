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
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        await authService.verifyEmail(token);
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
    <div className="min-h-screen bg-mesh text-white flex items-center justify-center p-6 overflow-hidden" data-theme="night">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] bg-accent/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg animate-fade-in">
        <div className="glass-panel rounded-[2rem] p-10 border-white/5 shadow-2xl overflow-hidden relative group">
          {/* Subtle decoration inside the card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-700"></div>

          <div className="text-center relative z-10">
            
            {status === 'verifying' && (
              <div className="animate-fade-in-up">
                <div className="mx-auto h-24 w-24 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative">
                      <div className="w-16 h-16 border-[5px] border-white/10 border-t-primary rounded-full animate-spin"></div>
                    </div>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-4 uppercase italic">Validating Link</h2>
                <p className="text-white/50 font-medium leading-relaxed">
                  Our security protocols are verifying your access key. <br />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary mt-4 block">System Scan In Progress</span>
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="animate-fade-in-up">
                <div className="mx-auto h-24 w-24 flex items-center justify-center mb-8 bg-success/20 rounded-full animate-bounce">
                  <svg className="h-12 w-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-4">Verification Success</h2>
                <p className="text-white/50 font-medium mb-12">
                  Access granted. Your identity has been successfully confirmed within our global ledger.
                </p>
                
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary w-full h-14 rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-primary/20 border-none group"
                >
                  Enter Workspace
                  <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="animate-fade-in-up">
                <div className="mx-auto h-24 w-24 flex items-center justify-center mb-8 bg-error/20 rounded-full">
                  <svg className="h-12 w-12 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-4 uppercase">Protocol Failure</h2>
                <div className="bg-error/10 border border-error/20 p-5 rounded-2xl text-sm mb-10">
                    <p className="text-error font-bold leading-relaxed">{message}</p>
                </div>
                
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-ghost bg-white/5 hover:bg-white/10 w-full h-14 rounded-2xl font-black uppercase tracking-widest border border-white/5"
                >
                  Return to Base
                </button>
              </div>
            )}

          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              ManageMyMoney &copy; {new Date().getFullYear()} &bull; Secure Protocol
            </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
