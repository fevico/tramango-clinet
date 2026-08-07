'use client';

import { useState, useEffect } from 'react';
import { TravelPackage } from '@/lib/redux/types';
import { MapPin, Users, Ticket, Loader2, Sparkles } from 'lucide-react';

interface PackageCardProps {
  pkg: TravelPackage;
  onBook: (id: string) => Promise<void>;
  isBooking: boolean;
}

export function PackageCard({ pkg, onBook, isBooking }: PackageCardProps) {
  const [slotHighlight, setSlotHighlight] = useState(false);

  // Trigger brief highlight pulse whenever availableSlots count updates
  useEffect(() => {
    setSlotHighlight(true);
    const timer = setTimeout(() => setSlotHighlight(false), 1200);
    return () => clearTimeout(timer);
  }, [pkg.availableSlots]);

  const isSoldOut = pkg.availableSlots <= 0;

  // Visual imagery fallback maps based on package title keywords
  const getImageForPackage = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('bali')) return '/images/bali_resort_1786099830681.jpg';
    if (lower.includes('paris')) return '/images/paris_getaway_1786099979118.jpg';
    return null;
  };

  const bgImage = getImageForPackage(pkg.title);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 overflow-hidden">
      {/* Top Banner Image / Gradient Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        {bgImage ? (
          <img
            src={bgImage}
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 flex items-center justify-center p-6 text-center">
            <MapPin className="w-12 h-12 text-sky-400/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        {/* Price Tag */}
        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 px-3 py-1.5 rounded-full shadow-lg">
          <span className="text-xs uppercase font-semibold text-slate-400 mr-1">
            From
          </span>
          <span className="text-base font-bold text-sky-400">
            ${pkg.price.toLocaleString()}
          </span>
        </div>

        {/* Available Slots Pill */}
        <div className="absolute bottom-3 left-4">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all duration-500 border ${
              slotHighlight
                ? 'scale-105 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30'
                : ''
            } ${
              isSoldOut
                ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                : pkg.availableSlots <= 3
                ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              {isSoldOut
                ? 'Sold Out'
                : `${pkg.availableSlots} slot${pkg.availableSlots > 1 ? 's' : ''} left`}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
            {pkg.title}
          </h3>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-3">
            {pkg.description}
          </p>
        </div>

        {/* Action Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
            <Ticket className="w-4 h-4 text-sky-400" />
            <span>Instant Confirmation</span>
          </div>

          <button
            onClick={() => onBook(pkg._id)}
            disabled={isSoldOut || isBooking}
            aria-label={`Book now for ${pkg.title}`}
            className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md ${
              isSoldOut
                ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/40'
                : isBooking
                ? 'bg-sky-600/60 text-white cursor-wait opacity-80'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white hover:shadow-lg hover:shadow-sky-500/25 active:scale-[0.98]'
            }`}
          >
            {isBooking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Booking...</span>
              </>
            ) : isSoldOut ? (
              <span>Fully Booked</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Book Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
