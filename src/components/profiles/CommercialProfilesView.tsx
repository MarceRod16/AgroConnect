import React from 'react';
import { Building2, CheckCircle2, MapPin, ShieldCheck, Sprout } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { DELIVERY_MODE_LABELS, SUPPLIER_TYPE_LABELS } from '../../data/peruCatalog';
import { formatKgAsTonsOrKg, normalizeToKg } from '../../services/matchingEngine';
import { StatusLabel } from '../common/StatusLabel';

export const CommercialProfilesView: React.FC = () => {
  const {
    state,
    activeRole,
    currentUser,
    currentBuyerProfile,
    currentSupplierProfile,
    allMatches,
    updateInterestStatus,
  } = useAgroConnect();

  const buyerStats = currentBuyerProfile
    ? {
        activeRequests: state.requests.filter(
          (r) => r.buyerId === currentBuyerProfile.id && r.status === 'activa'
        ).length,
        totalRequests: state.requests.filter((r) => r.buyerId === currentBuyerProfile.id).length,
        matchesFound: allMatches.filter((m) => m.buyer.id === currentBuyerProfile.id).length,
        interestsCount: state.interests.filter((i) => i.buyerId === currentBuyerProfile.id).length,
      }
    : null;

  const supplierStats = currentSupplierProfile
    ? {
        activeOffers: state.offers.filter(
          (o) => o.supplierId === currentSupplierProfile.id && o.status === 'activa'
        ).length,
        publishedKg: state.offers
          .filter((o) => o.supplierId === currentSupplierProfile.id && o.status === 'activa')
          .reduce((s, o) => s + normalizeToKg(o.availableQuantity, o.unit), 0),
        opportunitiesCount: allMatches.filter((m) =>
          m.contributions.some((c) => c.supplier.id === currentSupplierProfile.id)
        ).length,
        interestsCount: state.interests.filter((i) =>
          i.supplierIds.includes(currentSupplierProfile.id)
        ).length,
      }
    : null;

  const relevantInterests = state.interests.filter((i) => {
    if (activeRole === 'buyer' && currentBuyerProfile) {
      return i.buyerId === currentBuyerProfile.id || i.initiatorUserId === currentUser?.id;
    }
    if (activeRole === 'supplier' && currentSupplierProfile) {
      return (
        i.supplierIds.includes(currentSupplierProfile.id) ||
        i.initiatorUserId === currentUser?.id
      );
    }
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6">
        <h2 className="text-lg font-bold font-display text-[#111814]">
          Perfil comercial público y trazabilidad de contactos
        </h2>
        <p className="text-xs text-[#526058] mt-1">
          Vista pública visible para otros usuarios de AgroConnect. Datos sensibles como DNI, RUC y
          teléfono personal se mantienen ocultos.
        </p>
      </div>

      {/* Perfil según rol activo */}
      {activeRole === 'buyer' && currentBuyerProfile && buyerStats && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white border border-[#DFE6E0] rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DFE6E0]">
              <div>
                <p className="text-xs font-semibold text-[#15803D] inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Información declarada por el comprador</span>
                </p>
                <h3 className="text-xl font-bold font-display text-[#111814] mt-1">
                  {currentBuyerProfile.companyName}
                </h3>
                <p className="text-xs text-[#526058] mt-0.5">{currentBuyerProfile.subsector}</p>
              </div>
              {currentUser && (
                <StatusLabel variant={currentUser.identification.validationStatus} />
              )}
            </div>

            <p className="text-sm text-[#526058] leading-relaxed">
              {currentBuyerProfile.businessDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <p className="text-[#708077]">Ubicación de planta</p>
                <p className="font-semibold text-[#111814] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#708077]" />
                  <span>
                    {currentBuyerProfile.plantLocation.district},{' '}
                    {currentBuyerProfile.plantLocation.province} (
                    {currentBuyerProfile.plantLocation.department})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[#708077]">Volumen promedio mensual declarado</p>
                <p className="font-semibold font-mono-tabular text-[#111814] mt-0.5">
                  {currentBuyerProfile.monthlyAverageVolumeTons
                    ? `${currentBuyerProfile.monthlyAverageVolumeTons} t/mes · ${currentBuyerProfile.sourcingFrequency}`
                    : currentBuyerProfile.sourcingFrequency}
                </p>
              </div>
              <div>
                <p className="text-[#708077]">Materias primas demandadas</p>
                <p className="font-semibold text-[#111814] mt-0.5">
                  {currentBuyerProfile.requiredProducts.join(', ')}
                </p>
              </div>
              <div>
                <p className="text-[#708077]">Calidad y variedades preferidas</p>
                <p className="font-semibold text-[#111814] mt-0.5">
                  {currentBuyerProfile.requiredQuality} ·{' '}
                  {currentBuyerProfile.preferredVarieties.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#DFE6E0] rounded-xl p-6 space-y-4">
            <div className="pb-3 border-b border-[#DFE6E0]">
              <p className="text-xs font-semibold text-[#526058]">
                Indicadores calculados por AgroConnect
              </p>
              <p className="text-[11px] text-[#708077] mt-0.5">
                Basados únicamente en publicaciones e interacciones dentro del prototipo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <p className="text-xs text-[#526058]">Solicitudes activas</p>
                <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mt-1">
                  {buyerStats.activeRequests}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <p className="text-xs text-[#526058]">Solicitudes totales</p>
                <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
                  {buyerStats.totalRequests}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <p className="text-xs text-[#526058]">Matches disponibles</p>
                <p className="text-2xl font-bold font-mono-tabular text-[#B45309] mt-1">
                  {buyerStats.matchesFound}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <p className="text-xs text-[#526058]">Contactos registrados</p>
                <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
                  {buyerStats.interestsCount}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeRole === 'supplier' && currentSupplierProfile && supplierStats && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white border border-[#DFE6E0] rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#DFE6E0]">
              <div>
                <p className="text-xs font-semibold text-[#15803D] inline-flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>
                    Información declarada ·{' '}
                    {SUPPLIER_TYPE_LABELS[currentSupplierProfile.supplierType]}
                  </span>
                </p>
                <h3 className="text-xl font-bold font-display text-[#111814] mt-1">
                  {currentSupplierProfile.organizationName}
                </h3>
              </div>
              <StatusLabel variant={currentSupplierProfile.validationStatus} />
            </div>

            <p className="text-sm text-[#526058] leading-relaxed">
              {currentSupplierProfile.businessDescription}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <p className="text-[#708077]">Ubicación productiva</p>
                <p className="font-semibold text-[#111814] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#708077]" />
                  <span>
                    {currentSupplierProfile.productionLocation.district},{' '}
                    {currentSupplierProfile.productionLocation.province} (
                    {currentSupplierProfile.productionLocation.department})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[#708077]">Años de actividad declarados</p>
                <p className="font-semibold font-mono-tabular text-[#111814] mt-0.5">
                  {currentSupplierProfile.yearsActive
                    ? `${currentSupplierProfile.yearsActive} años`
                    : 'No declarado'}
                </p>
              </div>
              <div>
                <p className="text-[#708077]">Productos principales</p>
                <p className="font-semibold text-[#111814] mt-0.5">
                  {currentSupplierProfile.cultivatedProducts.join(', ')} (
                  {currentSupplierProfile.varieties.join(', ')})
                </p>
              </div>
              <div>
                <p className="text-[#708077]">Capacidad productiva y entrega</p>
                <p className="font-semibold text-[#111814] mt-0.5">
                  {currentSupplierProfile.marketableAvailabilityTons ?? 'Por confirmar'} t disp. ·{' '}
                  {DELIVERY_MODE_LABELS[currentSupplierProfile.deliveryMode]}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#DFE6E0] rounded-xl p-6 space-y-4">
            <div className="pb-3 border-b border-[#DFE6E0]">
              <p className="text-xs font-semibold text-[#526058]">
                Indicadores calculados por AgroConnect
              </p>
              <p className="text-[11px] text-[#708077] mt-0.5">
                Calculados a partir de lotes publicados y oportunidades detectadas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <p className="text-xs text-[#526058]">Ofertas activas</p>
                <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mt-1">
                  {supplierStats.activeOffers}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <p className="text-xs text-[#526058]">Volumen activo</p>
                <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
                  {formatKgAsTonsOrKg(supplierStats.publishedKg)}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <p className="text-xs text-[#526058]">Oportunidades Smart</p>
                <p className="text-2xl font-bold font-mono-tabular text-[#B45309] mt-1">
                  {supplierStats.opportunitiesCount}
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F7F9F7] border border-[#DFE6E0]">
                <p className="text-xs text-[#526058]">Intereses recibidos/env.</p>
                <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
                  {supplierStats.interestsCount}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Historial de contactos e intereses comerciales */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#DFE6E0]">
          <div>
            <h3 className="text-base font-bold font-display text-[#111814]">
              Solicitudes de contacto e intereses comerciales
            </h3>
            <p className="text-xs text-[#526058]">
              Registro de intenciones de contacto generadas desde Smart Matching o exploradores.
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-[#526058]">
            {relevantInterests.length} registro(s)
          </span>
        </div>

        {relevantInterests.length === 0 ? (
          <p className="py-6 text-center text-xs text-[#526058]">
            Aún no hay solicitudes de contacto registradas para este perfil.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {relevantInterests.map((interest) => {
              const req = state.requests.find((r) => r.id === interest.requestId);
              const buyer = state.buyers.find((b) => b.id === interest.buyerId);
              const sups = state.suppliers.filter((s) => interest.supplierIds.includes(s.id));

              return (
                <div
                  key={interest.id}
                  className="p-4 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7] flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#111814]">
                        {req ? `${req.product} (${req.quantity} ${req.unit})` : 'Contacto directo'}
                      </span>
                      <span className="text-[#708077]">·</span>
                      <span className="text-[#526058]">
                        {interest.matchType === 'consolidated' ? 'Consolidación' : 'Directo'}
                      </span>
                      <span className="text-[#708077]">·</span>
                      <span className="font-mono-tabular text-[#708077]">
                        {interest.createdAt.slice(0, 10)}
                      </span>
                    </div>
                    <p className="text-[#526058]">
                      Comprador: <strong className="text-[#111814]">{buyer?.companyName ?? 'N/A'}</strong>{' '}
                      → Proveedor(es):{' '}
                      <strong className="text-[#111814]">
                        {sups.map((s) => s.organizationName).join(', ') || 'N/A'}
                      </strong>
                    </p>
                    <p className="text-[#526058] italic">"{interest.message}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={interest.status}
                      onChange={(e) =>
                        updateInterestStatus(
                          interest.id,
                          e.target.value as typeof interest.status
                        )
                      }
                      className="px-3 py-1.5 text-xs bg-white border border-[#DFE6E0] rounded-lg font-medium text-[#111814]"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_revision">En revisión</option>
                      <option value="contactado">Contactado</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
