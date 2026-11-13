import React, { useMemo, useState } from 'react';
import { Edit3, GitMerge, PauseCircle, PlayCircle, Plus, X, XCircle } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import {
  DELIVERY_MODE_LABELS,
  PERU_LOCATIONS,
  PRODUCT_CATALOG,
  QUALITY_GRADES,
  UNIT_LABELS,
} from '../../data/peruCatalog';
import { formatKgAsTonsOrKg, normalizeToKg } from '../../services/matchingEngine';
import {
  CurrencyCode,
  DeliveryMode,
  PublicationStatus,
  PurchaseRequest,
  QualityGrade,
  UnitOfMeasure,
} from '../../types/agroconnect';
import { StatusLabel } from '../common/StatusLabel';

interface PurchaseRequestsManagerProps {
  openCreateInitially?: boolean;
  onConsumeCreateFlag?: () => void;
  onOpenMatchingForRequest: (requestId: string) => void;
}

export const PurchaseRequestsManager: React.FC<PurchaseRequestsManagerProps> = ({
  openCreateInitially = false,
  onConsumeCreateFlag,
  onOpenMatchingForRequest,
}) => {
  const {
    state,
    currentBuyerProfile,
    allMatches,
    createPurchaseRequest,
    updatePurchaseRequest,
    setPurchaseRequestStatus,
    showToast,
  } = useAgroConnect();

  const [statusFilter, setStatusFilter] = useState<'all' | PublicationStatus>('all');
  const [modalOpen, setModalOpen] = useState(openCreateInitially);
  const [editingRequest, setEditingRequest] = useState<PurchaseRequest | null>(null);

  // Form states
  const [product, setProduct] = useState(PRODUCT_CATALOG[0].product);
  const [variety, setVariety] = useState('Roma');
  const [varietyMandatory, setVarietyMandatory] = useState(false);
  const [quantity, setQuantity] = useState('10');
  const [unit, setUnit] = useState<UnitOfMeasure>('t');
  const [quality, setQuality] = useState<QualityGrade>('Grado A');
  const [deliveryDate, setDeliveryDate] = useState('2026-12-05');
  const [department, setDepartment] = useState(currentBuyerProfile?.plantLocation.department ?? 'Lima');
  const [province, setProvince] = useState(currentBuyerProfile?.plantLocation.province ?? 'Lima');
  const [district, setDistrict] = useState(currentBuyerProfile?.plantLocation.district ?? 'Ate');
  const [targetPrice, setTargetPrice] = useState('1.90');
  const [currency, setCurrency] = useState<CurrencyCode>('PEN');
  const [preferredDeliveryMode, setPreferredDeliveryMode] = useState<DeliveryMode>('en_destino');
  const [requiresColdChain, setRequiresColdChain] = useState(false);
  const [logisticsConditions, setLogisticsConditions] = useState(
    'Recepción en planta en jabas o sacos limpios.'
  );
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    if (openCreateInitially) {
      openNewModal();
      onConsumeCreateFlag?.();
    }
  }, [openCreateInitially]);

  const myRequests = useMemo(() => {
    const base = currentBuyerProfile
      ? state.requests.filter((r) => r.buyerId === currentBuyerProfile.id)
      : state.requests;
    if (statusFilter === 'all') return base;
    return base.filter((r) => r.status === statusFilter);
  }, [state.requests, currentBuyerProfile, statusFilter]);

  const selectedProductEntry =
    PRODUCT_CATALOG.find((p) => p.product === product) ?? PRODUCT_CATALOG[0];
  const regionEntry = PERU_LOCATIONS.find((r) => r.department === department) ?? PERU_LOCATIONS[0];
  const provinces = Object.keys(regionEntry.provinces);
  const districts = regionEntry.provinces[province] ?? regionEntry.provinces[provinces[0]] ?? [];

  const openNewModal = () => {
    setEditingRequest(null);
    setProduct(PRODUCT_CATALOG[0].product);
    setVariety(PRODUCT_CATALOG[0].varieties[0]);
    setVarietyMandatory(false);
    setQuantity('10');
    setUnit('t');
    setQuality('Grado A');
    setDeliveryDate('2026-12-05');
    setDepartment(currentBuyerProfile?.plantLocation.department ?? 'Lima');
    setProvince(currentBuyerProfile?.plantLocation.province ?? 'Lima');
    setDistrict(currentBuyerProfile?.plantLocation.district ?? 'Ate');
    setTargetPrice('1.90');
    setCurrency('PEN');
    setPreferredDeliveryMode('en_destino');
    setRequiresColdChain(false);
    setLogisticsConditions('Recepción en planta en jabas o sacos limpios.');
    setDescription('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (req: PurchaseRequest) => {
    setEditingRequest(req);
    setProduct(req.product);
    setVariety(req.variety);
    setVarietyMandatory(req.varietyMandatory);
    setQuantity(String(req.quantity));
    setUnit(req.unit);
    setQuality(req.quality);
    setDeliveryDate(req.deliveryDate);
    setDepartment(req.receptionLocation.department);
    setProvince(req.receptionLocation.province);
    setDistrict(req.receptionLocation.district);
    setTargetPrice(req.targetPricePerKg ? String(req.targetPricePerKg) : '');
    setCurrency(req.currency);
    setPreferredDeliveryMode(req.preferredDeliveryMode);
    setRequiresColdChain(Boolean(req.requiresColdChain));
    setLogisticsConditions(req.logisticsConditions);
    setDescription(req.description);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!currentBuyerProfile) {
      setFormError('No se encontró un perfil de comprador activo.');
      return;
    }
    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum <= 0) {
      setFormError('La cantidad requerida debe ser mayor a 0.');
      return;
    }
    if (!deliveryDate) {
      setFormError('Selecciona una fecha objetivo de entrega.');
      return;
    }

    const payload = {
      buyerId: currentBuyerProfile.id,
      product,
      category: selectedProductEntry.category,
      variety,
      varietyMandatory,
      quantity: qtyNum,
      unit,
      quality,
      deliveryDate,
      receptionLocation: {
        country: 'Perú',
        department,
        province,
        district,
      },
      targetPricePerKg: targetPrice ? Number(targetPrice) : undefined,
      currency,
      logisticsConditions: logisticsConditions.trim() || 'Por coordinar con proveedor.',
      preferredDeliveryMode,
      requiresColdChain,
      description: description.trim() || `Requerimiento de ${product} (${quality}).`,
      status: editingRequest?.status ?? ('activa' as PublicationStatus),
    };

    if (editingRequest) {
      updatePurchaseRequest(editingRequest.id, payload);
    } else {
      createPurchaseRequest(payload);
    }
    setModalOpen(false);
  };

  const countMatchesForRequest = (reqId: string) => {
    const matches = allMatches.filter((m) => m.request.id === reqId);
    const hasConsolidated = matches.some((m) => m.type === 'consolidated');
    return { total: matches.length, hasConsolidated };
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#DFE6E0] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-[#111814]">
            Mis solicitudes de compra
          </h2>
          <p className="text-xs text-[#526058] mt-0.5">
            Cada solicitud activa alimenta en tiempo real el motor de Smart Matching y consolidación.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#EFF4F0] rounded-lg">
            {(['all', 'activa', 'pausada', 'cerrada'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize cursor-pointer ${
                  statusFilter === st ? 'bg-white text-[#111814] shadow-xs' : 'text-[#526058]'
                }`}
              >
                {st === 'all' ? 'Todas' : st}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openNewModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear solicitud</span>
          </button>
        </div>
      </div>

      {myRequests.length === 0 ? (
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-10 text-center">
          <p className="text-sm font-semibold text-[#111814]">
            Aún no tienes solicitudes en este estado
          </p>
          <p className="text-xs text-[#526058] mt-1">
            Publica una necesidad de materia prima para encontrar proveedores compatibles o consolidaciones.
          </p>
          <button
            type="button"
            onClick={openNewModal}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] rounded-lg cursor-pointer"
          >
            Publicar primera solicitud
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myRequests.map((req) => {
            const matchInfo = countMatchesForRequest(req.id);
            const normalizedKg = normalizeToKg(req.quantity, req.unit);

            return (
              <div
                key={req.id}
                className="bg-white border border-[#DFE6E0] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-bold font-display text-[#111814]">
                      {req.product} · {req.variety}
                    </h3>
                    <StatusLabel variant={req.status} />
                    {req.isDemo && (
                      <span className="text-[11px] text-[#708077]">· Registro demo</span>
                    )}
                  </div>

                  <p className="text-xs text-[#526058]">
                    Cantidad:{' '}
                    <strong className="font-mono-tabular text-[#111814]">
                      {req.quantity} {req.unit} ({formatKgAsTonsOrKg(normalizedKg)})
                    </strong>{' '}
                    · Calidad: <strong className="text-[#111814]">{req.quality}</strong> · Entrega:{' '}
                    <span className="font-mono-tabular">{req.deliveryDate}</span> · Recepción:{' '}
                    {req.receptionLocation.district}, {req.receptionLocation.department}
                  </p>

                  <p className="text-xs text-[#708077]">
                    {req.targetPricePerKg
                      ? `Precio objetivo: ${req.currency === 'PEN' ? 'S/' : 'USD'} ${req.targetPricePerKg.toFixed(2)}/kg · `
                      : 'Precio objetivo: Por cotizar · '}
                    {DELIVERY_MODE_LABELS[req.preferredDeliveryMode]}
                  </p>

                  {req.description && (
                    <p className="text-xs text-[#526058] pt-1 max-w-3xl">{req.description}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {req.status === 'activa' && (
                    <button
                      type="button"
                      onClick={() => onOpenMatchingForRequest(req.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                        matchInfo.hasConsolidated
                          ? 'bg-[#FEF3C7]/60 border-[#D97706]/50 text-[#92400E]'
                          : 'bg-[#EFF4F0] border-[#DFE6E0] text-[#14532D]'
                      }`}
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>
                        {matchInfo.total > 0
                          ? `Ver ${matchInfo.total} oportunidad(es)`
                          : 'Revisar matching'}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openEditModal(req)}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#526058] hover:text-[#111814] border border-[#DFE6E0] rounded-lg cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  {req.status === 'activa' && (
                    <button
                      type="button"
                      onClick={() => setPurchaseRequestStatus(req.id, 'pausada')}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#B45309] border border-[#DFE6E0] hover:bg-[#FEF3C7]/30 rounded-lg cursor-pointer"
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Pausar</span>
                    </button>
                  )}

                  {req.status === 'pausada' && (
                    <button
                      type="button"
                      onClick={() => setPurchaseRequestStatus(req.id, 'activa')}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#15803D] border border-[#DFE6E0] hover:bg-[#EFF4F0] rounded-lg cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Reactivar</span>
                    </button>
                  )}

                  {req.status !== 'cerrada' && (
                    <button
                      type="button"
                      onClick={() => {
                        setPurchaseRequestStatus(req.id, 'cerrada');
                        showToast('Solicitud marcada como cerrada.', 'info');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#708077] hover:text-[#DC2626] border border-[#DFE6E0] rounded-lg cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cerrar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Solicitud */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto">
          <div className="bg-white border border-[#DFE6E0] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFE6E0]">
              <h3 className="text-lg font-bold font-display text-[#111814]">
                {editingRequest ? 'Editar solicitud de compra' : 'Nueva solicitud de compra'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#526058] hover:text-[#111814] rounded-lg border border-[#DFE6E0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Producto agrícola *</label>
                  <select
                    value={product}
                    onChange={(e) => {
                      const nextProd = e.target.value;
                      setProduct(nextProd);
                      const entry = PRODUCT_CATALOG.find((p) => p.product === nextProd);
                      if (entry) setVariety(entry.varieties[0]);
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {PRODUCT_CATALOG.map((p) => (
                      <option key={p.product} value={p.product}>
                        {p.product} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Variedad</label>
                  <select
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {selectedProductEntry.varieties.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <label className="mt-1.5 flex items-center gap-2 text-[11px] text-[#526058] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={varietyMandatory}
                      onChange={(e) => setVarietyMandatory(e.target.checked)}
                    />
                    <span>Exigir exactamente esta variedad en el matching</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Cantidad *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Unidad *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitOfMeasure)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {Object.entries(UNIT_LABELS).map(([k, lbl]) => (
                      <option key={k} value={k}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Calidad requerida *</label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as QualityGrade)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {QUALITY_GRADES.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Fecha límite entrega *</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">
                    Precio objetivo / kg (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="Ej. 1.90"
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Moneda</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    <option value="PEN">Soles (PEN)</option>
                    <option value="USD">Dólares (USD)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Departamento recepción</label>
                  <select
                    value={department}
                    onChange={(e) => {
                      const d = e.target.value;
                      setDepartment(d);
                      const reg = PERU_LOCATIONS.find((r) => r.department === d);
                      if (reg) {
                        const fp = Object.keys(reg.provinces)[0];
                        setProvince(fp);
                        setDistrict(reg.provinces[fp][0] ?? '');
                      }
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {PERU_LOCATIONS.map((r) => (
                      <option key={r.department} value={r.department}>
                        {r.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Provincia</label>
                  <select
                    value={province}
                    onChange={(e) => {
                      const p = e.target.value;
                      setProvince(p);
                      setDistrict(regionEntry.provinces[p]?.[0] ?? '');
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Distrito</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">
                    Modalidad de entrega preferida
                  </label>
                  <select
                    value={preferredDeliveryMode}
                    onChange={(e) => setPreferredDeliveryMode(e.target.value as DeliveryMode)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {Object.entries(DELIVERY_MODE_LABELS).map(([k, lbl]) => (
                      <option key={k} value={k}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs text-[#111814] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requiresColdChain}
                      onChange={(e) => setRequiresColdChain(e.target.checked)}
                    />
                    <span>Requiere cadena de frío en traslado</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111814] mb-1">Condiciones logísticas</label>
                <input
                  type="text"
                  value={logisticsConditions}
                  onChange={(e) => setLogisticsConditions(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111814] mb-1">Descripción adicional</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Especificaciones técnicas, embalaje o frecuencia requerida"
                  className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-[#DFE6E0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#526058] border border-[#DFE6E0] rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
                >
                  {editingRequest ? 'Guardar cambios' : 'Publicar solicitud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
