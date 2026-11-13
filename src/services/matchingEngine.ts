import {
  BuyerProfile,
  CurrencyCode,
  DeliveryMode,
  MatchOpportunity,
  MatchSupplierContribution,
  MatchVariableBreakdown,
  PeruLocation,
  PurchaseRequest,
  QualityGrade,
  SupplierProfile,
  SupplyOffer,
  UnitOfMeasure,
} from '../types/agroconnect';
import { getMacroZone } from '../data/peruCatalog';

// Conversión estándar de referencia PEN/USD solo para comparabilidad heurística del prototipo
const USD_TO_PEN_REF = 3.75;

const UNIT_TO_KG: Record<UnitOfMeasure, number> = {
  kg: 1,
  t: 1000,
  qq: 46, // Quintal peruano estándar
  sacos: 50, // Saco estándar de acopio agrícola
};

export function normalizeToKg(quantity: number, unit: UnitOfMeasure): number {
  const factor = UNIT_TO_KG[unit] ?? 1;
  return Math.max(0, Math.round(quantity * factor * 100) / 100);
}

export function formatKgAsTonsOrKg(kg: number): string {
  if (kg >= 1000) {
    const tons = kg / 1000;
    const formatted = Number.isInteger(tons) ? tons.toString() : tons.toFixed(2).replace(/\.?0+$/, '');
    return `${formatted} t`;
  }
  return `${Math.round(kg).toLocaleString('es-PE')} kg`;
}

export function unitPriceToPenPerKg(
  pricePerUnit: number | undefined,
  unit: UnitOfMeasure,
  currency: CurrencyCode
): number | undefined {
  if (pricePerUnit === undefined || pricePerUnit <= 0) return undefined;
  const kgFactor = UNIT_TO_KG[unit] ?? 1;
  const pricePerKg = pricePerUnit / kgFactor;
  return currency === 'USD' ? pricePerKg * USD_TO_PEN_REF : pricePerKg;
}

function isQualityCompatible(required: QualityGrade, offered: QualityGrade): boolean {
  if (required === 'Exportación') {
    return offered === 'Exportación';
  }
  if (required === 'Grado A') {
    return offered === 'Grado A' || offered === 'Exportación';
  }
  if (required === 'Grado B') {
    return offered === 'Grado B' || offered === 'Grado A' || offered === 'Exportación';
  }
  // Industrial Estándar acepta grados estándar o superiores compatibles
  return (
    offered === 'Industrial Estándar' ||
    offered === 'Grado B' ||
    offered === 'Grado A' ||
    offered === 'Exportación'
  );
}

function isVarietyCompatible(request: PurchaseRequest, offer: SupplyOffer): {
  ok: boolean;
  exact: boolean;
  pending: boolean;
} {
  const reqVar = request.variety.trim().toLowerCase();
  const offVar = offer.variety.trim().toLowerCase();

  if (!reqVar || reqVar === 'cualquiera') {
    return { ok: true, exact: true, pending: false };
  }
  if (!offVar || offVar === 'por confirmar') {
    return { ok: !request.varietyMandatory, exact: false, pending: true };
  }
  if (reqVar === offVar || reqVar.includes(offVar) || offVar.includes(reqVar)) {
    return { ok: true, exact: true, pending: false };
  }
  // Si la variedad NO es obligatoria, variedades del mismo producto son parcialmente compatibles
  if (!request.varietyMandatory) {
    return { ok: true, exact: false, pending: false };
  }
  return { ok: false, exact: false, pending: false };
}

function evaluateAvailabilityOverlap(request: PurchaseRequest, offer: SupplyOffer): {
  compatible: boolean;
  pending: boolean;
  score: number;
  detail: string;
} {
  if (!request.deliveryDate || !offer.availableFrom || !offer.availableTo) {
    return {
      compatible: true,
      pending: true,
      score: 60,
      detail: 'Fechas de cosecha o entrega pendientes de confirmación.',
    };
  }
  const reqTime = new Date(request.deliveryDate).getTime();
  const fromTime = new Date(offer.availableFrom).getTime();
  const toTime = new Date(offer.availableTo).getTime();

  if (Number.isNaN(reqTime) || Number.isNaN(fromTime) || Number.isNaN(toTime)) {
    return {
      compatible: true,
      pending: true,
      score: 60,
      detail: 'Rango temporal pendiente de confirmación.',
    };
  }

  if (reqTime >= fromTime && reqTime <= toTime) {
    return {
      compatible: true,
      pending: false,
      score: 100,
      detail: `Ventana activa (${offer.availableFrom} a ${offer.availableTo}) cubre la entrega (${request.deliveryDate}).`,
    };
  }

  // Margen logístico de 14 días antes de la fecha límite
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  if (fromTime <= reqTime && toTime >= reqTime - fourteenDaysMs) {
    return {
      compatible: true,
      pending: false,
      score: 75,
      detail: `Disponibilidad cercana a la fecha objetivo (${offer.availableTo}); requiere coordinar despacho.`,
    };
  }

  return {
    compatible: false,
    pending: false,
    score: 0,
    detail: `Fuera de ventana de entrega (${offer.availableFrom} - ${offer.availableTo} vs ${request.deliveryDate}).`,
  };
}

function locationProximityScore(a: PeruLocation, b: PeruLocation): {
  score: number;
  detail: string;
} {
  if (a.department === b.department && a.province === b.province) {
    return { score: 100, detail: `Misma provincia (${a.province}, ${a.department}).` };
  }
  if (a.department === b.department) {
    return { score: 88, detail: `Mismo departamento (${a.department}).` };
  }
  const zoneA = getMacroZone(a.department);
  const zoneB = getMacroZone(b.department);
  if (zoneA === zoneB) {
    return { score: 78, detail: `Corredor logístico cercano (${zoneA}: ${a.department} → ${b.department}).` };
  }
  // Costa Centro <-> Sierra Centro tienen buena conectividad por Carretera Central
  if (
    (zoneA === 'Costa Centro' && zoneB === 'Sierra Centro') ||
    (zoneA === 'Sierra Centro' && zoneB === 'Costa Centro')
  ) {
    return { score: 66, detail: `Corredor interregional conectado (${a.department} → ${b.department}).` };
  }
  return { score: 50, detail: `Traslado interregional (${a.department} → ${b.department}).` };
}

function deliveryCompatibility(reqMode: DeliveryMode, offMode: DeliveryMode): {
  score: number;
  detail: string;
} {
  if (reqMode === offMode) {
    return { score: 100, detail: 'Modalidad de entrega coincidente.' };
  }
  if (reqMode === 'negociable' || offMode === 'negociable') {
    return { score: 85, detail: 'Modalidad negociable entre las partes.' };
  }
  return { score: 55, detail: 'Modalidades distintas (requiere acuerdo de flete).' };
}

interface CandidateOfferEval {
  offer: SupplyOffer;
  supplier: SupplierProfile;
  offeredKg: number;
  pricePerKgPen?: number;
  varietyExact: boolean;
  varietyPending: boolean;
  availability: ReturnType<typeof evaluateAvailabilityOverlap>;
  proximity: ReturnType<typeof locationProximityScore>;
  delivery: ReturnType<typeof deliveryCompatibility>;
  logisticsScore: number;
  priceScore: number;
  singleFitScore: number;
}

function evaluateCandidateOffer(
  request: PurchaseRequest,
  offer: SupplyOffer,
  supplier: SupplierProfile
): CandidateOfferEval | null {
  // 1. Nunca mezclar productos diferentes
  if (offer.product.trim().toLowerCase() !== request.product.trim().toLowerCase()) {
    return null;
  }

  // 2. Calidad estrictamente compatible
  if (!isQualityCompatible(request.quality, offer.quality)) {
    return null;
  }

  // 3. Variedad compatible
  const varietyCheck = isVarietyCompatible(request, offer);
  if (!varietyCheck.ok) {
    return null;
  }

  // 4. Disponibilidad temporal compatible
  const availability = evaluateAvailabilityOverlap(request, offer);
  if (!availability.compatible) {
    return null;
  }

  const offeredKg = normalizeToKg(offer.availableQuantity, offer.unit);
  if (offeredKg <= 0) return null;

  const proximity = locationProximityScore(offer.location, request.receptionLocation);
  const delivery = deliveryCompatibility(request.preferredDeliveryMode, offer.deliveryMode);

  // Capacidad logística
  let logisticsScore = 60;
  if (supplier.hasOwnTransport) logisticsScore += 18;
  if (supplier.hasCollectionCenter || supplier.hasStorage) logisticsScore += 12;
  if (request.requiresColdChain) {
    logisticsScore = supplier.hasColdChain ? Math.min(100, logisticsScore + 10) : Math.max(35, logisticsScore - 25);
  } else if (supplier.hasColdChain) {
    logisticsScore = Math.min(100, logisticsScore + 10);
  }

  const pricePerKgPen = unitPriceToPenPerKg(offer.pricePerUnit, offer.unit, offer.currency);
  let priceScore = 70; // pendiente de confirmación si no hay precio o precio objetivo
  if (pricePerKgPen !== undefined && request.targetPricePerKg && request.targetPricePerKg > 0) {
    const ratio = pricePerKgPen / request.targetPricePerKg;
    if (ratio <= 1.0) priceScore = 100;
    else if (ratio <= 1.1) priceScore = 82;
    else if (ratio <= 1.25) priceScore = 62;
    else priceScore = 40;
  }

  const varietyScore = varietyCheck.exact ? 100 : varietyCheck.pending ? 65 : 78;
  const qualityScore = offer.quality === request.quality ? 100 : 90;

  const singleFitScore = Math.round(
    varietyScore * 0.14 +
      qualityScore * 0.16 +
      availability.score * 0.16 +
      proximity.score * 0.14 +
      delivery.score * 0.12 +
      logisticsScore * 0.14 +
      priceScore * 0.14
  );

  return {
    offer,
    supplier,
    offeredKg,
    pricePerKgPen,
    varietyExact: varietyCheck.exact,
    varietyPending: varietyCheck.pending,
    availability,
    proximity,
    delivery,
    logisticsScore,
    priceScore,
    singleFitScore,
  };
}

function buildBreakdownAndOpportunity(
  type: 'direct' | 'consolidated',
  request: PurchaseRequest,
  buyer: BuyerProfile,
  selected: CandidateOfferEval[]
): MatchOpportunity {
  const requiredKg = normalizeToKg(request.quantity, request.unit);

  // Asignación sin duplicar ofertas ni inventar capacidad
  let remainingNeedKg = requiredKg;
  const totalOfferedKg = selected.reduce((sum, item) => sum + item.offeredKg, 0);

  const contributions: MatchSupplierContribution[] = selected.map((item) => {
    const allocatedKg = Math.min(item.offeredKg, Math.max(0, remainingNeedKg));
    remainingNeedKg = Math.max(0, remainingNeedKg - allocatedKg);

    const shareDenominator = type === 'direct' ? requiredKg : Math.max(requiredKg, totalOfferedKg);
    const shareBase = allocatedKg > 0 ? allocatedKg : item.offeredKg;
    const sharePercent =
      requiredKg > 0
        ? Math.min(100, Math.round((shareBase / Math.min(requiredKg, Math.max(totalOfferedKg, 1))) * 100))
        : 0;

    return {
      offer: item.offer,
      supplier: item.supplier,
      offeredKg: item.offeredKg,
      allocatedKg: type === 'direct' ? Math.min(item.offeredKg, requiredKg) : allocatedKg || item.offeredKg,
      sharePercent: shareDenominator > 0 ? sharePercent : 0,
      pricePerKgPen: item.pricePerKgPen,
      pricePending: item.pricePerKgPen === undefined,
    };
  });

  // Recalcular porcentajes de aporte limpios que sumen acorde a la cobertura
  const totalAllocated = contributions.reduce((s, c) => s + c.allocatedKg, 0);
  contributions.forEach((c) => {
    c.sharePercent =
      requiredKg > 0 ? Math.round((c.allocatedKg / requiredKg) * 1000) / 10 : 0;
  });

  const coveragePercent =
    requiredKg > 0 ? Math.min(100, Math.round((totalOfferedKg / requiredKg) * 100)) : 0;
  const missingKg = Math.max(0, Math.round((requiredKg - totalOfferedKg) * 100) / 100);
  const surplusKg = Math.max(0, Math.round((totalOfferedKg - requiredKg) * 100) / 100);

  // Evaluar las 10 variables del matching para mostrar desglose transparente
  const pendingConfirmations: string[] = [];

  // Var 1: Producto agrícola
  const varProduct: MatchVariableBreakdown = {
    variable: '1. Producto agrícola',
    status: 'compatible',
    score: 100,
    weight: 12,
    detail: `Coincidencia exacta en ${request.product} (sin mezcla de cultivos).`,
  };

  // Var 2: Variedad
  const allExactVar = selected.every((s) => s.varietyExact);
  const anyPendingVar = selected.some((s) => s.varietyPending);
  const varVariety: MatchVariableBreakdown = {
    variable: '2. Variedad',
    status: anyPendingVar ? 'pendiente' : allExactVar ? 'compatible' : 'parcial',
    score: anyPendingVar ? 65 : allExactVar ? 100 : 80,
    weight: 10,
    detail: allExactVar
      ? `Variedad compatible (${request.variety}).`
      : anyPendingVar
      ? 'Una o más ofertas tienen variedad pendiente de confirmación.'
      : `Variedades industriales compatibles dentro de ${request.product} (${selected.map((s) => s.offer.variety).join(', ')}).`,
  };
  if (anyPendingVar) pendingConfirmations.push('Variedad específica por confirmar');

  // Var 3: Cantidad disponible vs requerida
  const volumeScore =
    coveragePercent >= 100 ? 100 : Math.max(25, coveragePercent);
  const varVolume: MatchVariableBreakdown = {
    variable: '3. Volumen normalizado',
    status: coveragePercent >= 100 ? 'compatible' : 'parcial',
    score: volumeScore,
    weight: 18,
    detail:
      type === 'direct'
        ? `Un proveedor dispone de ${formatKgAsTonsOrKg(totalOfferedKg)} frente a ${formatKgAsTonsOrKg(requiredKg)} requeridos.`
        : `Consolidación de ${selected.length} proveedores suma ${formatKgAsTonsOrKg(totalOfferedKg)} (${coveragePercent}% de ${formatKgAsTonsOrKg(requiredKg)}).`,
  };

  // Var 4: Calidad
  const exactQuality = selected.every((s) => s.offer.quality === request.quality);
  const varQuality: MatchVariableBreakdown = {
    variable: '4. Calidad',
    status: 'compatible',
    score: exactQuality ? 100 : 92,
    weight: 12,
    detail: exactQuality
      ? `Todas las ofertas cumplen con ${request.quality}.`
      : `Calidad igual o superior a ${request.quality} (${selected.map((s) => s.offer.quality).join(', ')}).`,
  };

  // Var 5: Disponibilidad / Temporada
  const anyPendingDate = selected.some((s) => s.availability.pending);
  const avgAvailScore = Math.round(
    selected.reduce((s, c) => s + c.availability.score, 0) / selected.length
  );
  const varAvailability: MatchVariableBreakdown = {
    variable: '5. Fecha y disponibilidad',
    status: anyPendingDate ? 'pendiente' : avgAvailScore >= 85 ? 'compatible' : 'parcial',
    score: avgAvailScore,
    weight: 12,
    detail: anyPendingDate
      ? 'Ventana de disponibilidad pendiente de confirmación en alguna oferta.'
      : `Ventanas de cosecha compatibles con entrega prevista para ${request.deliveryDate}.`,
  };
  if (anyPendingDate) pendingConfirmations.push('Ventana exacta de cosecha');

  // Var 6 y 7: Ubicación de producción y recepción
  const avgProx = Math.round(
    selected.reduce((s, c) => s + c.proximity.score, 0) / selected.length
  );
  const uniqueOrigins = Array.from(
    new Set(selected.map((s) => `${s.offer.location.province} (${s.offer.location.department})`))
  );
  const varOrigin: MatchVariableBreakdown = {
    variable: '6. Ubicación de producción',
    status: avgProx >= 75 ? 'compatible' : 'parcial',
    score: avgProx,
    weight: 7,
    detail: `Orígenes: ${uniqueOrigins.join(' · ')}.`,
  };
  const varDestination: MatchVariableBreakdown = {
    variable: '7. Ubicación de recepción',
    status: avgProx >= 75 ? 'compatible' : 'parcial',
    score: avgProx,
    weight: 7,
    detail: `Recepción en planta: ${request.receptionLocation.district}, ${request.receptionLocation.department}.`,
  };

  // Var 8: Precio estimado
  const priced = selected.filter((s) => s.pricePerKgPen !== undefined);
  const pricePendingCount = selected.length - priced.length;
  let estimatedWeightedPricePerKgPen: number | undefined;
  if (priced.length > 0) {
    const pricedKgSum = priced.reduce((s, c) => s + c.offeredKg, 0);
    const weightedSum = priced.reduce((s, c) => s + (c.pricePerKgPen ?? 0) * c.offeredKg, 0);
    estimatedWeightedPricePerKgPen =
      pricedKgSum > 0 ? Math.round((weightedSum / pricedKgSum) * 100) / 100 : undefined;
  }
  const avgPriceScore = Math.round(
    selected.reduce((s, c) => s + c.priceScore, 0) / selected.length
  );
  const varPrice: MatchVariableBreakdown = {
    variable: '8. Precio estimado',
    status:
      pricePendingCount === selected.length
        ? 'pendiente'
        : pricePendingCount > 0
        ? 'pendiente'
        : avgPriceScore >= 80
        ? 'compatible'
        : 'parcial',
    score: avgPriceScore,
    weight: 8,
    detail:
      pricePendingCount > 0
        ? `${pricePendingCount} oferta(s) con precio pendiente de confirmación.`
        : request.targetPricePerKg
        ? `Promedio ponderado S/ ${estimatedWeightedPricePerKgPen?.toFixed(2)}/kg frente a objetivo S/ ${request.targetPricePerKg.toFixed(2)}/kg.`
        : `Promedio ponderado referencial S/ ${estimatedWeightedPricePerKgPen?.toFixed(2)}/kg (precio objetivo no especificado).`,
  };
  if (pricePendingCount > 0) pendingConfirmations.push('Precio por confirmar en parte de la oferta');

  // Var 9: Condiciones de entrega
  const avgDelivery = Math.round(
    selected.reduce((s, c) => s + c.delivery.score, 0) / selected.length
  );
  const varDelivery: MatchVariableBreakdown = {
    variable: '9. Condiciones de entrega',
    status: avgDelivery >= 80 ? 'compatible' : 'parcial',
    score: avgDelivery,
    weight: 7,
    detail:
      type === 'consolidated'
        ? 'Coordinación multi-punto según modalidad de entrega de cada proveedor.'
        : selected[0].delivery.detail,
  };

  // Var 10: Capacidad logística
  const avgLogistics = Math.round(
    selected.reduce((s, c) => s + c.logisticsScore, 0) / selected.length
  );
  const hasColdMissing = request.requiresColdChain && selected.some((s) => !s.supplier.hasColdChain);
  const varLogistics: MatchVariableBreakdown = {
    variable: '10. Capacidad logística',
    status: hasColdMissing ? 'parcial' : avgLogistics >= 75 ? 'compatible' : 'parcial',
    score: avgLogistics,
    weight: 7,
    detail: hasColdMissing
      ? 'Cadena de frío requerida: confirmar transporte refrigerado para parte del lote.'
      : `${selected.filter((s) => s.supplier.hasOwnTransport).length}/${selected.length} proveedores con transporte propio y acopio.`,
  };
  if (hasColdMissing) pendingConfirmations.push('Confirmar cadena de frío en traslado');

  const unvalidatedSuppliers = selected.filter(
    (s) => s.supplier.validationStatus === 'pendiente_validacion'
  );
  if (unvalidatedSuppliers.length > 0) {
    pendingConfirmations.push(
      `${unvalidatedSuppliers.length} proveedor(es) en estado pendiente de validación`
    );
  }

  const breakdown = [
    varProduct,
    varVariety,
    varVolume,
    varQuality,
    varAvailability,
    varOrigin,
    varDestination,
    varPrice,
    varDelivery,
    varLogistics,
  ];

  // Puntaje heurístico ponderado (explícitamente indicado como heurístico de prototipo)
  const rawHeuristic = breakdown.reduce((acc, b) => acc + (b.score * b.weight) / 100, 0);
  // Pequeña penalización heurística de coordinación por cada proveedor adicional en consolidación
  const coordinationPenalty = type === 'consolidated' ? Math.max(0, (selected.length - 1) * 1.5) : 0;
  const heuristicScore = Math.max(
    1,
    Math.min(99, Math.round(rawHeuristic - coordinationPenalty))
  );

  return {
    id: `${type}_${request.id}_${selected.map((s) => s.offer.id).sort().join('_')}`,
    type,
    request,
    buyer,
    contributions,
    requiredKg,
    consolidatedAvailableKg: totalOfferedKg,
    coveragePercent,
    missingKg,
    surplusKg,
    heuristicScore,
    estimatedWeightedPricePerKgPen,
    pricePendingCount,
    qualityCompatible: true,
    availabilityCompatible: true,
    deliverySummary:
      type === 'direct'
        ? selected[0].delivery.detail
        : `${selected.length} puntos de acopio/origen hacia ${request.receptionLocation.department}`,
    locationSummary: uniqueOrigins.join(', '),
    breakdown,
    pendingConfirmations,
  };
}

/**
 * Ejecuta el motor de Smart Matching para una lista de solicitudes y ofertas.
 * - Identifica Direct Matches (1 proveedor >= 100% demanda)
 * - Identifica Consolidated Matches (2 a 4 proveedores distintos cuya suma cubre la demanda o maximiza cobertura)
 * - Garantiza que nunca se duplique una oferta dentro de la misma consolidación
 * - Garantiza que nunca se mezclen productos ni calidades incompatibles
 */
export function runSmartMatching(
  requests: PurchaseRequest[],
  offers: SupplyOffer[],
  buyers: BuyerProfile[],
  suppliers: SupplierProfile[]
): MatchOpportunity[] {
  const activeRequests = requests.filter((r) => r.status === 'activa');
  const activeOffers = offers.filter((o) => o.status === 'activa');

  const results: MatchOpportunity[] = [];

  for (const request of activeRequests) {
    const buyer = buyers.find((b) => b.id === request.buyerId);
    if (!buyer) continue;

    const requiredKg = normalizeToKg(request.quantity, request.unit);
    if (requiredKg <= 0) continue;

    // Evaluar ofertas compatibles sin duplicados
    const candidates: CandidateOfferEval[] = [];
    const seenOfferIds = new Set<string>();

    for (const offer of activeOffers) {
      if (seenOfferIds.has(offer.id)) continue;
      const supplier = suppliers.find((s) => s.id === offer.supplierId);
      if (!supplier) continue;
      const evaluated = evaluateCandidateOffer(request, offer, supplier);
      if (evaluated) {
        seenOfferIds.add(offer.id);
        candidates.push(evaluated);
      }
    }

    if (candidates.length === 0) continue;

    // A. Direct Matches (un solo proveedor cubre >= 100% del volumen)
    const directCandidates = candidates
      .filter((c) => c.offeredKg >= requiredKg)
      .sort((a, b) => b.singleFitScore - a.singleFitScore);

    for (const dc of directCandidates.slice(0, 3)) {
      results.push(buildBreakdownAndOpportunity('direct', request, buyer, [dc]));
    }

    // B. Consolidated Matches (proveedores que individualmente < requiredKg o pool complementario >= 2 ofertas distintas)
    const partialCandidates = candidates
      .filter((c) => c.offeredKg < requiredKg)
      .sort((a, b) => {
        // Priorizar mejor puntaje heurístico y buen aporte relativo
        if (Math.abs(b.singleFitScore - a.singleFitScore) > 6) {
          return b.singleFitScore - a.singleFitScore;
        }
        return b.offeredKg - a.offeredKg;
      });

    if (partialCandidates.length >= 2) {
      // Búsqueda combinatoria controlada (hasta 10 mejores candidatos) para encontrar
      // la combinación óptima de 2 a 4 proveedores distintos sin duplicar lotes
      const pool = partialCandidates.slice(0, 10);
      const best: {
        exactCombo: CandidateOfferEval[] | null;
        exactScore: number;
        exactSurplus: number;
        partialCombo: CandidateOfferEval[] | null;
        partialVolume: number;
      } = {
        exactCombo: null,
        exactScore: -1,
        exactSurplus: Infinity,
        partialCombo: null,
        partialVolume: 0,
      };

      const n = pool.length;

      // Evaluar subconjuntos de tamaño 2, 3 y 4
      const searchCombos = (startIdx: number, chosen: CandidateOfferEval[], sumKg: number) => {
        if (chosen.length >= 2) {
          if (sumKg >= requiredKg) {
            const surplus = sumKg - requiredKg;
            const avgScore =
              chosen.reduce((s, c) => s + c.singleFitScore, 0) / chosen.length;
            // Preferir cobertura exacta (menor excedente) y mayor compatibilidad
            const isBetter =
              best.exactCombo === null ||
              (surplus === 0 && best.exactSurplus > 0) ||
              (surplus <= best.exactSurplus && avgScore >= best.exactScore - 4) ||
              (surplus < requiredKg * 0.25 && avgScore > best.exactScore + 5);

            if (isBetter) {
              best.exactCombo = [...chosen];
              best.exactScore = avgScore;
              best.exactSurplus = surplus;
            }
          } else if (sumKg > best.partialVolume) {
            best.partialVolume = sumKg;
            best.partialCombo = [...chosen];
          }
        }

        if (chosen.length === 4 || sumKg >= requiredKg) return;

        for (let i = startIdx; i < n; i++) {
          const next = pool[i];
          // Asegurar que no se repita la misma oferta ni el mismo proveedor si ya aporta su lote
          if (chosen.some((c) => c.offer.id === next.offer.id)) continue;
          searchCombos(i + 1, [...chosen, next], sumKg + next.offeredKg);
        }
      };

      searchCombos(0, [], 0);

      const chosenCombo = best.exactCombo ?? best.partialCombo;
      if (chosenCombo && chosenCombo.length >= 2) {
        results.push(buildBreakdownAndOpportunity('consolidated', request, buyer, chosenCombo));
      }
    }
  }

  // Ordenar priorizando oportunidades consolidadas completas y mayor puntaje heurístico
  return results.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'consolidated' ? -1 : 1;
    }
    if (a.coveragePercent !== b.coveragePercent) {
      return b.coveragePercent - a.coveragePercent;
    }
    return b.heuristicScore - a.heuristicScore;
  });
}

/**
 * Filtra las oportunidades de Smart Matching relevantes para un proveedor específico.
 */
export function getOpportunitiesForSupplier(
  allMatches: MatchOpportunity[],
  supplierId: string
): MatchOpportunity[] {
  return allMatches.filter((m) =>
    m.contributions.some((c) => c.supplier.id === supplierId)
  );
}
