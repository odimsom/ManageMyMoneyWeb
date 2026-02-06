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
      const tokenValue = searchParams.get('token') || searchParams.get('code');
      if (!tokenValue) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        await authService.verifyEmail(tokenValue);
        setStatus('success');
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        setStatus('error');
        setMessage(error.response?.data?.message || 'Protocol failure. Verification aborted.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-bg-deep flex items-center justify-center p-6 relative overflow-hidden" data-theme="night">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-accent-purple/10 rounded-full blur-[140px] animate-blob"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-accent-yellow/5 rounded-full blur-[140px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-[480px] z-10 text-center">
        <div className="card-elite animate-fade-in-up border border-white/5 shadow-2xl relative overflow-hidden">
          {status === 'verifying' && (
            <div className="py-12 space-y-8">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 bg-accent-purple/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="w-full h-full border-[6px] border-white/5 border-t-accent-purple rounded-full animate-spin"></div>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Syncing Node</h2>
                <p className="text-white/30 font-black uppercase tracking-[0.2em] text-[9px]">Analyzing Security Certificate</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-12 space-y-8 animate-fade-in">
              <div className="w-24 h-24 bg-green-500/20 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-green-500/20">
                <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Gate Open</h2>
                <p className="text-white/30 font-black uppercase tracking-[0.2em] text-[9px]">Identity Confirmed. Nexus Initialized.</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full h-16 rounded-full bg-accent-purple text-white font-black text-xl shadow-2xl shadow-accent-purple/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Access Base
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="py-12 space-y-8 animate-fade-in">
              <div className="w-24 h-24 bg-red-500/20 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="px-4">
                <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Access Aborted</h2>
                <p className="text-red-500/60 font-black uppercase tracking-[0.1em] text-[10px] bg-red-500/10 p-4 rounded-3xl border border-red-500/10 mb-8">{message}</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full h-16 rounded-full bg-white/5 border border-white/5 text-white font-black text-lg hover:bg-white/10 transition-all"
              >
                Return to Node
              </button>
            </div>
          )}
        </div>

        <div className="mt-12 text-center opacity-10">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white">System: MMM Secure Ledger v2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
