import React, { useState } from 'react';
import { Calendar, CheckCircle2, MapPin, Users, X } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { SUPPLIER_TYPE_LABELS } from '../../data/peruCatalog';
import { formatKgAsTonsOrKg, normalizeToKg } from '../../services/matchingEngine';
import { TradeEvent } from '../../types/agroconnect';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const EventsView: React.FC = () => {
  const {
    state,
    activeRole,
    currentUser,
    currentBuyerProfile,
    currentSupplierProfile,
    registerForEvent,
  } = useAgroConnect();

  const [selectedEvent, setSelectedEvent] = useState<TradeEvent | null>(null);
  const [productsFocus, setProductsFocus] = useState('');
  const [notes, setNotes] = useState('');

  const isRegistered = (eventId: string) =>
    state.eventRegistrations.some(
      (r) => r.eventId === eventId && r.userId === currentUser?.id
    );

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !currentUser) return;
    const orgName =
      activeRole === 'buyer'
        ? currentBuyerProfile?.companyName ?? currentUser.identification.tradeName
        : currentSupplierProfile?.organizationName ?? currentUser.identification.tradeName;

    registerForEvent({
      eventId: selectedEvent.id,
      userId: currentUser.id,
      role: activeRole,
      organizationName: orgName,
      productsFocus:
        productsFocus.trim() || selectedEvent.productsOfInterest.slice(0, 2).join(', '),
      notes: notes.trim() || 'Inscripción desde plataforma AgroConnect.',
    });
    setProductsFocus('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Banner superior */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 flex flex-col justify-center">
          <p className="text-xs font-semibold text-[#15803D] mb-1">
            Módulo complementario · Encuentros B2B
          </p>
          <h2 className="text-xl font-bold font-display text-[#111814] tracking-tight">
            Eventos comerciales y ruedas de abastecimiento agrícola
          </h2>
          <p className="text-xs text-[#526058] mt-2 leading-relaxed max-w-xl">
            Directorio de demostración para conectar presencial o virtualmente a plantas
            procesadoras con cooperativas, asociaciones y centros de acopio del Perú.
          </p>
        </div>
        <div className="lg:col-span-5 min-h-[180px]">
          <ImageWithFallback
            src="/src/assets/images/event_agro_summit_1794588273708.jpg"
            alt="Rueda de negocios agroindustrial AgroConnect"
            className="w-full h-full object-cover"
            fallbackLabel="Ruedas Comerciales AgroConnect"
          />
        </div>
      </section>

      {/* Directorio de eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {state.events.map((evt) => {
          const registered = isRegistered(evt.id);
          return (
            <article
              key={evt.id}
              className="bg-white border border-[#DFE6E0] rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#526058]">
                  <span className="font-mono-tabular font-semibold text-[#14532D] inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {evt.date}
                  </span>
                  <span>{evt.modality}</span>
                </div>

                <h3 className="text-base font-bold font-display text-[#111814]">
                  {evt.title}
                </h3>
                <p className="text-xs text-[#526058]">Organiza: {evt.organizer}</p>

                <p className="text-xs text-[#526058] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#708077] shrink-0" />
                  <span>{evt.location}</span>
                </p>

                <p className="text-xs text-[#526058] leading-relaxed">{evt.description}</p>

                <div className="pt-2 border-t border-[#DFE6E0] text-xs space-y-1">
                  <p className="text-[#708077]">
                    Productos foco:{' '}
                    <span className="text-[#111814] font-medium">
                      {evt.productsOfInterest.join(', ')}
                    </span>
                  </p>
                  <p className="text-[#708077] inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-mono-tabular">
                      {evt.participantCount + (registered ? 1 : 0)} participantes estimados
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DFE6E0] flex items-center justify-between gap-2">
                {registered ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Asistencia confirmada</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-[#708077]">Inscripción abierta</span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedEvent(evt)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
                >
                  {registered ? 'Ver detalle' : 'Explorar e inscribirse'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal de detalle del evento según rol activo */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 overflow-y-auto">
          <div className="bg-white border border-[#DFE6E0] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DFE6E0]">
              <div>
                <p className="text-xs font-mono-tabular text-[#15803D]">
                  {selectedEvent.date} · {selectedEvent.modality}
                </p>
                <h3 className="text-xl font-bold font-display text-[#111814] mt-0.5">
                  {selectedEvent.title}
                </h3>
                <p className="text-xs text-[#526058] mt-1">{selectedEvent.location}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 text-[#526058] hover:text-[#111814] rounded-lg border border-[#DFE6E0] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-5 text-xs">
              <p className="text-sm text-[#526058] leading-relaxed">{selectedEvent.description}</p>

              {/* Visibilidad diferenciada por rol */}
              {activeRole === 'buyer' ? (
                <div>
                  <h4 className="text-sm font-bold font-display text-[#111814] mb-2.5">
                    Proveedores participantes visibles para Compradores
                  </h4>
                  <div className="space-y-2.5">
                    {state.suppliers
                      .filter((s) => selectedEvent.participatingSupplierIds.includes(s.id))
                      .map((sup) => {
                        const activeSupOffers = state.offers.filter(
                          (o) => o.supplierId === sup.id && o.status === 'activa'
                        );
                        const totalKg = activeSupOffers.reduce(
                          (acc, o) => acc + normalizeToKg(o.availableQuantity, o.unit),
                          0
                        );
                        return (
                          <div
                            key={sup.id}
                            className="p-3.5 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7] flex flex-wrap items-center justify-between gap-2"
                          >
                            <div>
                              <p className="font-bold text-[#111814]">{sup.organizationName}</p>
                              <p className="text-[#526058]">
                                {SUPPLIER_TYPE_LABELS[sup.supplierType]} · Productos:{' '}
                                {sup.cultivatedProducts.join(', ')}
                              </p>
                            </div>
                            <div className="text-right font-mono-tabular">
                              <p className="font-semibold text-[#14532D]">
                                {totalKg > 0
                                  ? formatKgAsTonsOrKg(totalKg)
                                  : `${sup.marketableAvailabilityTons ?? 0} t est.`}
                              </p>
                              <p className="text-[#526058]">
                                {sup.estimatedPrice
                                  ? `Ref. S/ ${sup.estimatedPrice.toFixed(2)}/${sup.commercialUnit}`
                                  : 'Precio por confirmar'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-sm font-bold font-display text-[#111814] mb-2.5">
                    Compradores participantes visibles para Proveedores
                  </h4>
                  <div className="space-y-2.5">
                    {state.buyers
                      .filter((b) => selectedEvent.participatingBuyerIds.includes(b.id))
                      .map((buyer) => (
                        <div
                          key={buyer.id}
                          className="p-3.5 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7] space-y-1"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-bold text-[#111814]">{buyer.companyName}</p>
                            <span className="text-[#15803D] font-medium">{buyer.subsector}</span>
                          </div>
                          <p className="text-[#526058]">{buyer.businessDescription}</p>
                          <p className="text-[#111814]">
                            Productos requeridos: {buyer.requiredProducts.join(', ')} · Calidad:{' '}
                            {buyer.requiredQuality}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Formulario de inscripción o confirmación visual */}
              <div className="pt-4 border-t border-[#DFE6E0]">
                {isRegistered(selectedEvent.id) ? (
                  <div className="p-4 rounded-lg bg-[#EFF4F0] border border-[#15803D]/30 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-[#14532D]">
                        Inscripción confirmada (Prototipo)
                      </p>
                      <p className="text-xs text-[#526058]">
                        Tu asistencia quedó guardada localmente para este evento comercial.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3">
                    <h4 className="text-sm font-bold font-display text-[#111814]">
                      Formulario de inscripción
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#111814] mb-1">
                          Productos de interés / oferta
                        </label>
                        <input
                          type="text"
                          value={productsFocus}
                          onChange={(e) => setProductsFocus(e.target.value)}
                          placeholder={selectedEvent.productsOfInterest.join(', ')}
                          className="w-full px-3 py-2 text-xs border border-[#DFE6E0] rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#111814] mb-1">
                          Notas de participación (opcional)
                        </label>
                        <input
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Ej. Interés en mesas de tomate industrial"
                          className="w-full px-3 py-2 text-xs border border-[#DFE6E0] rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(null)}
                        className="px-4 py-2 text-xs font-semibold text-[#526058] border border-[#DFE6E0] rounded-lg cursor-pointer"
                      >
                        Cerrar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
                      >
                        Confirmar inscripción
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
