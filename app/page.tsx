'use client';

import { useState } from 'react';
import {
  useGetPackagesQuery,
  useBookPackageMutation,
} from '@/lib/redux/services/packagesApi';
import { PackageCard } from '@/components/PackageCard';
import { Navbar } from '@/components/Navbar';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { CreatePackageModal } from '@/components/CreatePackageModal';
import {
  Search,
  SlidersHorizontal,
  Compass,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const { data: packages, error, isLoading, isFetching, refetch } = useGetPackagesQuery();
  const [bookPackage, { isLoading: isBookingMutation }] = useBookPackageMutation();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingPackageId, setBookingPackageId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'soldOut'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'slotsDesc'>('default');

  const addToast = (type: 'success' | 'error', title: string, description?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleBook = async (id: string) => {
    setBookingPackageId(id);
    try {
      const res = await bookPackage(id).unwrap();
      addToast(
        'success',
        'Booking Confirmed! 🎉',
        `Successfully reserved 1 slot for "${res.package.title}". Slots left: ${res.package.availableSlots}`
      );
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Booking failed. Please try again.';
      addToast('error', 'Booking Failed', errorMsg);
    } finally {
      setBookingPackageId(null);
    }
  };

  // Filter & Sort Logic
  const filteredPackages = (packages || [])
    .filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (availabilityFilter === 'available') return pkg.availableSlots > 0;
      if (availabilityFilter === 'soldOut') return pkg.availableSlots <= 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'slotsDesc') return b.availableSlots - a.availableSlots;
      return 0;
    });

  const totalSlotsCount = (packages || []).reduce((acc, p) => acc + (p.availableSlots || 0), 0);
  const availablePackagesCount = (packages || []).filter((p) => p.availableSlots > 0).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenCreateModal={() => setIsModalOpen(true)}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 py-16 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/80 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>RTK Query Cache-Invalidated & Optimistic Updates</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
            Discover Unforgettable{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Travel Escapes
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
            Browse live travel packages, check real-time slot availability, and instant-book
            your next adventure with reactive UI synchronization.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl w-full">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-center">
              <span className="text-2xl font-bold text-white">
                {isLoading ? '...' : packages?.length ?? 0}
              </span>
              <p className="text-xs text-slate-400 font-medium mt-1">Total Packages</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-center">
              <span className="text-2xl font-bold text-sky-400">
                {isLoading ? '...' : totalSlotsCount}
              </span>
              <p className="text-xs text-slate-400 font-medium mt-1">Total Open Slots</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-center">
              <span className="text-2xl font-bold text-emerald-400">
                {isLoading ? '...' : availablePackagesCount}
              </span>
              <p className="text-xs text-slate-400 font-medium mt-1">Active Packages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Controls Header: Search & Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by destination or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filters Group */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
            {/* Availability Filter Buttons */}
            <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setAvailabilityFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  availabilityFilter === 'all'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setAvailabilityFilter('available')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  availabilityFilter === 'available'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setAvailabilityFilter('soldOut')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  availabilityFilter === 'soldOut'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sold Out
              </button>
            </div>

            {/* Sorting Select */}
            <div className="relative flex items-center">
              <SlidersHorizontal className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300 focus:border-sky-500 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="slotsDesc">Most Slots Available</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-sky-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Fetching travel packages from API...</p>
          </div>
        )}

        {/* Error State Banner */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-rose-900/50 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-rose-100">
                  Unable to connect to backend server
                </h3>
                <p className="text-xs text-rose-300/80 mt-1 max-w-xl">
                  Please make sure your Node.js/Express server is running at{' '}
                  <code className="bg-rose-950 px-1.5 py-0.5 rounded text-rose-200">
                    http://localhost:3000/api
                  </code>
                  .
                </p>
              </div>
            </div>

            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-900 hover:bg-rose-800 text-white font-medium text-xs transition-colors shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredPackages.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center rounded-2xl bg-slate-900/30 border border-slate-800/60 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No travel packages found</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-md">
                {searchQuery || availabilityFilter !== 'all'
                  ? 'No packages match your search filters. Try clearing filters or searching for something else.'
                  : 'No travel packages have been added yet. Click "Add Package" to create one!'}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add First Package</span>
            </button>
          </div>
        )}

        {/* Packages Grid */}
        {!isLoading && filteredPackages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg._id}
                pkg={pkg}
                onBook={handleBook}
                isBooking={bookingPackageId === pkg._id && isBookingMutation}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 px-6 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Wanderlust Travel Services. Powered by RTK Query.</p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span>GET /api/packages</span>
            <span>•</span>
            <span>POST /api/packages/:id/book</span>
          </div>
        </div>
      </footer>

      {/* Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Create Package Modal */}
      <CreatePackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(msg) => addToast('success', 'Package Created', msg)}
        onError={(msg) => addToast('error', 'Error Creating Package', msg)}
      />
    </div>
  );
}
