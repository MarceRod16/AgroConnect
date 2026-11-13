import React, { useMemo, useState } from 'react';
import { MapPin, Search, Send, ShieldCheck, Truck, X } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import {
  DELIVERY_MODE_LABELS,
  PERU_LOCATIONS,
  PRODUCT_CATALOG,
  QUALITY_GRADES,
  SUPPLIER_TYPE_LABELS,
} from '../../data/peruCatalog';
import { formatKgAsTonsOrKg, normalizeToKg, unitPriceToPenPerKg } from '../../services/matchingEngine';
import { SupplierProfile } from '../../types/agroconnect';
import { StatusLabel } from '../common/StatusLabel';

interface SupplierExplorerProps {
  preselectedSupplier?: SupplierProfile | null;
  onClearPreselected?: () => void;
}

export const SupplierExplorer: React.FC<SupplierExplorerProps> = ({
  preselectedSupplier = null,
  onClearPreselected,
}) => {
  const {
    state,
    currentUser,
    currentBuyerProfile,
    registerCommercialInterest,
  } = useAgroConnect();

  const [productFilter, setProductFilter] = useState('all');
  const [varietyFilter, setVarietyFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [supplierTypeFilter, setSupplierTypeFilter] = useState('all');
  const [minTonsFilter, setMinTonsFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);

  const [inspectedSupplier, setInspectedSupplier] = useState<SupplierProfile | null>(
    preselectedSupplier
  );
  const [contactMsg, setContactMsg] = useState('');

  React.useEffect(() => {
    if (preselectedSupplier) {
      setInspectedSupplier(preselectedSupplier);
      onClearPreselected?.();
    }
  }, [preselectedSupplier]);

  const supplierCards = useMemo(() => {
    return state.suppliers
      .map((sup) => {
        const activeOffers = state.offers.filter(
          (o) => o.supplierId === sup.id && o.status === 'activa'
        );
        const totalKg = activeOffers.reduce(
          (sum, o) => sum + normalizeToKg(o.availableQuantity, o.unit),
          0
        );
        const pricesPen = activeOffers
          .map((o) => unitPriceToPenPerKg(o.pricePerUnit, o.unit, o.currency))
          .filter((p): p is number => p !== undefined);
        const minOfferPrice = pricesPen.length > 0 ? Math.min(...pricesPen) : sup.estimatedPrice;

        return {
          supplier: sup,
          activeOffers,
          totalKg,
          minPricePen: minOfferPrice,
        };
      })
      .filter(({ supplier, activeOffers, totalKg, minPricePen }) => {
        if (productFilter !== 'all') {
          const matchesProd =
            supplier.cultivatedProducts.includes(productFilter) ||
            activeOffers.some((o) => o.product === productFilter);
          if (!matchesProd) return false;
        }
        if (varietyFilter.trim()) {
          const q = varietyFilter.trim().toLowerCase();
          const matchesVar =
            supplier.varieties.some((v) => v.toLowerCase().includes(q)) ||
            activeOffers.some((o) => o.variety.toLowerCase().includes(q));
          if (!matchesVar) return false;
        }
        if (departmentFilter !== 'all' && supplier.productionLocation.department !== departmentFilter) {
          return false;
        }
        if (qualityFilter !== 'all') {
          const matchesQual =
            supplier.qualityClassification === qualityFilter ||
            activeOffers.some((o) => o.quality === qualityFilter);
          if (!matchesQual) return false;
        }
        if (deliveryFilter !== 'all') {
          const matchesDel =
            supplier.deliveryMode === deliveryFilter ||
            activeOffers.some((o) => o.deliveryMode === deliveryFilter);
          if (!matchesDel) return false;
        }
        if (supplierTypeFilter !== 'all' && supplier.supplierType !== supplierTypeFilter) {
          return false;
        }
        if (minTonsFilter) {
          const minKg = Number(minTonsFilter) * 1000;
          const capKg = Math.max(totalKg, (supplier.marketableAvailabilityTons ?? 0) * 1000);
          if (capKg < minKg) return false;
        }
        if (maxPriceFilter && minPricePen !== undefined) {
          if (minPricePen > Number(maxPriceFilter)) return false;
        }
        if (onlyAvailableNow && activeOffers.length === 0) {
          return false;
        }
        return true;
      });
  }, [
    state.suppliers,
    state.offers,
    productFilter,
    varietyFilter,
    departmentFilter,
    qualityFilter,
    deliveryFilter,
    supplierTypeFilter,
    minTonsFilter,
    maxPriceFilter,
    onlyAvailableNow,
  ]);

  const handleRequestContact = (sup: SupplierProfile) => {
    if (!currentUser) return;
    const activeReq = state.requests.find(
      (r) => r.buyerId === currentBuyerProfile?.id && r.status === 'activa'
    );
    const supOffers = state.offers.filter(
      (o) => o.supplierId === sup.id && o.status === 'activa'
    );
    registerCommercialInterest({
      initiatedByRole: 'buyer',
      initiatorUserId: currentUser.id,
      requestId: activeReq?.id ?? 'exploracion_directa',
      offerIds: supOffers.map((o) => o.id),
      matchType: 'direct',
      buyerId: currentBuyerProfile?.id ?? currentUser.id,
      supplierIds: [sup.id],
      message:
        contactMsg.trim() ||
        `Solicitud de contacto comercial con ${sup.organizationName}.`,
    });
    setContactMsg('');
    setInspectedSupplier(null);
  };

  return (
    <div className="space-y-5">
      {/* Barra de filtros avanzados */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-[#111814]">
              Exploración de proveedores agrícolas
            </h2>
            <p className="text-xs text-[#526058]">
              Filtra productores, asociaciones, cooperativas y acopiadores por capacidad, calidad y logística.
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-[#526058]">
            {supplierCards.length} proveedor(es) encontrado(s)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                placeholder="Ej. Roma, Kent, Yungay..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-[#DFE6E0] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">Ubicación</label>
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
            <label className="block text-[11px] font-medium text-[#526058] mb-1">Tipo de proveedor</label>
            <select
              value={supplierTypeFilter}
              onChange={(e) => setSupplierTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#DFE6E0] rounded-lg"
            >
              <option value="all">Todos los tipos</option>
              {Object.entries(SUPPLIER_TYPE_LABELS).map(([k, lbl]) => (
                <option key={k} value={k}>
                  {lbl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">Calidad</label>
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
            <label className="block text-[11px] font-medium text-[#526058] mb-1">Modalidad de entrega</label>
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
              Capacidad mínima (t)
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={minTonsFilter}
              onChange={(e) => setMinTonsFilter(e.target.value)}
              placeholder="Ej. 3"
              className="w-full px-3 py-2 text-xs border border-[#DFE6E0] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#526058] mb-1">
              Precio máx. estimado (S/ kg)
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(e.target.value)}
              placeholder="Ej. 2.00"
              className="w-full px-3 py-2 text-xs border border-[#DFE6E0] rounded-lg"
            />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#DFE6E0] flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-[#111814] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailableNow}
              onChange={(e) => setOnlyAvailableNow(e.target.checked)}
            />
            <span>Mostrar solo proveedores con lotes activos publicados</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setProductFilter('all');
              setVarietyFilter('');
              setDepartmentFilter('all');
              setQualityFilter('all');
              setDeliveryFilter('all');
              setSupplierTypeFilter('all');
              setMinTonsFilter('');
              setMaxPriceFilter('');
              setOnlyAvailableNow(false);
            }}
            className="text-xs font-medium text-[#14532D] hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {/* Grid de resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {supplierCards.map(({ supplier, activeOffers, totalKg, minPricePen }) => (
          <article
            key={supplier.id}
            className="bg-white border border-[#DFE6E0] rounded-xl p-5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-medium text-[#526058]">
                    {SUPPLIER_TYPE_LABELS[supplier.supplierType]}
                  </p>
                  <h3 className="text-base font-bold font-display text-[#111814] mt-0.5">
                    {supplier.organizationName}
                  </h3>
                </div>
              </div>

              <StatusLabel variant={supplier.validationStatus} />

              <p className="text-xs text-[#526058] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#708077] shrink-0" />
                <span>
                  {supplier.productionLocation.district}, {supplier.productionLocation.province} (
                  {supplier.productionLocation.department})
                </span>
              </p>

              <div className="pt-2 border-t border-[#DFE6E0] text-xs space-y-1">
                <p className="text-[#526058]">
                  Productos:{' '}
                  <strong className="text-[#111814]">
                    {supplier.cultivatedProducts.join(', ')}
                  </strong>
                </p>
                <p className="text-[#526058]">
                  Variedades: <span className="text-[#111814]">{supplier.varieties.join(', ')}</span>
                </p>
                <p className="text-[#526058]">
                  Capacidad publicada:{' '}
                  <strong className="font-mono-tabular text-[#14532D]">
                    {totalKg > 0
                      ? `${formatKgAsTonsOrKg(totalKg)} (${activeOffers.length} lote/s)`
                      : `${supplier.marketableAvailabilityTons ?? 0} t declaradas`}
                  </strong>
                </p>
                <p className="text-[#526058]">
                  Precio estimado:{' '}
                  <span className="font-mono-tabular text-[#111814]">
                    {minPricePen !== undefined
                      ? `Desde S/ ${minPricePen.toFixed(2)}/kg`
                      : 'Por confirmar'}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#DFE6E0] flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#708077]">
                {supplier.hasOwnTransport ? 'Transporte propio' : 'Entrega coordinable'}
              </span>
              <button
                type="button"
                onClick={() => setInspectedSupplier(supplier)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
              >
                Ver perfil y contactar
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de Perfil del Proveedor (sin exponer DNI/RUC/teléfono privado) */}
      {inspectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto">
          <div className="bg-white border border-[#DFE6E0] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DFE6E0]">
              <div>
                <p className="text-xs font-medium text-[#526058]">
                  {SUPPLIER_TYPE_LABELS[inspectedSupplier.supplierType]} ·{' '}
                  {inspectedSupplier.isDemo ? 'Perfil de demostración' : 'Perfil registrado'}
                </p>
                <h3 className="text-xl font-bold font-display text-[#111814] mt-0.5">
                  {inspectedSupplier.organizationName}
                </h3>
                <div className="mt-1">
                  <StatusLabel variant={inspectedSupplier.validationStatus} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedSupplier(null)}
                className="p-1.5 text-[#526058] hover:text-[#111814] rounded-lg border border-[#DFE6E0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <p className="text-sm text-[#526058] leading-relaxed">
                {inspectedSupplier.businessDescription}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <div>
                  <p className="text-[#708077]">Ubicación productiva</p>
                  <p className="font-semibold text-[#111814] mt-0.5">
                    {inspectedSupplier.productionLocation.district},{' '}
                    {inspectedSupplier.productionLocation.province} (
                    {inspectedSupplier.productionLocation.department})
                  </p>
                </div>
                <div>
                  <p className="text-[#708077]">Productos y variedades</p>
                  <p className="font-semibold text-[#111814] mt-0.5">
                    {inspectedSupplier.cultivatedProducts.join(', ')} ·{' '}
                    {inspectedSupplier.varieties.join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-[#708077]">Temporada y capacidad</p>
                  <p className="font-semibold text-[#111814] mt-0.5">
                    {inspectedSupplier.harvestSeason} ·{' '}
                    <span className="font-mono-tabular">
                      {inspectedSupplier.marketableAvailabilityTons ?? 'Por confirmar'} t disp.
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[#708077]">Calidad y certificaciones</p>
                  <p className="font-semibold text-[#111814] mt-0.5 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                    <span>
                      {inspectedSupplier.qualityClassification}
                      {inspectedSupplier.certifications.length > 0
                        ? ` · ${inspectedSupplier.certifications.join(', ')}`
                        : ''}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[#708077]">Condiciones logísticas</p>
                  <p className="font-semibold text-[#111814] mt-0.5 inline-flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#14532D]" />
                    <span>
                      {DELIVERY_MODE_LABELS[inspectedSupplier.deliveryMode]} ·{' '}
                      {inspectedSupplier.hasOwnTransport ? 'Transporte propio' : 'Sin transporte propio'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[#708077]">Precio estimado</p>
                  <p className="font-semibold font-mono-tabular text-[#111814] mt-0.5">
                    {inspectedSupplier.estimatedPrice
                      ? `${inspectedSupplier.currency === 'PEN' ? 'S/' : 'USD'} ${inspectedSupplier.estimatedPrice.toFixed(2)}/${inspectedSupplier.commercialUnit}`
                      : 'Pendiente de confirmación'}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#708077]">
                Por seguridad, los documentos de identidad (DNI/RUC) y teléfonos personales permanecen
                ocultos. El contacto se gestiona a través de la plataforma.
              </p>

              <div className="pt-3 border-t border-[#DFE6E0] space-y-2.5">
                <label className="block text-xs font-semibold text-[#111814]">
                  Solicitar contacto con este proveedor
                </label>
                <textarea
                  rows={2}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Indica volumen estimado, fecha objetivo o consulta sobre disponibilidad."
                  className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectedSupplier(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#526058] border border-[#DFE6E0] rounded-lg cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRequestContact(inspectedSupplier)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Solicitar contacto</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
