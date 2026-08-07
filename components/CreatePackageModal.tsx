'use client';

import { useState } from 'react';
import { useCreatePackageMutation } from '@/lib/redux/services/packagesApi';
import { X, Loader2, PlusCircle } from 'lucide-react';

interface CreatePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (title: string) => void;
  onError: (msg: string) => void;
}

export function CreatePackageModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: CreatePackageModalProps) {
  const [createPackage, { isLoading }] = useCreatePackageMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [availableSlots, setAvailableSlots] = useState<number>(5);
  const [price, setPrice] = useState<number>(1200);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      await createPackage({
        title: title.trim(),
        description: description.trim(),
        availableSlots: Number(availableSlots),
        price: Number(price),
      }).unwrap();

      onSuccess(`Package "${title}" created successfully!`);
      setTitle('');
      setDescription('');
      setAvailableSlots(5);
      setPrice(1200);
      onClose();
    } catch (err: any) {
      onError(err?.data?.message || err?.message || 'Failed to create travel package');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Add Travel Package</h3>
            <p className="text-xs text-slate-400">
              Create a new available tour package on the server.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Tokyo Cherry Blossom Express"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide details about the tour itinerary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Initial Slots
              </label>
              <input
                type="number"
                min={0}
                required
                value={availableSlots}
                onChange={(e) => setAvailableSlots(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Price (USD $)
              </label>
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-md hover:shadow-sky-500/20 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Create Package</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
