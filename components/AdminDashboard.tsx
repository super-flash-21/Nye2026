
import React, { useState, useEffect } from 'react';
import { fetchAllRSVPs } from '../services/firebase';
import { RSVPData, AdminStats } from '../types';
import { ADMIN_PASSWORD } from '../constants';

export const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rsvps, setRsvps] = useState<RSVPData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalPeople: 0,
    totalAmount: 0,
    drinkCounts: {},
    totalEntries: 0
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      loadData();
    } else {
      alert("Invalid password");
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllRSVPs();
      setRsvps(data);
      
      const newStats: AdminStats = {
        totalPeople: data.reduce((sum, r) => sum + r.total_people, 0),
        totalAmount: data.reduce((sum, r) => sum + r.total_amount, 0),
        drinkCounts: data.reduce((acc, r) => {
          if (r.will_drink && r.drink_type) {
            acc[r.drink_type] = (acc[r.drink_type] || 0) + r.total_people;
          }
          return acc;
        }, {} as Record<string, number>),
        totalEntries: data.length
      };
      setStats(newStats);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Total People", "Drinks", "Type", "Amount", "Created At"];
    const rows = rsvps.map(r => [
      r.name,
      r.total_people,
      r.will_drink ? "Yes" : "No",
      r.drink_type,
      r.total_amount,
      r.created_at
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NYE_2026_RSVP_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
          <h2 className="text-2xl font-display font-bold mb-6 text-center gold-gradient">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-white focus:outline-none focus:border-[#BF953F]"
            />
            <button type="submit" className="w-full gold-bg py-4 rounded-xl text-black font-bold uppercase tracking-widest">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-display font-bold gold-gradient">Admin Dashboard</h2>
        <div className="flex gap-4">
          <button onClick={loadData} className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          </button>
          <button onClick={exportCSV} className="gold-bg px-6 py-2 rounded-xl text-black font-bold text-sm uppercase">
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total RSVP Entries</p>
          <p className="text-3xl font-bold text-white">{stats.totalEntries}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Total Heads</p>
          <p className="text-3xl font-bold text-[#BF953F]">{stats.totalPeople}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Collected Amount</p>
          <p className="text-3xl font-bold text-green-500">₹{stats.totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Drinks (Approx)</p>
          <div className="text-sm">
            {Object.entries(stats.drinkCounts).map(([type, count]) => (
              <span key={type} className="block">{type}: {count}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-800 text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Heads</th>
                <th className="p-4 font-bold">Alcohol?</th>
                <th className="p-4 font-bold">Pref</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {rsvps.map((rsvp, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4 font-medium text-white">{rsvp.name}</td>
                  <td className="p-4 text-zinc-300">{rsvp.total_people}</td>
                  <td className="p-4 text-zinc-300">{rsvp.will_drink ? "✅" : "❌"}</td>
                  <td className="p-4 text-zinc-300">{rsvp.drink_type || "-"}</td>
                  <td className="p-4 font-bold text-[#BF953F]">₹{rsvp.total_amount}</td>
                  <td className="p-4 text-zinc-500 max-w-[200px] truncate">{rsvp.special_notes || "-"}</td>
                </tr>
              ))}
              {rsvps.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-zinc-600">No RSVP data found yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
