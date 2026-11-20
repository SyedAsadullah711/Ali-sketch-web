import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar, AdminTab } from '../../components/admin/AdminSidebar';
import { DashboardOverview } from '../../components/admin/DashboardOverview';
import { EnquiriesManager } from '../../components/admin/EnquiriesManager';
import { CmsContentManager } from '../../components/admin/CmsContentManager';
import { GalleryManager } from '../../components/admin/GalleryManager';
import { ServicesManager } from '../../components/admin/ServicesManager';
import { PricingRulesManager } from '../../components/admin/PricingRulesManager';
import { ReviewsManager } from '../../components/admin/ReviewsManager';
import { FaqManager } from '../../components/admin/FaqManager';
import { MediaManager } from '../../components/admin/MediaManager';
import { SettingsManager } from '../../components/admin/SettingsManager';
import { adminApi } from '../../api/client';
import { Menu, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Deep select enquiry from dashboard
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<number | null>(null);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoadingDashboard(true);
      const data = await adminApi.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-studio-ivory flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-studio-gold animate-spin mb-3" />
        <span className="font-serif text-base text-studio-charcoal">Verifying Secure Admin Session...</span>
      </div>
    );
  }

  // Strictly protected admin route - NO public access!
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSelectEnquiryFromOverview = (id: number) => {
    setSelectedEnquiryId(id);
    setCurrentTab('enquiries');
  };

  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'enquiries':
        return 'Enquiries & Commissions';
      case 'cms':
        return 'Website CMS';
      case 'gallery':
        return 'Artwork Gallery';
      case 'services':
        return 'Commission Services';
      case 'pricing':
        return 'Pricing & Scale Rules';
      case 'testimonials':
        return 'Client Reviews';
      case 'faqs':
        return 'Commission FAQs';
      case 'media':
        return 'Central Media Library';
      case 'settings':
        return 'Studio & SEO Settings';
      default:
        return 'Admin Portal';
    }
  };

  return (
    <div className="min-h-screen bg-studio-ivory text-studio-charcoal flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={(t) => setCurrentTab(t)}
        newEnquiriesCount={dashboardData?.metrics?.newEnquiries || 0}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-studio-card/95 backdrop-blur-md border-b border-studio-border px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-soft">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded text-studio-charcoal hover:bg-studio-ivory"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-lg font-bold text-studio-charcoal">
                {getTabTitle()}
              </h2>
              <div className="text-[10px] text-studio-taupe flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-studio-gold" />
                <span>Encrypted Studio Session &bull; {user?.name || 'Administrator'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold text-studio-charcoal bg-studio-ivory hover:bg-studio-beige border border-studio-border transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-studio-gold" />
            </Link>
          </div>
        </header>

        {/* Tab View Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            isLoadingDashboard || !dashboardData ? (
              <div className="py-20 text-center text-studio-taupe flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
                <span className="text-xs">Gathering studio statistics...</span>
              </div>
            ) : (
              <DashboardOverview
                metrics={dashboardData.metrics}
                recentEnquiries={dashboardData.recentEnquiries}
                latestArtworks={dashboardData.latestArtworks}
                recentReviews={dashboardData.recentReviews}
                monthlyStats={dashboardData.monthlyStats}
                statusCounts={dashboardData.statusCounts}
                onNavigateTab={(t) => setCurrentTab(t)}
                onSelectEnquiry={handleSelectEnquiryFromOverview}
              />
            )
          )}

          {currentTab === 'enquiries' && (
            <EnquiriesManager
              selectedEnquiryId={selectedEnquiryId}
              onClearSelectedId={() => setSelectedEnquiryId(null)}
            />
          )}

          {currentTab === 'cms' && <CmsContentManager />}

          {currentTab === 'gallery' && <GalleryManager />}

          {currentTab === 'services' && <ServicesManager />}

          {currentTab === 'pricing' && <PricingRulesManager />}

          {currentTab === 'testimonials' && <ReviewsManager />}

          {currentTab === 'faqs' && <FaqManager />}

          {currentTab === 'media' && <MediaManager />}

          {currentTab === 'settings' && <SettingsManager />}
        </main>
      </div>
    </div>
  );
};
