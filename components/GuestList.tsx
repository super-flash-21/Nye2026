
import React, { useState, useEffect } from 'react';
import { fetchAllRSVPs } from '../services/firebase';
import { RSVPData } from '../types';

export const GuestList: React.FC = () => {
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGuests = async () => {
      try {
        const data = await fetchAllRSVPs();
        setRsvps(data);
      } catch (err) {
        console.error("Failed to load guests:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGuests();
  }, []);

  const totalConfirmed = rsvps.reduce((sum, r) => sum + r.total_people, 0);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BF953F]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-display font-bold mb-4 gold-gradient">The Guest List</h2>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm">
          {totalConfirmed} Legends are joining the madness
        </p>
      </div>

      {rsvps.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-3xl">
          <p className="text-zinc-600 italic">No one has claimed their spot yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rsvps.map((guest, idx) => (
            <div 
              key={idx} 
              className="group bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-[#BF953F]/50 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gold-bg flex items-center justify-center text-black font-bold text-lg">
                  {guest.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-[#BF953F] transition-colors">
                    {guest.name}
                  </h3>
                  <p className="text-zinc-500 text-sm">
                    {guest.total_people > 1 ? `Group of ${guest.total_people}` : "Solo Entry"}
                  </p>
                </div>
              </div>
              
              {/* Decorative line */}
              <div className="mt-4 h-px w-full bg-gradient-to-r from-[#BF953F]/0 via-[#BF953F]/20 to-[#BF953F]/0"></div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-20 text-center">
        <p className="text-zinc-600 text-xs uppercase tracking-widest mb-4">Are you on the list?</p>
        <button 
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="text-[#BF953F] hover:underline underline-offset-8 transition-all font-bold"
        >
          CLAIM YOUR SPOT NOW
        </button>
      </div>
    </div>
  );
};
