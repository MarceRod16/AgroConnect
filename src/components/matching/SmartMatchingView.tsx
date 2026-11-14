import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  GitMerge,
  Layers,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { DELIVERY_MODE_LABELS, SUPPLIER_TYPE_LABELS } from '../../data/peruCatalog';
import { formatKgAsTonsOrKg, getOpportunitiesForSupplier } from '../../services/matchingEngine';
import { MatchOpportunity, SupplierProfile } from '../../types/agroconnect';
import { StatusLabel } from '../common/StatusLabel';

interface SmartMatchingViewProps {
  initialRequestFilterId?: string;
  onInspectSupplier?: (supplier: SupplierProfile) => void;
}

export const SmartMatchingView: React.FC<SmartMatchingViewProps> = ({
  initialRequestFilterId = 'all',
  onInspectSupplier,
}) => {
  const {
    state,
    activeRole,
    currentUser,
    currentBuyerProfile,
    currentSupplierProfile,
    allMatches,
    registerCommercialInterest,
  } = useAgroConnect();

  const [matchTypeFilter, setMatchTypeFilter] = useState<'all' | 'consolidated' | 'direct'>('all');
  const [scopeFilter, setScopeFilter] = useState<'mine' | 'market'>('mine');
  const [selectedRequestId, setSelectedRequestId] = useState<string>(initialRequestFilterId);
  const [selectedMatch, setSelectedMatch] = useState<MatchOpportunity | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const scopedMatches = useMemo(() => {
    let list = allMatches;

    if (scopeFilter === 'mine') {
      if (activeRole === 'buyer' && currentBuyerProfile) {
        const mine = list.filter((m) => m.buyer.id === currentBuyerProfile.id);
        if (mine.length > 0) list = mine;
      } else if (activeRole === 'supplier' && currentSupplierProfile) {
        list = getOpportunitiesForSupplier(list, currentSupplierProfile.id);
      }
    }

    if (selectedRequestId !== 'all') {
      list = list.filter((m) => m.request.id === selectedRequestId);
    }

    if (matchTypeFilter !== 'all') {
      list = list.filter((m) => m.type === matchTypeFilter);
    }

    return list;
  }, [
    allMatches,
    scopeFilter,
    activeRole,
    currentBuyerProfile,
    currentSupplierProfile,
    selectedRequestId,
    matchTypeFilter,
  ]);

  const relevantRequests = useMemo(() => {
    if (activeRole === 'buyer' && currentBuyerProfile && scopeFilter === 'mine') {
      const own = state.requests.filter(
        (r) => r.buyerId === currentBuyerProfile.id && r.status === 'activa'
      );
      return own.length > 0 ? own : state.requests.filter((r) => r.status === 'activa');
    }
    return state.requests.filter((r) => r.status === 'activa');
  }, [state.requests, activeRole, currentBuyerProfile, scopeFilter]);

  const consolidatedCount = scopedMatches.filter((m) => m.type === 'consolidated').length;
  const directCount = scopedMatches.filter((m) => m.type === 'direct').length;

  const isInterestAlreadySent = (match: MatchOpportunity) => {
    return state.interests.some(
      (i) =>
        i.requestId === match.request.id &&
        i.matchType === match.type &&
        i.offerIds.slice().sort().join(',') ===
          match.contributions
            .map((c) => c.offer.id)
            .sort()
            .join(',') &&
        i.initiatorUserId === currentUser?.id
    );
  };

  const handleSubmitInterest = (match: MatchOpportunity) => {
    if (!currentUser) return;
    registerCommercialInterest({
      initiatedByRole: activeRole,
      initiatorUserId: currentUser.id,
      requestId: match.request.id,
      offerIds: match.contributions.map((c) => c.offer.id),
      matchType: match.type,
      buyerId: match.buyer.id,
      supplierIds: match.contributions.map((c) => c.supplier.id),
      message:
        contactMessage.trim() ||
        (activeRole === 'buyer'
          ? `Solicitud de contacto para ${match.request.product} (${formatKgAsTonsOrKg(match.requiredKg)}).`
          : `Interés comercial para participar en el abastecimiento de ${match.request.product}.`),
    });
    setContactMessage('');
  };

  const segmentColors = ['bg-[#14532D]', 'bg-[#15803D]', 'bg-[#D97706]', 'bg-[#4D7C0F]'];

  return (
    <div className="space-y-6">
      {/* Encabezado principal del módulo */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#15803D] mb-1">
              Motor determinista de consolidación agrícola
            </p>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#111814] tracking-tight">
              Smart Matching — Oportunidades de abastecimiento
            </h2>
            <p className="text-sm text-[#526058] mt-1 max-w-3xl">
              Evalúa compatibilidad en 10 variables y prioriza la{' '}
              <strong className="text-[#111814]">consolidación multi-proveedor</strong> cuando ningún
              productor individual cubre el volumen demandado. Una coincidencia es un indicador heurístico
              del prototipo y no confirma compra ni reserva inventario automáticamente.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#DFE6E0]">
            <div className="text-right">
              <p className="text-xs text-[#708077]">Consolidadas</p>
              <p className="text-xl font-bold font-mono-tabular text-[#D97706]">{consolidatedCount}</p>
            </div>
            <div className="h-8 w-px bg-[#DFE6E0]" />
            <div className="text-right">
              <p className="text-xs text-[#708077]">Directas</p>
              <p className="text-xl font-bold font-mono-tabular text-[#14532D]">{directCount}</p>
            </div>
          </div>
        </div>

        {/* Barra de controles y filtros */}
        <div className="mt-5 pt-4 border-t border-[#DFE6E0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tipo de matching */}
            <div className="flex items-center gap-1 p-1 bg-[#EFF4F0] rounded-lg">
              {(
                [
                  { id: 'all', label: 'Todas' },
                  { id: 'consolidated', label: 'Consolidated Match' },
                  { id: 'direct', label: 'Direct Match' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMatchTypeFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    matchTypeFilter === tab.id
                      ? 'bg-white text-[#111814] shadow-xs'
                      : 'text-[#526058] hover:text-[#111814]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Alcance */}
            <div className="flex items-center gap-1 p-1 bg-[#EFF4F0] rounded-lg">
              <button
                type="button"
                onClick={() => setScopeFilter('mine')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  scopeFilter === 'mine'
                    ? 'bg-white text-[#111814] shadow-xs'
                    : 'text-[#526058] hover:text-[#111814]'
                }`}
              >
                {activeRole === 'buyer' ? 'Mis solicitudes' : 'Donde participo'}
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter('market')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  scopeFilter === 'market'
                    ? 'bg-white text-[#111814] shadow-xs'
                    : 'text-[#526058] hover:text-[#111814]'
                }`}
              >
                Todo el mercado (Demo)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#526058] whitespace-nowrap">Filtrar solicitud:</label>
            <select
              value={selectedRequestId}
              onChange={(e) => setSelectedRequestId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#DFE6E0] rounded-lg text-[#111814] focus:outline-none focus:border-[#14532D]"
            >
              <option value="all">Todas las solicitudes activas</option>
              {relevantRequests.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.product} · {req.quantity} {req.unit} ({req.receptionLocation.department})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Listado de tarjetas de oportunidades */}
      {scopedMatches.length === 0 ? (
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-10 text-center">
          <GitMerge className="w-8 h-8 text-[#708077] mx-auto mb-3" />
          <h3 className="text-base font-bold font-display text-[#111814]">
            No hay coincidencias con los filtros seleccionados
          </h3>
          <p className="text-sm text-[#526058] mt-1 max-w-md mx-auto">
            {scopeFilter === 'mine' && activeRole === 'supplier'
              ? 'Tus ofertas activas actuales aún no coinciden con una solicitud publicada. Puedes explorar todo el mercado o publicar una nueva oferta.'
              : 'Prueba cambiando el filtro de solicitud o publicando nuevas ofertas/solicitudes activas.'}
          </p>
          {scopeFilter === 'mine' && (
            <button
              type="button"
              onClick={() => setScopeFilter('market')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] rounded-lg cursor-pointer"
            >
              Ver oportunidades de todo el mercado
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {scopedMatches.map((match) => {
            const isConsolidated = match.type === 'consolidated';
            const alreadySent = isInterestAlreadySent(match);

            return (
              <article
                key={match.id}
                className={`bg-white rounded-xl border p-5 sm:p-6 flex flex-col justify-between transition-colors ${
                  isConsolidated ? 'border-[#D97706]/50' : 'border-[#DFE6E0]'
                }`}
              >
                <div>
                  {/* Cabecera limpia sin pill sandwich */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DFE6E0]">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      {isConsolidated ? (
                        <span className="inline-flex items-center gap-1.5 text-[#D97706]">
                          <Layers className="w-4 h-4" />
                          <span>Consolidated Match · {match.contributions.length} proveedores</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[#14532D]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Direct Match · 1 proveedor</span>
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono-tabular text-[#526058]">
                      Compatibilidad heurística:{' '}
                      <strong className="text-[#111814]">{match.heuristicScore}/100</strong>
                    </div>
                  </div>

                  {/* Título producto y comprador */}
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold font-display text-[#111814]">
                        {match.request.product} · {match.request.variety}
                      </h3>
                      <p className="text-xs text-[#526058] mt-0.5">
                        Comprador: <strong className="text-[#111814]">{match.buyer.companyName}</strong> ·
                        Destino: {match.request.receptionLocation.district},{' '}
                        {match.request.receptionLocation.department}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#708077]">Cobertura de volumen</p>
                      <p
                        className={`text-lg font-bold font-mono-tabular ${
                          match.coveragePercent >= 100 ? 'text-[#15803D]' : 'text-[#D97706]'
                        }`}
                      >
                        {match.coveragePercent}%
                      </p>
                    </div>
                  </div>

                  {/* Barra visual de aportes consolidados */}
                  <div className="mt-4 p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#526058]">
                        Solicitado:{' '}
                        <strong className="font-mono-tabular text-[#111814]">
                          {formatKgAsTonsOrKg(match.requiredKg)}
                        </strong>
                      </span>
                      <span className="text-[#526058]">
                        Disponible combinado:{' '}
                        <strong className="font-mono-tabular text-[#14532D]">
                          {formatKgAsTonsOrKg(match.consolidatedAvailableKg)}
                        </strong>
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#DFE6E0] rounded-full overflow-hidden flex">
                      {match.contributions.map((c, idx) => {
                        const widthPct = Math.min(
                          100,
                          Math.max(4, Math.round((c.allocatedKg / Math.max(match.requiredKg, 1)) * 100))
                        );
                        return (
                          <div
                            key={c.offer.id}
                            style={{ width: `${widthPct}%` }}
                            className={`${segmentColors[idx % segmentColors.length]} h-full border-r border-white last:border-r-0`}
                            title={`${c.supplier.organizationName}: ${formatKgAsTonsOrKg(c.offeredKg)}`}
                          />
                        );
                      })}
                    </div>

                    {/* Desglose compacto de proveedores aportantes */}
                    <div className="mt-3 space-y-1.5">
                      {match.contributions.map((c, idx) => (
                        <div
                          key={c.offer.id}
                          className="flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="flex items-center gap-2 text-[#111814] truncate">
                            <span
                              className={`w-2 h-2 rounded-xs shrink-0 ${segmentColors[idx % segmentColors.length]}`}
                            />
                            <span className="truncate font-medium">
                              {c.supplier.organizationName}
                            </span>
                            <span className="text-[#708077] shrink-0">
                              ({c.offer.location.province})
                            </span>
                          </span>
                          <span className="font-mono-tabular text-[#111814] font-semibold shrink-0">
                            {formatKgAsTonsOrKg(c.offeredKg)}
                            {c.pricePerKgPen !== undefined
                              ? ` · S/ ${c.pricePerKgPen.toFixed(2)}/kg`
                              : ' · Precio por confirmar'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {(match.missingKg > 0 || match.surplusKg > 0) && (
                      <div className="mt-2.5 pt-2 border-t border-[#DFE6E0] flex items-center justify-between text-xs font-mono-tabular">
                        {match.missingKg > 0 ? (
                          <span className="text-[#D97706]">
                            Faltante por cubrir: {formatKgAsTonsOrKg(match.missingKg)}
                          </span>
                        ) : (
                          <span className="text-[#15803D]">Demanda cubierta al 100%</span>
                        )}
                        {match.surplusKg > 0 && (
                          <span className="text-[#526058]">
                            Excedente disponible en lote: +{formatKgAsTonsOrKg(match.surplusKg)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Metadatos clave unificados */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-xs text-[#708077]">Calidad y fecha</p>
                      <p className="font-medium text-[#111814] mt-0.5">
                        {match.request.quality} · {match.request.deliveryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#708077]">Ubicación origen</p>
                      <p className="font-medium text-[#111814] mt-0.5 truncate" title={match.locationSummary}>
                        {match.locationSummary}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#708077]">Precio estimado</p>
                      <p className="font-medium font-mono-tabular text-[#111814] mt-0.5">
                        {match.estimatedWeightedPricePerKgPen !== undefined
                          ? `S/ ${match.estimatedWeightedPricePerKgPen.toFixed(2)}/kg prom.`
                          : 'Pendiente de confirmar'}
                        {match.pricePendingCount > 0 && match.estimatedWeightedPricePerKgPen !== undefined
                          ? ' (parcial)'
                          : ''}
                      </p>
                    </div>
                  </div>

                  {match.pendingConfirmations.length > 0 && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-[#D97706] bg-[#FEF3C7]/45 border border-[#FDE68A] rounded-lg px-3 py-2">
                      <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        Pendiente de confirmación: {match.pendingConfirmations.join(' · ')}.
                      </span>
                    </div>
                  )}
                </div>

                {/* Pie de tarjeta con acciones */}
                <div className="mt-5 pt-4 border-t border-[#DFE6E0] flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMatch(match)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#14532D] hover:underline cursor-pointer"
                  >
                    <span>Ver desglose de 10 variables</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {alreadySent ? (
                    <StatusLabel variant="compatible" text="Contacto / interés registrado" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedMatch(match)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors cursor-pointer"
                    >
                      {activeRole === 'buyer' ? 'Revisar y solicitar contacto' : 'Manifestar interés'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de detalle completo de oportunidad */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto">
          <div className="bg-white border border-[#DFE6E0] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DFE6E0]">
              <div>
                <p className="text-xs font-semibold text-[#15803D]">
                  {selectedMatch.type === 'consolidated'
                    ? `Consolidated Match · ${selectedMatch.contributions.length} proveedores compatibles`
                    : 'Direct Match · Cobertura individual completa'}
                </p>
                <h3 className="text-xl font-bold font-display text-[#111814] mt-0.5">
                  {selectedMatch.request.product} ({selectedMatch.request.variety}) —{' '}
                  {formatKgAsTonsOrKg(selectedMatch.requiredKg)}
                </h3>
                <p className="text-xs text-[#526058] mt-1">
                  Comprador: {selectedMatch.buyer.companyName} · Recepción en{' '}
                  {selectedMatch.request.receptionLocation.district},{' '}
                  {selectedMatch.request.receptionLocation.department} · Entrega:{' '}
                  {selectedMatch.request.deliveryDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMatch(null)}
                className="p-1.5 text-[#526058] hover:text-[#111814] rounded-lg border border-[#DFE6E0] cursor-pointer"
                aria-label="Cerrar detalle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Aviso heurístico transparente */}
            <div className="mt-4 p-3 rounded-lg bg-[#EFF4F0] border border-[#DFE6E0] flex items-start gap-2.5 text-xs text-[#526058]">
              <AlertCircle className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111814]">
                  Indicador heurístico del prototipo: {selectedMatch.heuristicScore}/100.
                </strong>{' '}
                Calculado de forma determinista con los datos registrados. Esta propuesta no reserva
                inventario ni confirma una orden de compra; sirve para coordinar contacto comercial.
              </div>
            </div>

            {/* Aportes de proveedores */}
            <div className="mt-6">
              <h4 className="text-sm font-bold font-display text-[#111814] mb-3">
                Detalle de proveedores y aportes de volumen
              </h4>
              <div className="space-y-3">
                {selectedMatch.contributions.map((c) => (
                  <div
                    key={c.offer.id}
                    className="p-4 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#111814]">
                          {c.supplier.organizationName}
                        </span>
                        <span className="text-xs text-[#526058]">
                          · {SUPPLIER_TYPE_LABELS[c.supplier.supplierType]}
                        </span>
                        <StatusLabel variant={c.supplier.validationStatus} />
                      </div>
                      <p className="text-xs text-[#526058] flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {c.offer.location.district}, {c.offer.location.province} ({c.offer.location.department})
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          {DELIVERY_MODE_LABELS[c.offer.deliveryMode]}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {c.offer.quality} · Variedad {c.offer.variety}
                        </span>
                      </p>
                      <p className="text-xs text-[#708077]">
                        Disponibilidad: {c.offer.availableFrom} al {c.offer.availableTo} ·{' '}
                        {c.supplier.hasOwnTransport ? 'Con transporte propio' : 'Requiere coordinar flete'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-base font-bold font-mono-tabular text-[#14532D]">
                          {formatKgAsTonsOrKg(c.offeredKg)}{' '}
                          <span className="text-xs font-normal text-[#526058]">
                            ({c.sharePercent}% demanda)
                          </span>
                        </p>
                        <p className="text-xs font-mono-tabular text-[#111814]">
                          {c.pricePerKgPen !== undefined
                            ? `S/ ${c.pricePerKgPen.toFixed(2)} / kg ${c.offer.priceNegotiable ? '(negociable)' : '(fijo)'}`
                            : 'Precio pendiente de confirmación'}
                        </p>
                      </div>
                      {onInspectSupplier && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMatch(null);
                            onInspectSupplier(c.supplier);
                          }}
                          className="text-xs font-semibold text-[#14532D] hover:underline cursor-pointer"
                        >
                          Ver perfil comercial
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desglose de las 10 variables */}
            <div className="mt-6">
              <h4 className="text-sm font-bold font-display text-[#111814] mb-3">
                Desglose de compatibilidad (10 variables evaluadas)
              </h4>
              <div className="border border-[#DFE6E0] rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#F7F9F7] border-b border-[#DFE6E0] text-[#526058]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Variable</th>
                      <th className="py-2.5 px-3 font-semibold">Estado</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Peso / Puntaje</th>
                      <th className="py-2.5 px-3 font-semibold">Observación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFE6E0]">
                    {selectedMatch.breakdown.map((row) => (
                      <tr key={row.variable} className="hover:bg-[#F7F9F7]/60">
                        <td className="py-2.5 px-3 font-medium text-[#111814] whitespace-nowrap">
                          {row.variable}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <StatusLabel variant={row.status} />
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono-tabular text-[#111814] whitespace-nowrap">
                          {row.weight}% · {row.score}/100
                        </td>
                        <td className="py-2.5 px-3 text-[#526058]">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Acción de contacto */}
            <div className="mt-6 pt-5 border-t border-[#DFE6E0]">
              {isInterestAlreadySent(selectedMatch) ? (
                <div className="p-4 rounded-lg bg-[#EFF4F0] border border-[#DFE6E0] flex items-center justify-between">
                  <StatusLabel
                    variant="compatible"
                    text="Ya registraste una solicitud de contacto / interés para esta oportunidad."
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedMatch(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#14532D] bg-white border border-[#DFE6E0] rounded-lg cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-[#111814]">
                    Mensaje inicial para {activeRole === 'buyer' ? 'los proveedores' : 'el comprador'} (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={
                      activeRole === 'buyer'
                        ? 'Ej. Nos interesa coordinar muestras y validar ventana de entrega en planta Ate.'
                        : 'Ej. Confirmamos disponibilidad del lote y podemos coordinar entrega en Lima.'
                    }
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-[#708077]">
                      Se registrará un interés comercial sin comprometer inventario ni pagos.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSubmitInterest(selectedMatch)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {activeRole === 'buyer'
                          ? 'Solicitar contacto con proveedores'
                          : 'Manifestar interés comercial'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
