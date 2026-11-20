import React from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { Enquiry, GalleryImage, Testimonial } from '../../types';
import { AdminTab } from './AdminSidebar';

interface DashboardOverviewProps {
  metrics: {
    totalEnquiries: number;
    newEnquiries: number;
    inProgressEnquiries: number;
    completedEnquiries: number;
    totalArtworks: number;
    totalReviews: number;
  };
  recentEnquiries: Enquiry[];
  latestArtworks: GalleryImage[];
  recentReviews: Testimonial[];
  monthlyStats: { month: string; enquiries: number }[];
  statusCounts: Record<string, number>;
  onNavigateTab: (tab: AdminTab) => void;
  onSelectEnquiry: (id: number) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  metrics,
  recentEnquiries,
  latestArtworks,
  monthlyStats,
  statusCounts,
  onNavigateTab,
  onSelectEnquiry,
}) => {
  const cards = [
    {
      title: 'Total Enquiries',
      value: metrics.totalEnquiries,
      icon: Inbox,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      actionTab: 'enquiries' as AdminTab,
    },
    {
      title: 'New Enquiries',
      value: metrics.newEnquiries,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      actionTab: 'enquiries' as AdminTab,
      highlight: true,
    },
    {
      title: 'In Progress Orders',
      value: metrics.inProgressEnquiries,
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      actionTab: 'enquiries' as AdminTab,
    },
    {
      title: 'Completed Orders',
      value: metrics.completedEnquiries,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      actionTab: 'enquiries' as AdminTab,
    },
    {
      title: 'Gallery Artworks',
      value: metrics.totalArtworks,
      icon: ImageIcon,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      actionTab: 'gallery' as AdminTab,
    },
    {
      title: 'Client Reviews',
      value: metrics.totalReviews,
      icon: MessageSquare,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      actionTab: 'testimonials' as AdminTab,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            Studio Operations Overview
          </h1>
          <p className="text-xs text-studio-taupe mt-1">
            Real-time monitoring of customer commissions, portfolio exhibitions, and studio content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('gallery')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-studio-charcoal text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-studio-gold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-studio-gold" />
            <span>Upload Artwork</span>
          </button>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-studio-beige text-studio-charcoal text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-studio-gold hover:text-white transition-colors border border-studio-border"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>View All Enquiries</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid (6 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              onClick={() => onNavigateTab(card.actionTab)}
              className={`p-5 rounded-sm border bg-studio-card shadow-soft hover:shadow-elevated transition-all cursor-pointer flex flex-col justify-between ${
                card.highlight ? 'border-amber-300 ring-1 ring-amber-300/50' : 'border-studio-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-studio-taupe">
                  {card.title}
                </span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-4">
                <div className="font-serif text-3xl font-bold text-studio-charcoal">
                  {card.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Monthly Trend Chart & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Chart (8 cols) */}
        <div className="lg:col-span-8 bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-studio-charcoal">
                Enquiry Volume Trends
              </h3>
              <p className="text-[11px] text-studio-taupe">Last 6 months customer interest activity</p>
            </div>
            <span className="text-xs text-studio-gold font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Inflow</span>
            </span>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-4">
              {monthlyStats.map((stat) => {
                const maxVal = Math.max(1, ...monthlyStats.map((s) => s.enquiries));
                const heightPct = Math.max(12, Math.round((stat.enquiries / maxVal) * 100));

                return (
                  <div key={stat.month} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-studio-charcoal opacity-0 group-hover:opacity-100 transition-opacity">
                      {stat.enquiries}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[48px] bg-studio-beige hover:bg-studio-gold rounded-t-sm transition-all duration-300 relative"
                    >
                      <div className="absolute inset-0 bg-studio-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[11px] text-studio-taupe font-medium mt-1">
                      {stat.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft space-y-4">
          <div className="border-b border-studio-border/60 pb-3">
            <h3 className="font-serif text-base font-bold text-studio-charcoal">
              Commission Pipeline
            </h3>
            <p className="text-[11px] text-studio-taupe">Active status distribution</p>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                onClick={() => onNavigateTab('enquiries')}
                className="flex items-center justify-between p-2 rounded-sm hover:bg-studio-ivory cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status === 'New'
                        ? 'bg-amber-500'
                        : status === 'In Progress'
                        ? 'bg-blue-500'
                        : status === 'Completed' || status === 'Delivered'
                        ? 'bg-emerald-500'
                        : 'bg-stone-400'
                    }`}
                  />
                  <span className="text-studio-charcoal font-medium">{status}</span>
                </div>
                <span className="font-mono text-studio-taupe font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row: Recent Enquiries & Latest Artworks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-studio-charcoal">
                Recent Commission Enquiries
              </h3>
              <p className="text-[11px] text-studio-taupe">Latest incoming patron submissions</p>
            </div>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs text-studio-gold hover:text-studio-charcoal font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-studio-ivory text-studio-taupe uppercase tracking-wider font-semibold border-b border-studio-border/60">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Client</th>
                  <th className="py-2.5 px-3">Type &amp; Scale</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Estimate</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-border/40">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-studio-ivory/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-studio-charcoal">
                      {enq.referenceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-studio-charcoal">{enq.fullName}</div>
                      <div className="text-[10px] text-studio-taupe">{enq.email}</div>
                    </td>
                    <td className="py-3 px-3 text-studio-taupe">
                      {enq.sketchType} &bull; <strong className="text-studio-charcoal">{enq.sketchSize}</strong>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : enq.status === 'Completed' || enq.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-studio-charcoal">
                      ${(enq.quotedPrice || enq.estimatedPrice).toFixed(0)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onSelectEnquiry(enq.id)}
                        className="text-xs text-studio-charcoal hover:text-studio-gold font-semibold underline underline-offset-2"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}

                {recentEnquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-studio-taupe">
                      No enquiries received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Uploaded Artworks (4 cols) */}
        <div className="lg:col-span-4 bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-studio-border/60 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-studio-charcoal">
                Portfolio Showcase
              </h3>
              <p className="text-[11px] text-studio-taupe">Recent gallery additions</p>
            </div>
            <button
              onClick={() => onNavigateTab('gallery')}
              className="text-xs text-studio-gold hover:text-studio-charcoal font-semibold flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {latestArtworks.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigateTab('gallery')}
                className="aspect-square rounded-sm overflow-hidden bg-studio-beige border border-studio-border relative group cursor-pointer shadow-sm"
              >
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-white text-[10px]">
                  <span className="font-serif font-bold truncate">{art.title}</span>
                  <span className="text-studio-gold truncate">{art.category?.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
