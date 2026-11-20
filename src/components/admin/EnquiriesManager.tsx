import React, { useState, useEffect, useCallback } from 'react';
import { Enquiry } from '../../types';
import { adminApi } from '../../api/client';
import {
  Search,
  Filter,
  Download,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  X,
  Plus,
  Send,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface EnquiriesManagerProps {
  selectedEnquiryId: number | null;
  onClearSelectedId: () => void;
}

export const EnquiriesManager: React.FC<EnquiriesManagerProps> = ({
  selectedEnquiryId,
  onClearSelectedId,
}) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Active Enquiry Detail Modal
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Status Change Form inside Detail Modal
  const [newStatus, setNewStatus] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [quotedPriceInput, setQuotedPriceInput] = useState('');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Internal Note Form
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const statuses = [
    'New',
    'Under Review',
    'Awaiting Customer Response',
    'Quotation Sent',
    'Approved',
    'In Progress',
    'Quality Check',
    'Completed',
    'Delivered',
    'Cancelled',
  ];

  const fetchEnquiries = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getEnquiries({
        search,
        status: statusFilter,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: currentPage,
      });
      setEnquiries(data.enquiries);
      setTotalCount(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, dateFrom, dateTo, currentPage]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // Open detail if selectedEnquiryId prop is passed
  const loadDetail = async (id: number) => {
    try {
      setIsLoadingDetail(true);
      const data = await adminApi.getEnquiryById(id);
      setActiveEnquiry(data);
      setNewStatus(data.status);
      setQuotedPriceInput(String(data.quotedPrice || data.estimatedPrice));
      setEstimatedCompletionDate(data.estimatedCompletionDate || '');
      setAdminNotesInput(data.adminNotes || '');
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (selectedEnquiryId) {
      loadDetail(selectedEnquiryId);
    }
  }, [selectedEnquiryId]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiry) return;

    try {
      setIsUpdatingStatus(true);
      const res = await adminApi.updateEnquiryStatus(activeEnquiry.id, {
        newStatus,
        changeReason: changeReason || `Status changed to ${newStatus}`,
        quotedPrice: parseFloat(quotedPriceInput) || activeEnquiry.estimatedPrice,
        estimatedCompletionDate,
        adminNotes: adminNotesInput,
      });

      // Reload full detail
      await loadDetail(activeEnquiry.id);
      setChangeReason('');
      fetchEnquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiry || !newNoteText.trim()) return;

    try {
      setIsAddingNote(true);
      await adminApi.addEnquiryNote(activeEnquiry.id, {
        noteText: newNoteText.trim(),
        isCustomerVisible: false,
      });
      setNewNoteText('');
      await loadDetail(activeEnquiry.id);
    } catch (err: any) {
      alert(err.message || 'Failed to add internal note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const closeDetail = () => {
    setActiveEnquiry(null);
    onClearSelectedId();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Controls */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
              Enquiry &amp; Commission Management
            </h1>
            <p className="text-xs text-studio-taupe">
              Review reference photographs, coordinate status milestones, and log communications. Total: {totalCount}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setDateFrom('');
                setDateTo('');
              }}
              className="px-3 py-1.5 text-xs text-studio-taupe hover:text-studio-charcoal border border-studio-border rounded-sm hover:bg-studio-ivory"
            >
              Reset Filters
            </button>
            <button
              onClick={fetchEnquiries}
              className="px-4 py-1.5 text-xs uppercase tracking-wider font-semibold bg-studio-charcoal text-studio-ivory rounded-sm hover:bg-studio-gold transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ref, name, email..."
              className="w-full px-3.5 py-2 pl-9 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold"
            />
            <Search className="w-3.5 h-3.5 text-studio-taupe absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold"
            >
              <option value="All">All Statuses ({totalCount})</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range From */}
          <div className="relative">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold"
              title="From date"
            />
          </div>

          {/* Date Range To */}
          <div className="relative">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold"
              title="To date"
            />
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-studio-card rounded-sm border border-studio-border shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-studio-taupe flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-studio-gold" />
            <span className="text-xs">Loading enquiries...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-studio-ivory text-studio-taupe uppercase tracking-wider font-semibold border-b border-studio-border">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Specifications</th>
                  <th className="py-3 px-4">Photos</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Quote</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-border/50">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-studio-ivory/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-studio-charcoal">
                      {enq.referenceNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-studio-charcoal">{enq.fullName}</div>
                      <div className="text-[11px] text-studio-taupe">{enq.email}</div>
                      <div className="text-[10px] text-studio-taupe/80">{enq.phone}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-studio-charcoal">{enq.sketchType}</div>
                      <div className="text-[11px] text-studio-taupe">
                        Size: <strong className="text-studio-charcoal">{enq.sketchSize}</strong> &bull; {enq.subjectsCount} Subject(s)
                      </div>
                      <div className="text-[10px] text-studio-taupe">
                        {enq.framing} &bull; {enq.orientation}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {enq.attachments && enq.attachments.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <img
                            src={enq.attachments[0].fileUrl}
                            alt="Reference"
                            className="w-9 h-9 rounded object-cover border border-studio-border"
                          />
                          <span className="text-[10px] font-semibold text-studio-taupe">
                            +{enq.attachments.length}
                          </span>
                        </div>
                      ) : (
                        <span className="text-studio-taupe text-[10px]">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : enq.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : enq.status === 'Completed' || enq.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : enq.status === 'Quotation Sent'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-stone-100 text-stone-700 border border-stone-300'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-studio-charcoal">
                      ${(enq.quotedPrice || enq.estimatedPrice).toFixed(0)}
                    </td>

                    <td className="py-3.5 px-4 text-studio-taupe text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => loadDetail(enq.id)}
                        className="px-3 py-1 bg-studio-charcoal text-studio-ivory hover:bg-studio-gold text-xs font-semibold rounded-sm transition-colors"
                      >
                        Inspect &amp; Manage
                      </button>
                    </td>
                  </tr>
                ))}

                {enquiries.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-studio-taupe">
                      No matching commission enquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-studio-border flex items-center justify-between text-xs text-studio-taupe">
            <span>
              Showing Page {currentPage} of {totalPages} ({totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 rounded border border-studio-border disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 rounded border border-studio-border disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-studio-card text-studio-charcoal max-w-4xl w-full rounded-sm border border-studio-border shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-studio-border flex items-center justify-between sticky top-0 bg-studio-card z-20">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl font-bold text-studio-charcoal">
                  {activeEnquiry.referenceNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeEnquiry.status === 'New'
                      ? 'bg-amber-100 text-amber-900'
                      : activeEnquiry.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {activeEnquiry.status}
                </span>
              </div>
              <button
                onClick={closeDetail}
                className="w-8 h-8 rounded-full hover:bg-studio-ivory flex items-center justify-center text-studio-taupe hover:text-studio-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Row 1: Patron & Specifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Client Profile */}
                <div className="bg-studio-ivory/80 p-5 rounded-sm border border-studio-border space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-studio-gold font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Patron Contact Information</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-studio-charcoal">
                    {activeEnquiry.fullName}
                  </h3>
                  <div className="space-y-1.5 text-xs text-studio-taupe">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-studio-gold" />
                      <a href={`mailto:${activeEnquiry.email}`} className="text-studio-charcoal underline">
                        {activeEnquiry.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-studio-gold" />
                      <a href={`tel:${activeEnquiry.phone}`} className="text-studio-charcoal">
                        {activeEnquiry.phone}
                      </a>
                      <a
                        href={`https://wa.me/${activeEnquiry.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-medium flex items-center gap-1 ml-2"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                    {activeEnquiry.city && (
                      <div className="text-[11px] text-studio-taupe pt-1">
                        Location: {activeEnquiry.city}, {activeEnquiry.country}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sketch Specs */}
                <div className="bg-studio-ivory/80 p-5 rounded-sm border border-studio-border space-y-3">
                  <div className="text-[10px] uppercase tracking-widest text-studio-gold font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Commission Specifications</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-studio-taupe text-[10px] uppercase block">Type</span>
                      <strong className="text-studio-charcoal">{activeEnquiry.sketchType}</strong>
                    </div>
                    <div>
                      <span className="text-studio-taupe text-[10px] uppercase block">Paper Size</span>
                      <strong className="text-studio-charcoal">{activeEnquiry.sketchSize}</strong>
                    </div>
                    <div>
                      <span className="text-studio-taupe text-[10px] uppercase block">Subjects</span>
                      <strong className="text-studio-charcoal">{activeEnquiry.subjectsCount}</strong>
                    </div>
                    <div>
                      <span className="text-studio-taupe text-[10px] uppercase block">Framing</span>
                      <strong className="text-studio-charcoal">{activeEnquiry.framing}</strong>
                    </div>
                    <div>
                      <span className="text-studio-taupe text-[10px] uppercase block">Orientation</span>
                      <strong className="text-studio-charcoal">{activeEnquiry.orientation}</strong>
                    </div>
                    <div>
                      <span className="text-studio-taupe text-[10px] uppercase block">Gift Packaging</span>
                      <strong className="text-studio-charcoal">{activeEnquiry.giftPackaging ? 'Yes' : 'No'}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Special Instructions & Additional Requests */}
              {(activeEnquiry.specialInstructions || activeEnquiry.additionalRequests) && (
                <div className="bg-studio-ivory/50 p-5 rounded-sm border border-studio-border space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                    Client Special Instructions
                  </span>
                  {activeEnquiry.specialInstructions && (
                    <p className="text-xs text-studio-charcoal leading-relaxed">
                      &ldquo;{activeEnquiry.specialInstructions}&rdquo;
                    </p>
                  )}
                  {activeEnquiry.additionalRequests && (
                    <p className="text-xs text-studio-taupe pt-1">
                      <strong className="text-studio-charcoal">Additional: </strong>
                      {activeEnquiry.additionalRequests}
                    </p>
                  )}
                </div>
              )}

              {/* Reference Photographs Gallery with Download */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                    Uploaded Reference Photographs ({activeEnquiry.attachments?.length || 0})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {activeEnquiry.attachments?.map((att) => (
                    <div
                      key={att.id}
                      className="bg-studio-beige rounded-sm overflow-hidden border border-studio-border relative group flex flex-col"
                    >
                      <div className="aspect-square overflow-hidden bg-black/10 relative">
                        <img
                          src={att.fileUrl}
                          alt={att.originalName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2 bg-studio-card flex items-center justify-between text-[10px]">
                        <span className="truncate pr-1 text-studio-taupe">{att.originalName}</span>
                        <a
                          href={att.fileUrl}
                          download={att.originalName}
                          target="_blank"
                          rel="noreferrer"
                          className="text-studio-gold hover:text-studio-charcoal p-1"
                          title="Download high-res photo"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update & Quote Pricing Management Form */}
              <div className="bg-studio-ivory p-6 rounded-sm border border-studio-border space-y-4">
                <span className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                  Status &amp; Quotation Controls
                </span>

                <form onSubmit={handleStatusUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Milestone Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-studio-card border border-studio-border rounded-sm text-xs font-semibold focus:outline-none focus:border-studio-gold"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Final Quoted Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={quotedPriceInput}
                      onChange={(e) => setQuotedPriceInput(e.target.value)}
                      className="w-full px-3 py-2 bg-studio-card border border-studio-border rounded-sm text-xs font-mono font-bold focus:outline-none focus:border-studio-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Est. Completion Date
                    </label>
                    <input
                      type="date"
                      value={estimatedCompletionDate}
                      onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                      className="w-full px-3 py-2 bg-studio-card border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                      Status Change Reason / Milestone Note (Logs to Timeline)
                    </label>
                    <input
                      type="text"
                      value={changeReason}
                      onChange={(e) => setChangeReason(e.target.value)}
                      placeholder="e.g. Reference photo verified, initial graphite block-in underway"
                      className="w-full px-3 py-2 bg-studio-card border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isUpdatingStatus}
                      className="w-full py-2 px-4 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-bold rounded-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      {isUpdatingStatus ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Update Milestone</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* 2-Columns: Internal Notes & Chronological Status History */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Internal Notes Thread */}
                <div className="bg-studio-card p-5 rounded-sm border border-studio-border space-y-4">
                  <div className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                    Internal Studio Notes ({activeEnquiry.notes?.length || 0})
                  </div>

                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      rows={2}
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add private studio note regarding patron requests..."
                      className="w-full px-3 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold"
                    />
                    <button
                      type="submit"
                      disabled={isAddingNote || !newNoteText.trim()}
                      className="py-1.5 px-3 bg-studio-charcoal text-studio-ivory hover:bg-studio-gold text-[11px] uppercase tracking-wider font-semibold rounded-sm transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Post Internal Note</span>
                    </button>
                  </form>

                  <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                    {activeEnquiry.notes?.map((n) => (
                      <div key={n.id} className="p-3 bg-studio-ivory rounded-sm text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-studio-taupe">
                          <strong className="text-studio-charcoal">{n.authorName}</strong>
                          <span>{new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-studio-charcoal/90">{n.noteText}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chronological Activity Timeline */}
                <div className="bg-studio-card p-5 rounded-sm border border-studio-border space-y-4">
                  <div className="text-[10px] uppercase tracking-widest text-studio-gold font-bold">
                    Chronological Activity Timeline
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto relative pl-4 border-l-2 border-studio-gold/30">
                    {activeEnquiry.statusHistory?.map((h) => (
                      <div key={h.id} className="relative text-xs space-y-0.5">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-studio-gold" />
                        <div className="flex items-center justify-between text-[10px] text-studio-taupe">
                          <span className="font-bold text-studio-charcoal uppercase">
                            {h.newStatus}
                          </span>
                          <span>{new Date(h.createdAt).toLocaleDateString()} {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[11px] text-studio-taupe italic">
                          {h.changeReason || 'Milestone updated'}
                        </p>
                        <span className="text-[9px] text-studio-taupe/70 block">
                          By: {h.updatedBy}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-studio-border bg-studio-ivory flex items-center justify-between">
              <span className="text-[11px] text-studio-taupe">
                Enquiry ID #{activeEnquiry.id} &bull; Received on {new Date(activeEnquiry.createdAt).toLocaleString()}
              </span>
              <button
                onClick={closeDetail}
                className="px-5 py-2 bg-studio-charcoal text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-studio-gold transition-colors"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
