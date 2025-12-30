
import React from 'react';

interface HeroProps {
  onRSVPClick: () => void;
  onViewGuestsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRSVPClick, onViewGuestsClick }) => {
  return (
    <div className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black to-black -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000">
          NYE <span className="gold-gradient">2026</span>
          <br />
          RSVP
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 font-light tracking-[0.2em] uppercase animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          Black Dress. Great Food. Midnight Madness.
        </p>
        
        <div className="pt-10 flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <button 
            onClick={onRSVPClick}
            className="group relative px-10 py-4 bg-transparent border border-[#BF953F] overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 gold-bg translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 text-[#BF953F] group-hover:text-black font-semibold text-lg uppercase tracking-widest">
              RSVP Now
            </span>
          </button>
          
          <button 
            onClick={onViewGuestsClick}
            className="px-10 py-4 bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm font-bold"
          >
            See Guest List
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#BF953F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 13 5 5 5-5"/><path d="m7 6 5 5 5-5"/></svg>
      </div>
    </div>
  );
};
