import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Image as ImageIcon,
  Palette,
  DollarSign,
  MessageSquare,
  HelpCircle,
  FolderOpen,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'enquiries'
  | 'cms'
  | 'gallery'
  | 'services'
  | 'pricing'
  | 'testimonials'
  | 'faqs'
  | 'media'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  newEnquiriesCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  newEnquiriesCount = 0,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'enquiries' as AdminTab,
      label: 'Enquiries & Orders',
      icon: Inbox,
      badge: newEnquiriesCount > 0 ? newEnquiriesCount : undefined,
    },
    { id: 'cms' as AdminTab, label: 'Website CMS', icon: FileText },
    { id: 'gallery' as AdminTab, label: 'Artwork Gallery', icon: ImageIcon },
    { id: 'services' as AdminTab, label: 'Commission Services', icon: Palette },
    { id: 'pricing' as AdminTab, label: 'Pricing Rules', icon: DollarSign },
    { id: 'testimonials' as AdminTab, label: 'Client Reviews', icon: MessageSquare },
    { id: 'faqs' as AdminTab, label: 'FAQs', icon: HelpCircle },
    { id: 'media' as AdminTab, label: 'Media Library', icon: FolderOpen },
    { id: 'settings' as AdminTab, label: 'Studio Settings', icon: Settings },
  ];

  const handleSelect = (tab: AdminTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-studio-charcoal text-studio-ivory flex flex-col justify-between border-r border-studio-dark-border transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/admin/dashboard" className="block">
              <span className="font-serif text-xl font-bold tracking-tight text-white block">
                STROKE &amp; SOUL
              </span>
              <span className="text-[10px] tracking-[0.25em] text-studio-gold uppercase font-medium">
                Admin Management
              </span>
            </Link>
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-white/70 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="px-5 py-3.5 bg-black/20 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-studio-gold/20 text-studio-gold font-serif font-bold flex items-center justify-center text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">{user?.name || 'Director'}</div>
              <div className="text-[10px] text-studio-gold truncate uppercase tracking-wider">
                {user?.role || 'Administrator'}
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-studio-gold text-studio-charcoal font-semibold shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-black/10">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-sm text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors border border-white/10"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-studio-gold" />
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-sm text-xs text-red-300 hover:text-red-200 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
