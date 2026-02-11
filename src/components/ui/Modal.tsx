import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isRendered, setIsRendered] = useState(isOpen);

  // Synchronize isRendered with isOpen for the "opening" phase immediately
  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else if (isRendered) {
      const timer = window.setTimeout(() => {
        setIsRendered(false);
      }, 300);
      document.body.style.overflow = 'unset';
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  if (!isRendered && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div 
        className={`relative w-full max-w-2xl bg-card border border-border-subtle rounded-[2.5rem] shadow-2xl transition-all duration-500 transform overflow-hidden ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-12'}`}
      >
        <div className="flex items-center justify-between p-8 border-b border-border-subtle">
          <h2 className="text-2xl font-black text-base-content">{title}</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-glass flex items-center justify-center text-base-content-muted hover:text-base-content hover:bg-glass/20 transition-all border border-border-subtle"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
