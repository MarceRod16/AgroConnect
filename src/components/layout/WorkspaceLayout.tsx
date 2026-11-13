import React, { useState } from 'react';
import {
  BarChart3,
  Building2,
  Calendar,
  Compass,
  FilePlus2,
  GitMerge,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  RefreshCw,
  Settings,
  ShoppingBag,
  Sprout,
  UserCircle2,
  X,
} from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { WorkspaceSection } from '../../types/agroconnect';

interface WorkspaceLayoutProps {
  activeSection: WorkspaceSection;
  onSelectSection: (section: WorkspaceSection) => void;
  onQuickCreate: () => void;
  children: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  activeSection,
  onSelectSection,
  onQuickCreate,
  children,
}) => {
  const {
    currentUser,
    activeRole,
    switchActiveRole,
    logout,
    resetDemoData,
    allMatches,
  } = useAgroConnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDual = currentUser?.roleType === 'both';

  const buyerNav: { id: WorkspaceSection; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Resumen Comprador', Icon: LayoutDashboard },
    { id: 'matching', label: 'Smart Matching', Icon: GitMerge },
    { id: 'requests', label: 'Mis Solicitudes', Icon: ShoppingBag },
    { id: 'explorer', label: 'Explorar Proveedores', Icon: Compass },
    { id: 'profiles', label: 'Perfiles Comerciales', Icon: UserCircle2 },
    { id: 'stats', label: 'Estadísticas', Icon: BarChart3 },
    { id: 'events', label: 'Eventos Comerciales', Icon: Calendar },
    { id: 'settings', label: 'Cuenta y Planes', Icon: Settings },
  ];

  const supplierNav: { id: WorkspaceSection; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Resumen Proveedor', Icon: LayoutDashboard },
    { id: 'offers', label: 'Mis Productos y Ofertas', Icon: Package },
    { id: 'matching', label: 'Oportunidades Matching', Icon: GitMerge },
    { id: 'explorer', label: 'Buscar Compradores', Icon: Compass },
    { id: 'profiles', label: 'Perfiles Comerciales', Icon: UserCircle2 },
    { id: 'stats', label: 'Estadísticas', Icon: BarChart3 },
    { id: 'events', label: 'Eventos Comerciales', Icon: Calendar },
    { id: 'settings', label: 'Cuenta y Planes', Icon: Settings },
  ];

  const navItems = activeRole === 'buyer' ? buyerNav : supplierNav;

  const sectionTitle =
    navItems.find((n) => n.id === activeSection)?.label ?? 'AgroConnect';

  const consolidatedCount = allMatches.filter((m) => m.type === 'consolidated').length;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#DFE6E0]">
      <div className="px-5 py-4 border-b border-[#DFE6E0]">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-[#14532D] font-display">
            AgroConnect
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-[#526058] hover:text-[#111814]"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[11px] text-[#708077] mt-0.5 truncate">
          {currentUser?.identification.tradeName || `${currentUser?.firstName} ${currentUser?.lastName}`}
        </p>
      </div>

      {/* Selector de rol sin cerrar sesión */}
      <div className="px-4 py-3 border-b border-[#DFE6E0] bg-[#F7F9F7]">
        <p className="text-[11px] font-medium text-[#526058] mb-1.5">
          {isDual ? 'Cambiar perfil activo' : 'Perfil de sesión'}
        </p>
        {isDual ? (
          <div className="grid grid-cols-2 gap-1 p-1 bg-white border border-[#DFE6E0] rounded-lg">
            <button
              type="button"
              onClick={() => {
                switchActiveRole('buyer');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeRole === 'buyer'
                  ? 'bg-[#14532D] text-white'
                  : 'text-[#526058] hover:text-[#111814]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Comprador</span>
            </button>
            <button
              type="button"
              onClick={() => {
                switchActiveRole('supplier');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeRole === 'supplier'
                  ? 'bg-[#14532D] text-white'
                  : 'text-[#526058] hover:text-[#111814]'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 shrink-0" />
              <span>Proveedor</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white border border-[#DFE6E0] text-xs font-semibold text-[#14532D]">
            <span className="flex items-center gap-1.5">
              {activeRole === 'buyer' ? (
                <>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Comprador</span>
                </>
              ) : (
                <>
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Proveedor</span>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                onSelectSection('settings');
                setMobileMenuOpen(false);
              }}
              className="text-[11px] font-medium text-[#526058] hover:text-[#14532D] underline cursor-pointer"
            >
              Activar dual
            </button>
          </div>
        )}
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onSelectSection(id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#EFF4F0] text-[#14532D] font-semibold'
                  : 'text-[#526058] hover:bg-[#F7F9F7] hover:text-[#111814]'
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#14532D]' : 'text-[#708077]'}`} />
                <span className="truncate">{label}</span>
              </span>
              {id === 'matching' && consolidatedCount > 0 && (
                <span className="text-[11px] font-mono-tabular text-[#B45309] font-semibold shrink-0">
                  {consolidatedCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Pie de barra lateral */}
      <div className="p-3 border-t border-[#DFE6E0] space-y-1.5">
        <button
          type="button"
          onClick={resetDemoData}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#526058] hover:text-[#111814] hover:bg-[#F7F9F7] rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 shrink-0" />
          <span>Restaurar datos demo</span>
        </button>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#526058] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#111814] flex">
      {/* Sidebar escritorio */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Drawer móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/35"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar contextual */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#DFE6E0]">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-1 text-[#526058] hover:text-[#111814] rounded-lg border border-[#DFE6E0]"
                aria-label="Abrir menú"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold font-display text-[#111814] truncate">
                  {sectionTitle}
                </h1>
                <p className="text-[11px] text-[#708077] truncate">
                  {activeRole === 'buyer' ? 'Perfil Comprador' : 'Perfil Proveedor'} · Entorno de demostración (datos ficticios)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onQuickCreate}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>{activeRole === 'buyer' ? 'Nueva solicitud' : 'Publicar oferta'}</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-[1360px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
