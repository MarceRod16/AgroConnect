import React, { useEffect, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { AuthAndOnboardingView } from './components/auth/AuthAndOnboardingView';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { PurchaseRequestsManager } from './components/buyer/PurchaseRequestsManager';
import { SupplierExplorer } from './components/buyer/SupplierExplorer';
import { EventsView } from './components/events/EventsView';
import { LandingView } from './components/landing/LandingView';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { SmartMatchingView } from './components/matching/SmartMatchingView';
import { CommercialProfilesView } from './components/profiles/CommercialProfilesView';
import { AccountSettingsAndPlansView } from './components/settings/AccountSettingsAndPlansView';
import { StatisticsView } from './components/stats/StatisticsView';
import { BuyerExplorer } from './components/supplier/BuyerExplorer';
import { SupplierDashboard } from './components/supplier/SupplierDashboard';
import { SupplyOffersManager } from './components/supplier/SupplyOffersManager';
import { AgroConnectProvider, useAgroConnect } from './context/AgroConnectContext';
import { SupplierProfile, WorkspaceSection } from './types/agroconnect';

const AgroConnectShell: React.FC = () => {
  const { currentUser, activeRole, toast, dismissToast } = useAgroConnect();

  // Experiencia inicial: Inicio de sesión y onboarding primero (con acceso a Landing B2B)
  const [unauthScreen, setUnauthScreen] = useState<'auth' | 'landing'>('auth');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  const [activeSection, setActiveSection] = useState<WorkspaceSection>('dashboard');
  const [matchingRequestFilter, setMatchingRequestFilter] = useState<string>('all');
  const [openCreateFlag, setOpenCreateFlag] = useState<boolean>(false);
  const [preselectedSupplier, setPreselectedSupplier] = useState<SupplierProfile | null>(null);

  // Cuando cambia el rol activo en cuenta dual, ajustar sección si corresponde a un módulo específico de rol
  useEffect(() => {
    if (activeRole === 'buyer' && activeSection === 'offers') {
      setActiveSection('requests');
    } else if (activeRole === 'supplier' && activeSection === 'requests') {
      setActiveSection('offers');
    }
  }, [activeRole, activeSection]);

  const handleQuickCreate = () => {
    setOpenCreateFlag(true);
    setActiveSection(activeRole === 'buyer' ? 'requests' : 'offers');
  };

  const handleOpenMatchingForRequest = (requestId: string) => {
    setMatchingRequestFilter(requestId);
    setActiveSection('matching');
  };

  const handleInspectSupplier = (supplier: SupplierProfile) => {
    setPreselectedSupplier(supplier);
    setActiveSection('explorer');
  };

  return (
    <>
      {!currentUser ? (
        unauthScreen === 'landing' ? (
          <LandingView
            onGoToAuth={(tab = 'login') => {
              setAuthInitialMode(tab);
              setUnauthScreen('auth');
            }}
          />
        ) : (
          <AuthAndOnboardingView
            initialMode={authInitialMode}
            onOpenLanding={() => setUnauthScreen('landing')}
          />
        )
      ) : (
        <WorkspaceLayout
          activeSection={activeSection}
          onSelectSection={(sec) => {
            if (sec === 'matching') setMatchingRequestFilter('all');
            setActiveSection(sec);
          }}
          onQuickCreate={handleQuickCreate}
        >
          {activeSection === 'dashboard' &&
            (activeRole === 'buyer' ? (
              <BuyerDashboard
                onNavigate={(sec, reqId) => {
                  if (sec === 'matching') {
                    setMatchingRequestFilter(reqId ?? 'all');
                  }
                  setActiveSection(sec);
                }}
                onCreateRequest={handleQuickCreate}
              />
            ) : (
              <SupplierDashboard
                onNavigate={(sec) => setActiveSection(sec)}
                onCreateOffer={handleQuickCreate}
              />
            ))}

          {activeSection === 'matching' && (
            <SmartMatchingView
              initialRequestFilterId={matchingRequestFilter}
              onInspectSupplier={activeRole === 'buyer' ? handleInspectSupplier : undefined}
            />
          )}

          {activeSection === 'requests' && activeRole === 'buyer' && (
            <PurchaseRequestsManager
              openCreateInitially={openCreateFlag}
              onConsumeCreateFlag={() => setOpenCreateFlag(false)}
              onOpenMatchingForRequest={handleOpenMatchingForRequest}
            />
          )}

          {activeSection === 'offers' && activeRole === 'supplier' && (
            <SupplyOffersManager
              openCreateInitially={openCreateFlag}
              onConsumeCreateFlag={() => setOpenCreateFlag(false)}
            />
          )}

          {activeSection === 'explorer' &&
            (activeRole === 'buyer' ? (
              <SupplierExplorer
                preselectedSupplier={preselectedSupplier}
                onClearPreselected={() => setPreselectedSupplier(null)}
              />
            ) : (
              <BuyerExplorer />
            ))}

          {activeSection === 'profiles' && <CommercialProfilesView />}
          {activeSection === 'stats' && <StatisticsView />}
          {activeSection === 'events' && <EventsView />}
          {activeSection === 'settings' && <AccountSettingsAndPlansView />}
        </WorkspaceLayout>
      )}

      {/* Toast global de confirmación */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#111814] text-white px-4 py-3 rounded-xl border border-white/10 shadow-lg flex items-start gap-3 text-xs"
        >
          {toast.type === 'info' ? (
            <Info className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
          )}
          <span className="flex-1 leading-relaxed">{toast.message}</span>
          <button
            type="button"
            onClick={dismissToast}
            className="text-white/70 hover:text-white cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <AgroConnectProvider>
      <AgroConnectShell />
    </AgroConnectProvider>
  );
}
