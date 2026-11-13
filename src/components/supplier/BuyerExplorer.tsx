import React, { useMemo, useState } from 'react';
import { Building2, MapPin, Search, Send, X } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import {
  DELIVERY_MODE_LABELS,
  PERU_LOCATIONS,
  PRODUCT_CATALOG,
  QUALITY_GRADES,
} from '../../data/peruCatalog';
import { formatKgAsTonsOrKg, normalizeToKg } from '../../services/matchingEngine';
import { BuyerProfile, PurchaseRequest } from '../../types/agroconnect';

export const BuyerExplorer: React.FC = () => {
  const {
    state,
    currentUser,
    currentSupplierProfile,
    registerCommercialInterest,
  } = useAgroConnect();

  const [productFilter, setProductFilter] = useState('all');
  const [varietyFilter, setVarietyFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [minTonsFilter, setMinTonsFilter] = useState('');

  const [selectedBuyerModal, setSelectedBuyerModal] = useState<{
    buyer: BuyerProfile;
    request: PurchaseRequest;
  } | null>(null);
  const [interestMessage, setInterestMessage] = useState('');

  const requestItems = useMemo(() => {
    return state.requests
      .filter((r) => r.status === 'activa')
      .map((req) => ({
        request: req,
        buyer: state.buyers.find((b) => b.id === req.buyerId),
      }))
      .filter((item): item is { request: PurchaseRequest; buyer: BuyerProfile } => {
        if (!item.buyer) return false;
        const { request } = item;
        if (productFilter !== 'all' && request.product !== productFilter) return false;
        if (
          varietyFilter.trim() &&
          !request.variety.toLowerCase().includes(varietyFilter.trim().toLowerCase())
        ) {
          return false;
        }
        if (departmentFilter !== 'all' && request.receptionLocation.department !== departmentFilter) {
          return false;
        }
        if (qualityFilter !== 'all' && request.quality !== qualityFilter) return false;
        if (deliveryFilter !== 'all' && request.preferredDeliveryMode !== deliveryFilter) {
          return false;
        }
        if (minTonsFilter) {
          const reqKg = normalizeToKg(request.quantity, request.unit);
          if (reqKg < Number(minTonsFilter) * 1000) return false;
        }
        return true;
      });
  }, [
    state.requests,
    state.buyers,
    productFilter,
    varietyFilter,
    departmentFilter,
    qualityFilter,
    deliveryFilter,
    minTonsFilter,
  ]);

  const getBuyerPlatformMetrics = (buyerId: string) => {
    const totalPublished = state.requests.filter((r) => r.buyerId === buyerId).length;
    const activeCount = state.requests.filter(
      (r) => r.buyerId === buyerId && r.status === 'activa'
    ).length;
    const interactionsCount = state.interests.filter((i) => i.buyerId === buyerId).length;
    return { totalPublished, activeCount, interactionsCount };
  };

  const handleSendInterest = () => {
    if (!selectedBuyerModal || !currentUser) return;
    const myOffers = state.offers.filter(
      (o) =>
        o.supplierId === currentSupplierProfile?.id &&
        o.status === 'activa' &&
        o.product === selectedBuyerModal.request.product
    );
    registerCommercialInterest({
      initiatedByRole: 'supplier',
      initiatorUserId: currentUser.id,
      requestId: selectedBuyerModal.request.id,
      offerIds: myOffers.map((o) => o.id),
      matchType: 'direct',
      buyerId: selectedBuyerModal.buyer.id,
      supplierIds: currentSupplierProfile ? [currentSupplierProfile.id] : [],
      message:
        interestMessage.trim() ||
        `Interés comercial en solicitud de ${selectedBuyerModal.request.product} (${selectedBuyerModal.request.quantity} ${selectedBuyerModal.request.unit}).`,
    });
    setInterestMessage('');
    setSelectedBuyerModal(null);
  };

  return (
    <div className="space-y-5">
      {/* Filtros de búsqueda de compradores */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-[#111814]">
              Buscar compradores y demandas activas
            </h2>
            <p className="text-xs text-[#526058]">
              Explora requerimientos publicados por empresas procesadoras y manifiesta interés comercial.
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-[#526058]">
            {requestItems.length} solicitud(es) encontrada(s)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">Producto</label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#DFE6E0] rounded-lg"
            >
              <option value="all">Todos los productos</option>
              {PRODUCT_CATALOG.map((p) => (
                <option key={p.product} value={p.product}>
                  {p.product}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">Variedad</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#708077] absolute left-3 top-2.5" />
              <input
                type="text"
                value={varietyFilter}
                onChange={(e) => setVarietyFilter(e.target.value)}
                placeholder="Buscar variedad..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-[#DFE6E0] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">
              Ubicación del comprador
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#DFE6E0] rounded-lg"
            >
              <option value="all">Todo el Perú</option>
              {PERU_LOCATIONS.map((r) => (
                <option key={r.department} value={r.department}>
                  {r.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">Calidad requerida</label>
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#DFE6E0] rounded-lg"
            >
              <option value="all">Todas las calidades</option>
              {QUALITY_GRADES.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">
              Modalidad de compra / entrega
            </label>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#DFE6E0] rounded-lg"
            >
              <option value="all">Cualquier modalidad</option>
              {Object.entries(DELIVERY_MODE_LABELS).map(([k, lbl]) => (
                <option key={k} value={k}>
                  {lbl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">
              Cantidad mínima solicitada (t)
            </label>
            <input
              type="number"
              min="0"
              value={minTonsFilter}
              onChange={(e) => setMinTonsFilter(e.target.value)}
              placeholder="Ej. 5"
              className="w-full px-3 py-2 text-xs border border-[#DFE6E0] rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Lista de solicitudes de compradores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requestItems.map(({ request, buyer }) => {
          const reqKg = normalizeToKg(request.quantity, request.unit);
          return (
            <article
              key={request.id}
              className="bg-white border border-[#DFE6E0] rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium text-[#15803D]">{buyer.subsector}</p>
                    <h3 className="text-base font-bold font-display text-[#111814] mt-0.5">
                      {request.product} · {request.variety}
                    </h3>
                  </div>
                  <span className="text-sm font-bold font-mono-tabular text-[#14532D]">
                    {formatKgAsTonsOrKg(reqKg)}
                  </span>
                </div>

                <p className="text-xs font-medium text-[#111814] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#708077]" />
                  <span>{buyer.companyName}</span>
                </p>

                <p className="text-xs text-[#526058] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#708077]" />
                  <span>
                    Recepción: {request.receptionLocation.district},{' '}
                    {request.receptionLocation.department} · Fecha:{' '}
                    <span className="font-mono-tabular">{request.deliveryDate}</span>
                  </span>
                </p>

                <p className="text-xs text-[#526058]">
                  Calidad: <strong className="text-[#111814]">{request.quality}</strong> ·{' '}
                  {request.targetPricePerKg
                    ? `Precio objetivo: S/ ${request.targetPricePerKg.toFixed(2)}/kg`
                    : 'Precio a cotizar'}
                </p>

                <p className="text-xs text-[#708077]">{request.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DFE6E0] flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#708077]">
                  {DELIVERY_MODE_LABELS[request.preferredDeliveryMode]}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedBuyerModal({ buyer, request })}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
                >
                  Ver empresa e interesarse
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal Perfil del Comprador: diferencia datos declarados vs métricas de plataforma */}
      {selectedBuyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto">
          <div className="bg-white border border-[#DFE6E0] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            {(() => {
              const { buyer, request } = selectedBuyerModal;
              const metrics = getBuyerPlatformMetrics(buyer.id);
              return (
                <>
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DFE6E0]">
                    <div>
                      <p className="text-xs font-medium text-[#15803D]">
                        {buyer.subsector} · {buyer.isDemo ? 'Empresa de demostración' : 'Empresa registrada'}
                      </p>
                      <h3 className="text-xl font-bold font-display text-[#111814] mt-0.5">
                        {buyer.companyName}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedBuyerModal(null)}
                      className="p-1.5 text-[#526058] hover:text-[#111814] rounded-lg border border-[#DFE6E0] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-4 text-xs">
                    {/* Bloque 1: Información declarada por la empresa */}
                    <div className="p-4 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0] space-y-3">
                      <p className="text-[11px] font-semibold text-[#14532D]">
                        Información declarada por la empresa
                      </p>
                      <p className="text-xs text-[#526058] leading-relaxed">
                        {buyer.businessDescription}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <p className="text-[#708077]">Ubicación de planta</p>
                          <p className="font-semibold text-[#111814]">
                            {buyer.plantLocation.district}, {buyer.plantLocation.province} (
                            {buyer.plantLocation.department})
                          </p>
                        </div>
                        <div>
                          <p className="text-[#708077]">Años de actividad declarados</p>
                          <p className="font-semibold font-mono-tabular text-[#111814]">
                            {buyer.yearsActive ? `${buyer.yearsActive} años` : 'No declarado'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#708077]">Materias primas utilizadas</p>
                          <p className="font-semibold text-[#111814]">
                            {buyer.requiredProducts.join(', ')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#708077]">Volumen promedio declarado / Frecuencia</p>
                          <p className="font-semibold font-mono-tabular text-[#111814]">
                            {buyer.monthlyAverageVolumeTons
                              ? `${buyer.monthlyAverageVolumeTons} t/mes · ${buyer.sourcingFrequency}`
                              : buyer.sourcingFrequency}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bloque 2: Métricas generadas en AgroConnect */}
                    <div className="p-4 rounded-lg bg-white border border-[#DFE6E0]">
                      <p className="text-[11px] font-semibold text-[#526058] mb-2.5">
                        Indicadores calculados por actividad en AgroConnect (no representa historial de compras reales)
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-[#708077]">Solicitudes publicadas</p>
                          <p className="text-lg font-bold font-mono-tabular text-[#111814]">
                            {metrics.totalPublished}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#708077]">Solicitudes activas</p>
                          <p className="text-lg font-bold font-mono-tabular text-[#15803D]">
                            {metrics.activeCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#708077]">Interacciones registradas</p>
                          <p className="text-lg font-bold font-mono-tabular text-[#14532D]">
                            {metrics.interactionsCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Acción: Manifestar interés sobre la solicitud */}
                    <div className="pt-2 border-t border-[#DFE6E0] space-y-2.5">
                      <p className="text-xs font-semibold text-[#111814]">
                        Manifestar interés en: {request.product} ({request.quantity} {request.unit})
                      </p>
                      <textarea
                        rows={2}
                        value={interestMessage}
                        onChange={(e) => setInterestMessage(e.target.value)}
                        placeholder="Indica volumen disponible de tu lote, ubicación y condiciones de entrega."
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBuyerModal(null)}
                          className="px-4 py-2 text-xs font-semibold text-[#526058] border border-[#DFE6E0] rounded-lg cursor-pointer"
                        >
                          Cerrar
                        </button>
                        <button
                          type="button"
                          onClick={handleSendInterest}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Manifestar interés</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
