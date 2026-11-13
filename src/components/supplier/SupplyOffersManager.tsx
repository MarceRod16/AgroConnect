import React, { useMemo, useState } from 'react';
import { Edit3, PauseCircle, PlayCircle, Plus, X, XCircle } from 'lucide-react';
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
  QualityGrade,
  SupplyOffer,
  UnitOfMeasure,
} from '../../types/agroconnect';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { StatusLabel } from '../common/StatusLabel';

interface SupplyOffersManagerProps {
  openCreateInitially?: boolean;
  onConsumeCreateFlag?: () => void;
}

const SAMPLE_CROP_PHOTOS = [
  { label: 'Tomate industrial', url: '/src/assets/images/crop_tomato_industrial_1794588271950.jpg' },
  { label: 'Mango Kent', url: '/src/assets/images/crop_mango_export_1794588272370.jpg' },
  { label: 'Papa andina', url: '/src/assets/images/crop_potato_andes_1794588273249.jpg' },
  { label: 'Sin fotografía', url: '' },
];

export const SupplyOffersManager: React.FC<SupplyOffersManagerProps> = ({
  openCreateInitially = false,
  onConsumeCreateFlag,
}) => {
  const {
    state,
    currentSupplierProfile,
    createSupplyOffer,
    updateSupplyOffer,
    setSupplyOfferStatus,
    showToast,
  } = useAgroConnect();

  const [statusFilter, setStatusFilter] = useState<'all' | PublicationStatus>('all');
  const [modalOpen, setModalOpen] = useState(openCreateInitially);
  const [editingOffer, setEditingOffer] = useState<SupplyOffer | null>(null);

  const [product, setProduct] = useState(PRODUCT_CATALOG[0].product);
  const [variety, setVariety] = useState('Roma');
  const [availableQuantity, setAvailableQuantity] = useState('4');
  const [unit, setUnit] = useState<UnitOfMeasure>('t');
  const [quality, setQuality] = useState<QualityGrade>('Grado A');
  const [department, setDepartment] = useState(
    currentSupplierProfile?.productionLocation.department ?? 'Lima'
  );
  const [province, setProvince] = useState(
    currentSupplierProfile?.productionLocation.province ?? 'Cañete'
  );
  const [district, setDistrict] = useState(
    currentSupplierProfile?.productionLocation.district ?? 'San Vicente de Cañete'
  );
  const [availableFrom, setAvailableFrom] = useState('2026-11-18');
  const [availableTo, setAvailableTo] = useState('2026-12-20');
  const [pricePerUnit, setPricePerUnit] = useState('1.85');
  const [currency, setCurrency] = useState<CurrencyCode>('PEN');
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [minimumQuantity, setMinimumQuantity] = useState('1000');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('negociable');
  const [additionalFeatures, setAdditionalFeatures] = useState('');
  const [photoUrl, setPhotoUrl] = useState('/src/assets/images/crop_tomato_industrial_1794588271950.jpg');
  const [formError, setFormError] = useState<string | null>(null);

  React.useEffect(() => {
    if (openCreateInitially) {
      openNewModal();
      onConsumeCreateFlag?.();
    }
  }, [openCreateInitially]);

  const myOffers = useMemo(() => {
    const base = currentSupplierProfile
      ? state.offers.filter((o) => o.supplierId === currentSupplierProfile.id)
      : state.offers;
    if (statusFilter === 'all') return base;
    return base.filter((o) => o.status === statusFilter);
  }, [state.offers, currentSupplierProfile, statusFilter]);

  const selectedProductEntry =
    PRODUCT_CATALOG.find((p) => p.product === product) ?? PRODUCT_CATALOG[0];
  const regionEntry = PERU_LOCATIONS.find((r) => r.department === department) ?? PERU_LOCATIONS[0];
  const provinces = Object.keys(regionEntry.provinces);
  const districts = regionEntry.provinces[province] ?? regionEntry.provinces[provinces[0]] ?? [];

  const openNewModal = () => {
    setEditingOffer(null);
    setProduct(PRODUCT_CATALOG[0].product);
    setVariety(PRODUCT_CATALOG[0].varieties[0]);
    setAvailableQuantity('4');
    setUnit('t');
    setQuality('Grado A');
    setDepartment(currentSupplierProfile?.productionLocation.department ?? 'Lima');
    setProvince(currentSupplierProfile?.productionLocation.province ?? 'Cañete');
    setDistrict(currentSupplierProfile?.productionLocation.district ?? 'San Vicente de Cañete');
    setAvailableFrom('2026-11-18');
    setAvailableTo('2026-12-20');
    setPricePerUnit('1.85');
    setCurrency('PEN');
    setPriceNegotiable(true);
    setMinimumQuantity('1000');
    setDeliveryMode('negociable');
    setAdditionalFeatures('');
    setPhotoUrl('/src/assets/images/crop_tomato_industrial_1794588271950.jpg');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (offer: SupplyOffer) => {
    setEditingOffer(offer);
    setProduct(offer.product);
    setVariety(offer.variety);
    setAvailableQuantity(String(offer.availableQuantity));
    setUnit(offer.unit);
    setQuality(offer.quality);
    setDepartment(offer.location.department);
    setProvince(offer.location.province);
    setDistrict(offer.location.district);
    setAvailableFrom(offer.availableFrom);
    setAvailableTo(offer.availableTo);
    setPricePerUnit(offer.pricePerUnit !== undefined ? String(offer.pricePerUnit) : '');
    setCurrency(offer.currency);
    setPriceNegotiable(offer.priceNegotiable);
    setMinimumQuantity(String(offer.minimumQuantity));
    setDeliveryMode(offer.deliveryMode);
    setAdditionalFeatures(offer.additionalFeatures);
    setPhotoUrl(offer.photoUrl ?? '');
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!currentSupplierProfile) {
      setFormError('No se encontró un perfil de proveedor activo.');
      return;
    }
    const qtyNum = Number(availableQuantity);
    if (!qtyNum || qtyNum <= 0) {
      setFormError('La cantidad disponible debe ser mayor a 0.');
      return;
    }
    if (!availableFrom || !availableTo || availableFrom > availableTo) {
      setFormError('Verifica que el rango de fechas de disponibilidad sea válido.');
      return;
    }

    const payload = {
      supplierId: currentSupplierProfile.id,
      product,
      category: selectedProductEntry.category,
      variety,
      availableQuantity: qtyNum,
      unit,
      quality,
      location: {
        country: 'Perú',
        department,
        province,
        district,
      },
      availableFrom,
      availableTo,
      pricePerUnit: pricePerUnit ? Number(pricePerUnit) : undefined,
      currency,
      priceNegotiable,
      minimumQuantity: Number(minimumQuantity) || 500,
      deliveryMode,
      additionalFeatures:
        additionalFeatures.trim() || `Lote agrícola disponible (${quality}, ${variety}).`,
      photoUrl: photoUrl || undefined,
      status: editingOffer?.status ?? ('activa' as PublicationStatus),
    };

    if (editingOffer) {
      updateSupplyOffer(editingOffer.id, payload);
    } else {
      createSupplyOffer(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#DFE6E0] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-[#111814]">
            Mis productos y publicaciones de oferta
          </h2>
          <p className="text-xs text-[#526058] mt-0.5">
            Publica lotes independientes a tu perfil comercial. Se integran automáticamente en Smart Matching.
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
            <span>Publicar oferta</span>
          </button>
        </div>
      </div>

      {myOffers.length === 0 ? (
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-10 text-center">
          <p className="text-sm font-semibold text-[#111814]">No tienes ofertas en este filtro</p>
          <p className="text-xs text-[#526058] mt-1">
            Publica un lote disponible para aparecer en búsquedas y consolidaciones de compradores.
          </p>
          <button
            type="button"
            onClick={openNewModal}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] rounded-lg cursor-pointer"
          >
            Publicar primera oferta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myOffers.map((offer) => {
            const normalizedKg = normalizeToKg(offer.availableQuantity, offer.unit);
            return (
              <div
                key={offer.id}
                className="bg-white border border-[#DFE6E0] rounded-xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {offer.photoUrl && (
                    <div className="h-36 w-full border-b border-[#DFE6E0]">
                      <ImageWithFallback
                        src={offer.photoUrl}
                        alt={`${offer.product} ${offer.variety}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold font-display text-[#111814]">
                        {offer.product} · {offer.variety}
                      </h3>
                      <StatusLabel variant={offer.status} />
                    </div>

                    <p className="text-xs text-[#526058]">
                      Disponible:{' '}
                      <strong className="font-mono-tabular text-[#14532D]">
                        {offer.availableQuantity} {offer.unit} ({formatKgAsTonsOrKg(normalizedKg)})
                      </strong>{' '}
                      · Calidad: <strong className="text-[#111814]">{offer.quality}</strong>
                    </p>

                    <p className="text-xs text-[#526058]">
                      Precio:{' '}
                      <strong className="font-mono-tabular text-[#111814]">
                        {offer.pricePerUnit !== undefined
                          ? `${offer.currency === 'PEN' ? 'S/' : 'USD'} ${offer.pricePerUnit.toFixed(2)} / kg ${offer.priceNegotiable ? '(negociable)' : ''}`
                          : 'Pendiente de confirmar'}
                      </strong>
                    </p>

                    <p className="text-xs text-[#708077]">
                      Origen: {offer.location.district}, {offer.location.province} ({offer.location.department}) ·
                      Ventana: <span className="font-mono-tabular">{offer.availableFrom}</span> a{' '}
                      <span className="font-mono-tabular">{offer.availableTo}</span>
                    </p>

                    <p className="text-xs text-[#708077]">{DELIVERY_MODE_LABELS[offer.deliveryMode]}</p>

                    {offer.additionalFeatures && (
                      <p className="text-xs text-[#526058] pt-1">{offer.additionalFeatures}</p>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 bg-[#F7F9F7] border-t border-[#DFE6E0] flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(offer)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#111814] bg-white border border-[#DFE6E0] rounded-lg cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  {offer.status === 'activa' && (
                    <button
                      type="button"
                      onClick={() => setSupplyOfferStatus(offer.id, 'pausada')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#B45309] bg-white border border-[#DFE6E0] rounded-lg cursor-pointer"
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Pausar</span>
                    </button>
                  )}

                  {offer.status === 'pausada' && (
                    <button
                      type="button"
                      onClick={() => setSupplyOfferStatus(offer.id, 'activa')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#15803D] bg-white border border-[#DFE6E0] rounded-lg cursor-pointer"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Reactivar</span>
                    </button>
                  )}

                  {offer.status !== 'cerrada' && (
                    <button
                      type="button"
                      onClick={() => {
                        setSupplyOfferStatus(offer.id, 'cerrada');
                        showToast('Oferta cerrada.', 'info');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#708077] hover:text-[#DC2626] bg-white border border-[#DFE6E0] rounded-lg cursor-pointer"
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

      {/* Modal Crear / Editar Oferta */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto">
          <div className="bg-white border border-[#DFE6E0] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFE6E0]">
              <h3 className="text-lg font-bold font-display text-[#111814]">
                {editingOffer ? 'Editar publicación de oferta' : 'Publicar nueva oferta agrícola'}
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
                  <label className="block text-xs font-medium text-[#111814] mb-1">Producto *</label>
                  <select
                    value={product}
                    onChange={(e) => {
                      const nextProd = e.target.value;
                      setProduct(nextProd);
                      const entry = PRODUCT_CATALOG.find((p) => p.product === nextProd);
                      if (entry) {
                        setVariety(entry.varieties[0]);
                        if (entry.imageUrl) setPhotoUrl(entry.imageUrl);
                      }
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
                    {selectedProductEntry.varieties
                      .filter((v) => v !== 'Cualquiera')
                      .map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    <option value="Por confirmar">Por confirmar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Cantidad disponible *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={availableQuantity}
                    onChange={(e) => setAvailableQuantity(e.target.value)}
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
                  <label className="block text-xs font-medium text-[#111814] mb-1">Calidad *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Disponible desde *</label>
                  <input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Disponible hasta *</label>
                  <input
                    type="date"
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">
                    Precio por kg (dejar vacío si es por confirmar)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    placeholder="Ej. 1.85"
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
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Cantidad mínima (kg)</label>
                  <input
                    type="number"
                    value={minimumQuantity}
                    onChange={(e) => setMinimumQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Departamento</label>
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
                  <label className="block text-xs font-medium text-[#111814] mb-1">Modalidad de entrega</label>
                  <select
                    value={deliveryMode}
                    onChange={(e) => setDeliveryMode(e.target.value as DeliveryMode)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {Object.entries(DELIVERY_MODE_LABELS).map(([k, lbl]) => (
                      <option key={k} value={k}>
                        {lbl}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Fotografía referencial</label>
                  <select
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                  >
                    {SAMPLE_CROP_PHOTOS.map((p) => (
                      <option key={p.label} value={p.url}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#111814] cursor-pointer">
                <input
                  type="checkbox"
                  checked={priceNegotiable}
                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                />
                <span>Precio negociable según volumen y entrega</span>
              </label>

              <div>
                <label className="block text-xs font-medium text-[#111814] mb-1">Características adicionales</label>
                <textarea
                  rows={2}
                  value={additionalFeatures}
                  onChange={(e) => setAdditionalFeatures(e.target.value)}
                  placeholder="Ej. Calibre, grados Brix, embalaje en jabas de 20 kg"
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
                  {editingOffer ? 'Guardar cambios' : 'Publicar oferta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
