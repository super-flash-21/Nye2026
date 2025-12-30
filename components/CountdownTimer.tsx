import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Target: January 1, 2026 at 00:00:00
      const targetDate = new Date('2026-01-01T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-3 justify-center mt-8">
      <div className="text-center">
        <div className="bg-zinc-800 border border-[#BF953F] rounded-lg p-4 min-w-20">
          <div className="text-2xl md:text-3xl font-bold gold-gradient">{String(timeLeft.days).padStart(2, '0')}</div>
        </div>
        <p className="text-xs md:text-sm text-zinc-500 mt-2 uppercase tracking-wider">Days</p>
      </div>
      <div className="text-center">
        <div className="bg-zinc-800 border border-[#BF953F] rounded-lg p-4 min-w-20">
          <div className="text-2xl md:text-3xl font-bold gold-gradient">{String(timeLeft.hours).padStart(2, '0')}</div>
        </div>
        <p className="text-xs md:text-sm text-zinc-500 mt-2 uppercase tracking-wider">Hours</p>
      </div>
      <div className="text-center">
        <div className="bg-zinc-800 border border-[#BF953F] rounded-lg p-4 min-w-20">
          <div className="text-2xl md:text-3xl font-bold gold-gradient">{String(timeLeft.minutes).padStart(2, '0')}</div>
        </div>
        <p className="text-xs md:text-sm text-zinc-500 mt-2 uppercase tracking-wider">Minutes</p>
      </div>
      <div className="text-center">
        <div className="bg-zinc-800 border border-[#BF953F] rounded-lg p-4 min-w-20">
          <div className="text-2xl md:text-3xl font-bold gold-gradient">{String(timeLeft.seconds).padStart(2, '0')}</div>
        </div>
        <p className="text-xs md:text-sm text-zinc-500 mt-2 uppercase tracking-wider">Seconds</p>
      </div>
    </div>
  );
};
