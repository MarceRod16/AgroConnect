import React, { useMemo } from 'react';
import { BarChart3, GitMerge, MapPin } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { formatKgAsTonsOrKg, normalizeToKg } from '../../services/matchingEngine';

export const StatisticsView: React.FC = () => {
  const { state, allMatches } = useAgroConnect();

  const productBalances = useMemo(() => {
    const map = new Map<string, { demandKg: number; supplyKg: number }>();

    state.requests
      .filter((r) => r.status === 'activa')
      .forEach((r) => {
        const prev = map.get(r.product) ?? { demandKg: 0, supplyKg: 0 };
        prev.demandKg += normalizeToKg(r.quantity, r.unit);
        map.set(r.product, prev);
      });

    state.offers
      .filter((o) => o.status === 'activa')
      .forEach((o) => {
        const prev = map.get(o.product) ?? { demandKg: 0, supplyKg: 0 };
        prev.supplyKg += normalizeToKg(o.availableQuantity, o.unit);
        map.set(o.product, prev);
      });

    return Array.from(map.entries())
      .map(([product, vals]) => ({ product, ...vals }))
      .sort((a, b) => b.demandKg + b.supplyKg - (a.demandKg + a.supplyKg));
  }, [state.requests, state.offers]);

  const maxProductKg = Math.max(
    1000,
    ...productBalances.map((p) => Math.max(p.demandKg, p.supplyKg))
  );

  const regionalSupply = useMemo(() => {
    const map = new Map<string, { kg: number; suppliers: Set<string> }>();
    state.offers
      .filter((o) => o.status === 'activa')
      .forEach((o) => {
        const dept = o.location.department;
        const entry = map.get(dept) ?? { kg: 0, suppliers: new Set<string>() };
        entry.kg += normalizeToKg(o.availableQuantity, o.unit);
        entry.suppliers.add(o.supplierId);
        map.set(dept, entry);
      });
    return Array.from(map.entries())
      .map(([dept, data]) => ({
        department: dept,
        kg: data.kg,
        supplierCount: data.suppliers.size,
      }))
      .sort((a, b) => b.kg - a.kg);
  }, [state.offers]);

  const maxRegionalKg = Math.max(1000, ...regionalSupply.map((r) => r.kg));

  const consolidatedMatches = allMatches.filter((m) => m.type === 'consolidated');
  const directMatches = allMatches.filter((m) => m.type === 'direct');
  const avgCoverage =
    allMatches.length > 0
      ? Math.round(allMatches.reduce((s, m) => s + m.coveragePercent, 0) / allMatches.length)
      : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6">
        <h2 className="text-lg font-bold font-display text-[#111814]">
          Estadísticas de oferta, demanda y consolidación
        </h2>
        <p className="text-xs text-[#526058] mt-1">
          Métricas calculadas dinámicamente a partir de las publicaciones activas en este entorno de
          demostración. No representan transacciones reales ejecutadas.
        </p>
      </div>

      {/* KPIs globales de red */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-5">
          <p className="text-xs text-[#526058]">Oportunidades consolidadas</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#D97706] mt-1">
            {consolidatedMatches.length}
          </p>
          <p className="text-xs text-[#708077] mt-1">Multi-proveedor activas</p>
        </div>
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-5">
          <p className="text-xs text-[#526058]">Oportunidades directas</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mt-1">
            {directMatches.length}
          </p>
          <p className="text-xs text-[#708077] mt-1">Cobertura 1:1</p>
        </div>
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-5">
          <p className="text-xs text-[#526058]">Cobertura promedio</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#15803D] mt-1">
            {avgCoverage}%
          </p>
          <p className="text-xs text-[#708077] mt-1">Sobre oportunidades detectadas</p>
        </div>
        <div className="bg-white border border-[#DFE6E0] rounded-xl p-5">
          <p className="text-xs text-[#526058]">Contactos e intereses</p>
          <p className="text-2xl font-bold font-mono-tabular text-[#111814] mt-1">
            {state.interests.length}
          </p>
          <p className="text-xs text-[#708077] mt-1">Solicitudes comerciales registradas</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Gráfico 1: Demanda vs Oferta por cultivo */}
        <section className="lg:col-span-7 bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#14532D]" />
              <h3 className="text-sm font-bold font-display text-[#111814]">
                Demanda vs. oferta disponible por cultivo (normalizado)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#526058]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#D97706]" />
                <span>Demanda</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#14532D]" />
                <span>Oferta</span>
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {productBalances.map((row) => {
              const demandPct = Math.round((row.demandKg / maxProductKg) * 100);
              const supplyPct = Math.round((row.supplyKg / maxProductKg) * 100);
              return (
                <div key={row.product} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#111814]">{row.product}</span>
                    <span className="font-mono-tabular text-[#526058]">
                      Demanda: {formatKgAsTonsOrKg(row.demandKg)} · Oferta:{' '}
                      {formatKgAsTonsOrKg(row.supplyKg)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-[#EFF4F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D97706] rounded-full"
                        style={{ width: `${Math.max(demandPct, row.demandKg > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                    <div className="w-full h-2 bg-[#EFF4F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#14532D] rounded-full"
                        style={{ width: `${Math.max(supplyPct, row.supplyKg > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gráfico 2: Distribución regional de oferta */}
        <section className="lg:col-span-5 bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-4 h-4 text-[#14532D]" />
            <h3 className="text-sm font-bold font-display text-[#111814]">
              Oferta agrícola por departamento (Perú)
            </h3>
          </div>

          <div className="space-y-3.5">
            {regionalSupply.map((reg) => {
              const pct = Math.round((reg.kg / maxRegionalKg) * 100);
              return (
                <div key={reg.department} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#111814]">
                      {reg.department}{' '}
                      <span className="text-[#708077]">({reg.supplierCount} prov.)</span>
                    </span>
                    <span className="font-mono-tabular font-semibold text-[#14532D]">
                      {formatKgAsTonsOrKg(reg.kg)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#EFF4F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#15803D] rounded-full"
                      style={{ width: `${Math.max(pct, 6)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#DFE6E0] text-xs text-[#526058] flex items-start gap-2">
            <GitMerge className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
            <span>
              La concentración de oferta en regiones cercanas (Lima, Ica, Junín) permite reducir
              costos de acopio al consolidar múltiples lotes.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
