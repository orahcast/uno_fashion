'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  ChevronRight,
  Search,
  Download,
  Plus,
  Phone,
  Trash2,
} from 'lucide-react';
import { INITIAL_CLIENT_BOOK } from '@/lib/data/mock-catalog';
import { ClientBookEntry, ClientBookStatus } from '@/lib/types';

export default function CustomersPage() {
  const [entries, setEntries] = useState<ClientBookEntry[]>([]);
  const [filterTab, setFilterTab] = useState<'ALL' | ClientBookStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Fetch client book from API on mount
  useEffect(() => {
    fetch('/api/client-book')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          const deleted = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('uno_deleted_client_book_ids') || '[]')
            : [];
          setEntries(data.filter((e: ClientBookEntry) => !deleted.includes(e.id)));
        }
      })
      .catch((err) => console.error('Error fetching client book:', err));
  }, []);

  // Record Form State
  const [clientName, setClientName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [outfitTaken, setOutfitTaken] = useState('');
  const [returnDue, setReturnDue] = useState('2026-11-09');
  const [status, setStatus] = useState<ClientBookStatus>('OUT');

  const outOnRentalCount = entries.filter((e) => e.status === 'OUT').length;

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filterTab !== 'ALL' && entry.status !== filterTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = entry.clientName.toLowerCase().includes(q);
        const matchesPhone = entry.telephone.toLowerCase().includes(q);
        const matchesId = entry.nationalId.toLowerCase().includes(q);
        const matchesOutfit = entry.outfitTaken.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesId && !matchesOutfit) {
          return false;
        }
      }
      return true;
    });
  }, [entries, filterTab, searchQuery]);

  const handleStatusToggle = (id: string, nextStatus: ClientBookStatus) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: nextStatus } : e))
    );

    fetch('/api/client-book', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nextStatus }),
    }).catch(console.error);
  };

  const handleDeleteEntry = async (id: string, name: string) => {
    if (confirm(`Delete "${name}" from the client book? This will permanently remove this record from the system.`)) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (typeof window !== 'undefined') {
        try {
          const deleted = JSON.parse(localStorage.getItem('uno_deleted_client_book_ids') || '[]');
          if (!deleted.includes(id)) {
            deleted.push(id);
            localStorage.setItem('uno_deleted_client_book_ids', JSON.stringify(deleted));
          }
        } catch (e) {
          console.error(e);
        }
      }
      try {
        const res = await fetch(`/api/client-book?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error('Failed to delete client book entry:', err);
        }
      } catch (err) {
        console.error('Network error deleting client book entry:', err);
      }
    }
  };

  const handleRecordClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ClientBookEntry = {
      id: `cb-${Date.now()}`,
      dateLogged: 'Nov 5, 2026',
      timeLogged: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      clientName,
      telephone,
      nationalId: nationalId || '—',
      outfitTaken,
      returnDue,
      status,
    };
    setEntries([newEntry, ...entries]);
    setShowRecordModal(false);
    setClientName('');
    setTelephone('');
    setNationalId('');
    setOutfitTaken('');

    fetch('/api/client-book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    }).catch(console.error);
  };

  const handleExportCSV = () => {
    const headers = [
      'Date Logged',
      'Client Name',
      'Telephone',
      'National ID / Passport',
      'Outfit Taken',
      'Return Due',
      'Status',
    ];
    const rows = entries.map((e) => [
      `${e.dateLogged} ${e.timeLogged}`,
      e.clientName,
      e.telephone,
      e.nationalId,
      e.outfitTaken,
      e.returnDue,
      e.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'uno-fashion-client-book.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusStyle = (st: ClientBookStatus) => {
    if (st === 'OUT') {
      return 'bg-[#E8F0FE] text-[#1E40AF] border-[#BFDBFE]';
    }
    if (st === 'RETURNED') {
      return 'bg-[#EAF3EC] text-[#2D5A38] border-[#C5DFCD]';
    }
    return 'bg-[#FEF6E7] text-[#935D15] border-[#F3D9B1]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="w-6 h-0.5 bg-[#9E7B4F] mb-2" />
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-[#9E7B4F]" />
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#191C1A]">
              On-Site Client Register (Digital Book)
            </h1>
          </div>
          <p className="text-xs text-[#6B726A] mt-1">
            Quickly record walk-in clients with their National ID, phone, outfit taken, and return schedule.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#191C1A] hover:text-[#9E7B4F] px-3 py-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Book</span>
          </button>

          <button
            type="button"
            onClick={() => setShowRecordModal(true)}
            className="inline-flex items-center space-x-2 bg-[#9E7B4F] hover:bg-[#86663E] text-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Client in Book</span>
          </button>
        </div>
      </div>

      {/* 2 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setFilterTab('ALL')}
          className={`bg-white border rounded-lg p-5 text-left transition-all ${
            filterTab === 'ALL'
              ? 'border-[#9E7B4F] ring-1 ring-[#9E7B4F]/20'
              : 'border-[#E8E4DC] hover:border-[#9E7B4F]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-4 h-4 text-[#9E7B4F]" />
            <ChevronRight className="w-3.5 h-3.5 text-[#B8ADA2]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-[#191C1A]">Total in Book</span>
            <span className="text-sm font-bold text-[#9E7B4F]">{entries.length}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('OUT')}
          className={`bg-white border rounded-lg p-5 text-left transition-all ${
            filterTab === 'OUT'
              ? 'border-[#1E40AF] ring-1 ring-[#1E40AF]/20'
              : 'border-[#E8E4DC] hover:border-[#1E40AF]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-4 h-4 text-[#1E40AF]" />
            <ChevronRight className="w-3.5 h-3.5 text-[#B8ADA2]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-[#191C1A]">Out on Rental</span>
            <span className="text-sm font-bold text-[#1E40AF]">{outOnRentalCount}</span>
          </div>
        </button>
      </div>

      {/* Search & Filter Pill Bar */}
      <div className="bg-white border border-[#E8E4DC] rounded-lg p-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#8C8075] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, National ID, phone, or outfit taken..."
            className="w-full bg-[#FAF8F5] border border-[#E5DFD4] rounded-md pl-9 pr-4 py-2 text-xs text-[#191C1A] placeholder-[#8C8075] focus:outline-none focus:border-[#9E7B4F]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { key: 'ALL', label: `All (${entries.length})` },
              { key: 'OUT', label: `Out on Rental (${outOnRentalCount})` },
              { key: 'RETURNED', label: 'Returned' },
              { key: 'FITTING', label: 'Fittings / Inquiries' },
            ] as const
          ).map((pill) => (
            <button
              key={pill.key}
              type="button"
              onClick={() => setFilterTab(pill.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterTab === pill.key
                  ? 'bg-[#9E7B4F] text-white font-semibold'
                  : 'bg-[#F2ECE1] text-[#52574F] hover:text-[#191C1A]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Book Entries Table */}
      <div className="bg-white border border-[#E8E4DC] rounded-lg shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E4DC] flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#191C1A]">
            Book Entries ({filteredEntries.length})
          </h2>
          <span className="text-[11px] text-[#8C8075]">Sorted from most recent</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2ECE1]/70 text-[#6B726A] uppercase tracking-wider text-[10px] border-b border-[#E8E4DC]">
              <tr>
                <th className="py-3 px-5 font-semibold">Date Logged</th>
                <th className="py-3 px-4 font-semibold">Client Name</th>
                <th className="py-3 px-4 font-semibold">Telephone</th>
                <th className="py-3 px-4 font-semibold">National ID / Passport</th>
                <th className="py-3 px-4 font-semibold">Outfit Taken</th>
                <th className="py-3 px-4 font-semibold">Return Due</th>
                <th className="py-3 px-5 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE6]">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 px-6 text-center text-xs text-[#8C8075]">
                    No client entries found matching your search or filter.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-[#FAF8F5] transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="text-[#191C1A] font-medium">{entry.dateLogged}</div>
                      <div className="text-[10px] text-[#8C8075]">{entry.timeLogged}</div>
                    </td>

                    <td className="py-4 px-4 font-bold text-[#191C1A]">
                      {entry.clientName}
                    </td>

                    <td className="py-4 px-4">
                      <div className="inline-flex items-center space-x-1.5 text-[#9E7B4F] font-medium">
                        <Phone className="w-3 h-3" />
                        <span>{entry.telephone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block bg-[#F2ECE1] text-[#52574F] text-[11px] font-mono px-2 py-0.5 rounded-sm border border-[#E5DFD4]">
                        {entry.nationalId}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium text-[#191C1A]">
                      {entry.outfitTaken}
                    </td>

                    <td className="py-4 px-4 text-[#52574F] font-medium">
                      {entry.returnDue}
                    </td>

                    <td className="py-4 px-5">
                      <select
                        value={entry.status}
                        onChange={(e) =>
                          handleStatusToggle(entry.id, e.target.value as ClientBookStatus)
                        }
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${getStatusStyle(
                          entry.status
                        )}`}
                      >
                        <option value="OUT">OUT</option>
                        <option value="RETURNED">RETURNED</option>
                        <option value="FITTING">FITTING</option>
                      </select>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id, entry.clientName)}
                        className="inline-flex items-center justify-center p-1.5 text-[#8C8075] hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title={`Delete ${entry.clientName} entry`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Record Client in Book */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full p-6 border border-[#E8E4DC] shadow-2xl space-y-4 rounded-lg">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="font-serif-luxury text-2xl text-[#191C1A]">
                Record Walk-In Client
              </h3>
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                className="text-xs text-[#6B726A] hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordClient} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">
                  Client Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dan Habimana"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">
                    Telephone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0788306953"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">
                    National ID / Passport
                  </label>
                  <input
                    type="text"
                    placeholder="1 1995 8 00..."
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6B726A] mb-1 font-medium">
                  Outfit Taken
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Windsor Tuxedo (UK 40) + Shoes"
                  value={outfitTaken}
                  onChange={(e) => setOutfitTaken(e.target.value)}
                  className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">
                    Return Due Date
                  </label>
                  <input
                    type="date"
                    value={returnDue}
                    onChange={(e) => setReturnDue(e.target.value)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  />
                </div>

                <div>
                  <label className="block text-[#6B726A] mb-1 font-medium">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ClientBookStatus)}
                    className="w-full bg-white border border-[#D5CFCE] rounded-md p-2.5 text-[#191C1A]"
                  >
                    <option value="OUT">OUT (On Rental)</option>
                    <option value="FITTING">FITTING / Inquiry</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#9E7B4F] hover:bg-[#86663E] text-white py-2.5 rounded-md font-semibold uppercase tracking-wider transition-colors"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="bg-white border border-[#D5CFCE] px-4 py-2.5 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
