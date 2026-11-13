import React, { useMemo } from 'react';
import { ArrowRight, GitMerge, Layers, Plus, ShoppingBag } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { formatKgAsTonsOrKg, normalizeToKg } from '../../services/matchingEngine';
import { WorkspaceSection } from '../../types/agroconnect';
import { StatusLabel } from '../common/StatusLabel';

interface BuyerDashboardProps {
  onNavigate: (section: WorkspaceSection, requestId?: string) => void;
  onCreateRequest: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  onNavigate,
  onCreateRequest,
}) => {
  const { state, currentBuyerProfile, allMatches } = useAgroConnect();

  const myRequests = useMemo(() => {
    if (!currentBuyerProfile) return state.requests;
    return state.requests.filter((r) => r.buyerId === currentBuyerProfile.id);
  }, [state.requests, currentBuyerProfile]);

  const activeRequests = myRequests.filter((r) => r.status === 'activa');

  const myMatches = useMemo(() => {
    if (!currentBuyerProfile) return allMatches;
    const own = allMatches.filter((m) => m.buyer.id === currentBuyerProfile.id);
    return own.length > 0 ? own : allMatches;
  }, [allMatches, currentBuyerProfile]);

  const consolidatedMatches = myMatches.filter((m) => m.type === 'consolidated');

  const compatibleSupplierIds = useMemo(() => {
    const ids = new Set<string>();
    myMatches.forEach((m) => m.contributions.forEach((c) => ids.add(c.supplier.id)));
    return ids.size;
  }, [myMatches]);

  const pendingContacts = useMemo(() => {
    if (!currentBuyerProfile) return 0;
    return state.interests.filter(
      (i) => i.buyerId === currentBuyerProfile.id && i.status === 'pendiente'
    ).length;
  }, [state.interests, currentBuyerProfile]);

  const topDemandedProducts = useMemo(() => {
    const counts = new Map<string, number>();
    state.requests
      .filter((r) => r.status === 'activa')
      .forEach((r) => {
        const kg = normalizeToKg(r.quantity, r.unit);
        counts.set(r.product, (counts.get(r.product) ?? 0) + kg);
      });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [state.requests]);

  const featuredConsolidated = consolidatedMatches[0] ?? myMatches[0];

  return (
    <div className="space-y-6">
      {/* Encabezado de bienvenida */}
      <div className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#15803D]">
            {currentBuyerProfile?.subsector ?? 'Comprador Industrial'} ·{' '}
            {currentBuyerProfile?.plantLocation.department ?? 'Perú'}
          </p>
          <h2 className="text-xl font-bold font-display text-[#111814] mt-0.5">
            {currentBuyerProfile?.companyName ?? 'Panel del Comprador'}
          </h2>
          <p className="text-xs text-[#526058] mt-1">
            Supervisa tus solicitudes activas, descubre combinaciones multi-proveedor y coordina
            abastecimiento agrícola.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('matching')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#14532D] bg-[#EFF4F0] hover:bg-[#E1ECE3] rounded-lg cursor-pointer"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Abrir Smart Matching</span>
          </button>
          <button
            type="button"
            onClick={onCreateRequest}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva solicitud</span>
          </button>
        </div>
      </div>

      {/* A. Resumen general (KPIs con tabular-nums) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Solicitudes activas</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
            {activeRequests.length}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">Publicadas por tu empresa</p>
        </div>

        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Proveedores compatibles</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mt-1">
            {compatibleSupplierIds}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">En ofertas evaluadas</p>
        </div>

        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Consolidaciones detectadas</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#B45309] mt-1">
            {consolidatedMatches.length}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">Alianzas multi-proveedor</p>
        </div>

        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Contactos pendientes</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
            {pendingContacts}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">Seguimientos iniciados</p>
        </div>

        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Mayor demanda en red</p>
          <div className="mt-1 space-y-0.5">
            {topDemandedProducts.map(([prod, kg]) => (
              <div key={prod} className="flex items-center justify-between text-xs">
                <span className="text-[#111814] font-medium truncate">{prod}</span>
                <span className="font-mono-tabular text-[#526058]">{formatKgAsTonsOrKg(kg)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* C. Oportunidad de consolidación destacada */}
      {featuredConsolidated && (
        <section className="bg-white border border-[#D97706]/50 rounded-xl p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#B45309]">
                <Layers className="w-4 h-4" />
                <span>
                  {featuredConsolidated.type === 'consolidated'
                    ? 'Oportunidad destacada de Consolidación Multi-Proveedor'
                    : 'Oportunidad destacada de Abastecimiento Directo'}
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-[#111814]">
                {featuredConsolidated.request.product} · {featuredConsolidated.request.variety} —{' '}
                <span className="font-mono-tabular">
                  {formatKgAsTonsOrKg(featuredConsolidated.requiredKg)}
                </span>
              </h3>
              <p className="text-xs text-[#526058]">
                {featuredConsolidated.contributions.length} proveedor(es) compatible(s) cubren el{' '}
                <strong className="font-mono-tabular text-[#15803D]">
                  {featuredConsolidated.coveragePercent}%
                </strong>{' '}
                ({featuredConsolidated.contributions.map((c) => formatKgAsTonsOrKg(c.offeredKg)).join(' + ')}) ·
                Compatibilidad heurística:{' '}
                <strong className="font-mono-tabular">{featuredConsolidated.heuristicScore}/100</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('matching', featuredConsolidated.request.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Inspeccionar consolidación</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* B. Resumen rápido de mis solicitudes */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DFE6E0] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#14532D]" />
            <h3 className="text-sm font-bold font-display text-[#111814]">
              Mis solicitudes recientes
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('requests')}
            className="text-xs font-semibold text-[#14532D] hover:underline cursor-pointer"
          >
            Gestionar todas
          </button>
        </div>

        {myRequests.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#526058]">
            No tienes solicitudes registradas aún. Crea una nueva solicitud para activar el Smart Matching.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F7F9F7] border-b border-[#DFE6E0] text-[#526058]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Producto / Variedad</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Cantidad</th>
                  <th className="py-2.5 px-4 font-semibold">Calidad</th>
                  <th className="py-2.5 px-4 font-semibold">Entrega</th>
                  <th className="py-2.5 px-4 font-semibold">Estado</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE6E0]">
                {myRequests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-[#F7F9F7]/60">
                    <td className="py-3 px-4 font-medium text-[#111814]">
                      {req.product} · {req.variety}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-tabular text-[#111814]">
                      {req.quantity} {req.unit}
                    </td>
                    <td className="py-3 px-4 text-[#526058]">{req.quality}</td>
                    <td className="py-3 px-4 font-mono-tabular text-[#526058]">
                      {req.deliveryDate} · {req.receptionLocation.department}
                    </td>
                    <td className="py-3 px-4">
                      <StatusLabel variant={req.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate('matching', req.id)}
                        className="text-xs font-semibold text-[#14532D] hover:underline cursor-pointer"
                      >
                        Ver matching
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
