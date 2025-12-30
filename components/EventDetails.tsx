
import React from 'react';
import { EVENT_DATE, DRESS_CODE, COST_PER_PERSON, MENU_ITEMS } from '../constants';

export const EventDetails: React.FC = () => {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
        <h2 className="text-3xl font-display font-bold mb-6 text-white border-l-4 border-[#BF953F] pl-4">The Night</h2>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BF953F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500 font-bold tracking-widest">Date</p>
              <p className="text-lg text-white font-medium">{EVENT_DATE}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#BF953F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500 font-bold tracking-widest">Dress Code</p>
              <p className="text-lg text-white font-medium">{DRESS_CODE}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-[#BF953F] font-bold">
              ₹
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500 font-bold tracking-widest">Contribution</p>
              <p className="text-lg text-white font-medium">₹{COST_PER_PERSON} per person</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm hover:border-yellow-500/30 transition-colors">
        <h2 className="text-3xl font-display font-bold mb-6 text-white border-l-4 border-[#BF953F] pl-4">Menu Selection</h2>
        <p className="text-zinc-400 mb-6 italic">Specially curated for the occasion...</p>
        
        <ul className="space-y-4">
          {MENU_ITEMS.map((item, idx) => (
            <li key={idx} className="flex items-center gap-4 text-zinc-200 group">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BF953F] group-hover:scale-150 transition-transform"></span>
              <span className="text-lg font-medium">{item}</span>
            </li>
          ))}
          <li className="pt-4 text-zinc-500 text-sm">
            + Assorted snacks and refreshments served throughout the night.
          </li>
        </ul>
      </div>
    </section>
  );
};
