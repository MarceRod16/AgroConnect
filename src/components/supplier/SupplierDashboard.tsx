import React, { useMemo } from 'react';
import { ArrowRight, GitMerge, Layers, Package, Plus } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { SUPPLIER_TYPE_LABELS } from '../../data/peruCatalog';
import {
  formatKgAsTonsOrKg,
  getOpportunitiesForSupplier,
  normalizeToKg,
} from '../../services/matchingEngine';
import { WorkspaceSection } from '../../types/agroconnect';
import { StatusLabel } from '../common/StatusLabel';

interface SupplierDashboardProps {
  onNavigate: (section: WorkspaceSection) => void;
  onCreateOffer: () => void;
}

export const SupplierDashboard: React.FC<SupplierDashboardProps> = ({
  onNavigate,
  onCreateOffer,
}) => {
  const {
    state,
    currentUser,
    currentSupplierProfile,
    allMatches,
    registerCommercialInterest,
  } = useAgroConnect();

  const myOffers = useMemo(() => {
    if (!currentSupplierProfile) return state.offers;
    return state.offers.filter((o) => o.supplierId === currentSupplierProfile.id);
  }, [state.offers, currentSupplierProfile]);

  const activeOffers = myOffers.filter((o) => o.status === 'activa');
  const totalAvailableKg = activeOffers.reduce(
    (sum, o) => sum + normalizeToKg(o.availableQuantity, o.unit),
    0
  );

  const myOpportunities = useMemo(() => {
    if (!currentSupplierProfile) return allMatches;
    return getOpportunitiesForSupplier(allMatches, currentSupplierProfile.id);
  }, [allMatches, currentSupplierProfile]);

  const compatibleBuyerIds = new Set(myOpportunities.map((m) => m.buyer.id)).size;

  const pendingContacts = useMemo(() => {
    if (!currentSupplierProfile) return 0;
    return state.interests.filter(
      (i) => i.supplierIds.includes(currentSupplierProfile.id) && i.status === 'pendiente'
    ).length;
  }, [state.interests, currentSupplierProfile]);

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium text-[#15803D]">
              {currentSupplierProfile
                ? SUPPLIER_TYPE_LABELS[currentSupplierProfile.supplierType]
                : 'Proveedor Agrícola'}{' '}
              · {currentSupplierProfile?.productionLocation.department ?? 'Perú'}
            </p>
            {currentSupplierProfile && (
              <StatusLabel variant={currentSupplierProfile.validationStatus} />
            )}
          </div>
          <h2 className="text-xl font-bold font-display text-[#111814] mt-1">
            {currentSupplierProfile?.organizationName ?? 'Panel del Proveedor'}
          </h2>
          <p className="text-xs text-[#526058] mt-1">
            Publica lotes disponibles y participa en demandas industriales directas o consolidadas
            junto a otros productores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('matching')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#14532D] bg-[#EFF4F0] hover:bg-[#E1ECE3] rounded-lg cursor-pointer"
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Ver oportunidades</span>
          </button>
          <button
            type="button"
            onClick={onCreateOffer}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publicar oferta</span>
          </button>
        </div>
      </div>

      {/* A. Resumen general */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Ofertas activas</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
            {activeOffers.length}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">Lotes publicados</p>
        </div>

        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Volumen publicado</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mt-1">
            {formatKgAsTonsOrKg(totalAvailableKg)}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">Disponibilidad activa</p>
        </div>

        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Compradores potenciales</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
            {compatibleBuyerIds}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">Con demanda compatible</p>
        </div>

        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Solicitudes compatibles</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#B45309] mt-1">
            {myOpportunities.length}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">Directas y consolidadas</p>
        </div>

        <div className="bg-white border border-[#DFE6E0] rounded-xl p-4">
          <p className="text-xs text-[#526058]">Contactos pendientes</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
            {pendingContacts}
          </p>
          <p className="text-[11px] text-[#708077] mt-1">Intereses por responder</p>
        </div>
      </section>

      {/* E. Mis oportunidades comerciales */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#DFE6E0]">
          <div>
            <h3 className="text-base font-bold font-display text-[#111814]">
              Mis oportunidades comerciales compatibles
            </h3>
            <p className="text-xs text-[#526058]">
              Solicitudes de compra donde tu lote califica de forma directa o en consolidación con otros proveedores.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('explorer')}
            className="text-xs font-semibold text-[#14532D] hover:underline cursor-pointer"
          >
            Explorar todas las demandas
          </button>
        </div>

        {myOpportunities.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#526058]">
            Aún no hay solicitudes compatibles con tus lotes activos. Publica una nueva oferta o busca compradores.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {myOpportunities.map((opp) => {
              const myContrib = opp.contributions.find(
                (c) => c.supplier.id === currentSupplierProfile?.id
              );
              const alreadyInterested = state.interests.some(
                (i) => i.requestId === opp.request.id && i.initiatorUserId === currentUser?.id
              );

              return (
                <div
                  key={opp.id}
                  className="p-4 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      {opp.type === 'consolidated' ? (
                        <span className="inline-flex items-center gap-1 text-[#B45309]">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Consolidated Match ({opp.contributions.length} proveedores)</span>
                        </span>
                      ) : (
                        <span className="text-[#14532D]">Direct Match</span>
                      )}
                      <span className="text-[#708077]">·</span>
                      <span className="font-mono-tabular text-[#111814]">
                        Compatibilidad {opp.heuristicScore}/100
                      </span>
                    </div>

                    <p className="text-sm font-bold text-[#111814]">
                      {opp.buyer.companyName} solicita {formatKgAsTonsOrKg(opp.requiredKg)} de{' '}
                      {opp.request.product} ({opp.request.variety})
                    </p>
                    <p className="text-xs text-[#526058]">
                      Tu aporte evaluado:{' '}
                      <strong className="font-mono-tabular text-[#14532D]">
                        {myContrib ? formatKgAsTonsOrKg(myContrib.offeredKg) : 'N/A'} (
                        {myContrib?.sharePercent ?? 0}% de la demanda)
                      </strong>{' '}
                      · Entrega: {opp.request.deliveryDate} en {opp.request.receptionLocation.department}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {alreadyInterested ? (
                      <StatusLabel variant="compatible" text="Interés manifestado" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (!currentUser || !currentSupplierProfile) return;
                          registerCommercialInterest({
                            initiatedByRole: 'supplier',
                            initiatorUserId: currentUser.id,
                            requestId: opp.request.id,
                            offerIds: myContrib ? [myContrib.offer.id] : [],
                            matchType: opp.type,
                            buyerId: opp.buyer.id,
                            supplierIds: [currentSupplierProfile.id],
                            message: `Manifestamos interés comercial para abastecer ${opp.request.product} con nuestro lote disponible.`,
                          });
                        }}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
                      >
                        Manifestar interés
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onNavigate('matching')}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#14532D] bg-white border border-[#DFE6E0] rounded-lg cursor-pointer"
                    >
                      <span>Detalle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* B. Mis ofertas recientes */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#DFE6E0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#14532D]" />
            <h3 className="text-sm font-bold font-display text-[#111814]">
              Mis lotes publicados
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('offers')}
            className="text-xs font-semibold text-[#14532D] hover:underline cursor-pointer"
          >
            Administrar ofertas
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#F7F9F7] border-b border-[#DFE6E0] text-[#526058]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Producto</th>
                <th className="py-2.5 px-4 font-semibold text-right">Cantidad</th>
                <th className="py-2.5 px-4 font-semibold">Calidad</th>
                <th className="py-2.5 px-4 font-semibold">Disponibilidad</th>
                <th className="py-2.5 px-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE6E0]">
              {myOffers.slice(0, 5).map((offer) => (
                <tr key={offer.id} className="hover:bg-[#F7F9F7]/60">
                  <td className="py-3 px-4 font-medium text-[#111814]">
                    {offer.product} · {offer.variety}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-tabular text-[#111814]">
                    {offer.availableQuantity} {offer.unit}
                  </td>
                  <td className="py-3 px-4 text-[#526058]">{offer.quality}</td>
                  <td className="py-3 px-4 font-mono-tabular text-[#526058]">
                    {offer.availableFrom} a {offer.availableTo}
                  </td>
                  <td className="py-3 px-4">
                    <StatusLabel variant={offer.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
