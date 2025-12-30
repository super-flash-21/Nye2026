
import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { EventDetails } from './components/EventDetails';
import { RSVPForm } from './components/RSVPForm';
import { AdminDashboard } from './components/AdminDashboard';
import { GuestList } from './components/GuestList';

const App: React.FC = () => {
  const [view, setView] = useState<'rsvp' | 'success' | 'admin' | 'guests'>('rsvp');

  // Simple hash-based router for admin and guest list access
  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setView('admin');
      } else if (hash === '#guests') {
        setView('guests');
      } else {
        setView('rsvp');
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const scrollToRSVP = () => {
    setView('rsvp');
    window.location.hash = '';
    setTimeout(() => {
      const section = document.getElementById('rsvp-section');
      section?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const navigateToGuests = () => {
    window.location.hash = 'guests';
  };

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-black">
        <nav className="p-4 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-black z-50">
          <div className="font-display font-bold gold-gradient text-xl">NYE 2026 Admin</div>
          <button onClick={() => window.location.hash = ''} className="text-zinc-500 hover:text-white transition-colors">Back to Site</button>
        </nav>
        <AdminDashboard />
      </div>
    );
  }

  if (view === 'guests') {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-[#BF953F]/30">
        <nav className="p-6 border-b border-zinc-900 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-md z-50">
          <div className="font-display font-bold gold-gradient text-2xl">NYE 2026</div>
          <button 
            onClick={() => window.location.hash = ''} 
            className="px-6 py-2 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:border-[#BF953F] transition-all text-sm font-bold uppercase tracking-widest"
          >
            Back Home
          </button>
        </nav>
        <GuestList onClaimSpot={scrollToRSVP} />
        <footer className="py-10 border-t border-zinc-900 bg-black text-center text-zinc-600">
          <p className="text-xs uppercase tracking-[0.3em]">Midnight Madness 2026 • Exclusive Entry Only</p>
        </footer>
      </div>
    );
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-500/10 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h1 className="text-5xl font-display font-bold gold-gradient">Confirmed!</h1>
          <p className="text-xl text-zinc-400 font-light">
            🎉 RSVP Confirmed! See you at the countdown 🖤
          </p>
          <div className="pt-8 space-y-4">
            <button 
              onClick={() => window.location.hash = 'guests'}
              className="block w-full gold-bg py-4 rounded-xl text-black font-bold uppercase tracking-widest"
            >
              See Who Else is Coming
            </button>
            <button 
              onClick={() => setView('rsvp')}
              className="text-zinc-500 hover:text-[#BF953F] transition-colors uppercase tracking-widest text-xs font-bold"
            >
              Add another guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#BF953F]/30 overflow-x-hidden">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-20"></div>

      <main className="relative">
        <Hero onRSVPClick={scrollToRSVP} onViewGuestsClick={navigateToGuests} />
        
        <div className="relative z-10 space-y-20 pb-40">
          <EventDetails />
          <RSVPForm onSuccess={() => setView('success')} />
        </div>
      </main>

      <footer className="py-10 border-t border-zinc-900 bg-black text-center text-zinc-600">
        <p className="text-xs uppercase tracking-[0.3em]">Midnight Madness 2026 • Exclusive Entry Only</p>
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={navigateToGuests} className="text-[10px] hover:text-[#BF953F] transition-colors uppercase">Guest List</button>
          <span className="opacity-20">|</span>
          <a href="#admin" className="text-[10px] hover:text-[#BF953F] transition-colors uppercase">Admin</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
