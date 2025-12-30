
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import confetti from 'canvas-confetti';
import { COST_PER_PERSON } from '../constants';
import { submitRSVP } from '../services/supabase';
import { RSVPData } from '../types';

const rsvpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  has_guests: z.enum(["yes", "no"]),
  guest_count: z.string().optional(),
  total_people: z.string(),
  will_drink: z.enum(["yes", "no"]),
  drink_type: z.enum(["Vodka", "Whiskey", "Beer"]).optional(),
  snack_suggestions: z.string().max(300).optional(),
  special_notes: z.string().max(300).optional(),
});

type RSVPFormInputs = z.infer<typeof rsvpSchema>;

interface RSVPFormProps {
  onSuccess: () => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RSVPFormInputs>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      has_guests: "no",
      total_people: "1",
      will_drink: "no",
    }
  });

  const hasGuests = watch("has_guests");
  const willDrink = watch("will_drink");
  const totalPeopleStr = watch("total_people");
  const totalPeople = parseInt(totalPeopleStr) || 1;
  const totalAmount = totalPeople * COST_PER_PERSON;

  useEffect(() => {
    if (hasGuests === "no") {
      setValue("total_people", "1");
      setValue("guest_count", "0");
    }
  }, [hasGuests, setValue]);

  const onSubmit = async (formData: RSVPFormInputs) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: RSVPData = {
        name: formData.name,
        has_guests: formData.has_guests === "yes",
        guest_count: parseInt(formData.guest_count || "0"),
        total_people: parseInt(formData.total_people),
        will_drink: formData.will_drink === "yes",
        drink_type: (formData.will_drink === "yes" ? formData.drink_type : "None") as any,
        snack_suggestions: formData.snack_suggestions || "",
        special_notes: formData.special_notes || "",
        total_amount: totalAmount,
      };

      const { error: submitError } = await submitRSVP(payload);
      
      if (submitError) throw submitError;

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#BF953F', '#FCF6BA', '#AA771C', '#000000']
      });

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="rsvp-section" className="max-w-3xl mx-auto px-4 py-20">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="gold-bg p-8 text-black text-center">
          <h2 className="text-3xl font-display font-bold">Secure Your Spot</h2>
          <p className="font-medium opacity-80">RSVP by December 25th</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
            <input 
              {...register("name")}
              type="text" 
              placeholder="Enter your name"
              className={`w-full bg-zinc-800 border ${errors.name ? 'border-red-500' : 'border-zinc-700'} p-4 rounded-xl focus:outline-none focus:border-[#BF953F] transition-colors text-white`}
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">Bringing Guests?</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input type="radio" {...register("has_guests")} value="yes" className="hidden peer" />
                <div className="p-4 text-center rounded-xl border border-zinc-700 bg-zinc-800 peer-checked:border-[#BF953F] peer-checked:text-[#BF953F] transition-all">
                  Yes
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" {...register("has_guests")} value="no" className="hidden peer" />
                <div className="p-4 text-center rounded-xl border border-zinc-700 bg-zinc-800 peer-checked:border-[#BF953F] peer-checked:text-[#BF953F] transition-all">
                  No
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hasGuests === "yes" && (
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">Number of Guests</label>
                <select 
                  {...register("guest_count")}
                  className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-[#BF953F] text-white appearance-none"
                  onChange={(e) => {
                    const count = parseInt(e.target.value) || 0;
                    setValue("total_people", (count + 1).toString());
                  }}
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5+ Guests</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">Total People (Including You)</label>
              <select 
                {...register("total_people")}
                className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-[#BF953F] text-white appearance-none disabled:opacity-50"
                disabled={hasGuests === "no"}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num.toString()}>{num} {num === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">Will You Drink Alcohol?</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer">
                <input type="radio" {...register("will_drink")} value="yes" className="hidden peer" />
                <div className="p-4 text-center rounded-xl border border-zinc-700 bg-zinc-800 peer-checked:border-[#BF953F] peer-checked:text-[#BF953F] transition-all">
                  Yes
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" {...register("will_drink")} value="no" className="hidden peer" />
                <div className="p-4 text-center rounded-xl border border-zinc-700 bg-zinc-800 peer-checked:border-[#BF953F] peer-checked:text-[#BF953F] transition-all">
                  No
                </div>
              </label>
            </div>
          </div>

          {willDrink === "yes" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">Drink Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {["Vodka", "Whiskey", "Beer"].map((type) => (
                  <label key={type} className="cursor-pointer">
                    <input type="radio" {...register("drink_type")} value={type} className="hidden peer" />
                    <div className="p-3 text-sm text-center rounded-lg border border-zinc-700 bg-zinc-800 peer-checked:border-[#BF953F] peer-checked:bg-[#BF953F]/10 peer-checked:text-[#BF953F] transition-all">
                      {type}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">Snack Suggestions (Optional)</label>
            <textarea 
              {...register("snack_suggestions")}
              placeholder="What are you craving?"
              className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-[#BF953F] transition-colors text-white h-24 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-400">Special Notes / Allergies</label>
            <textarea 
              {...register("special_notes")}
              placeholder="Anything we should know?"
              className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl focus:outline-none focus:border-[#BF953F] transition-colors text-white h-24 resize-none"
            />
          </div>

          <div className="pt-6 border-t border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-zinc-400 font-medium">Total Contribution</span>
              <span className="text-2xl font-display font-bold gold-gradient">₹{totalAmount}</span>
            </div>
            
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full gold-bg py-5 rounded-xl text-black font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(191,149,63,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? "Processing..." : "Confirm My Entry"}
            </button>
            <p className="mt-4 text-center text-xs text-zinc-500 italic">
              Payment details will be shared once you confirm.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
