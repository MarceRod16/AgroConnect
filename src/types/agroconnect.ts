export type UserRoleType = 'buyer' | 'supplier' | 'both';
export type ActiveRole = 'buyer' | 'supplier';
export type PersonType = 'natural' | 'juridica';
export type DocumentType = 'DNI' | 'CE' | 'Pasaporte';
export type ValidationStatus = 'validado_demo' | 'pendiente_validacion';

export type UnitOfMeasure = 'kg' | 't' | 'qq' | 'sacos';
export type QualityGrade = 'Exportación' | 'Grado A' | 'Grado B' | 'Industrial Estándar';
export type DeliveryMode = 'en_origen' | 'en_destino' | 'negociable';
export type CurrencyCode = 'PEN' | 'USD';
export type PublicationStatus = 'activa' | 'pausada' | 'cerrada';

export type BuyerType = 'procesadora_alimentos' | 'fabricante' | 'otro';
export type CompanySize = 'micro' | 'pequena' | 'mediana' | 'grande';

export type SupplierType =
  | 'productor_individual'
  | 'persona_natural_negocio'
  | 'asociacion'
  | 'cooperativa'
  | 'empresa_agricola'
  | 'centro_acopio'
  | 'comercializador';

export type SupplierMainActivity = 'produccion_agricola' | 'acopio' | 'comercializacion';

export interface PeruLocation {
  country: string;
  department: string;
  province: string;
  district: string;
  zone?: string;
}

export interface IdentificationInfo {
  personType: PersonType;
  // Natural person fields (kept private, never exposed publicly)
  documentType?: DocumentType;
  documentNumber?: string;
  hasRuc?: boolean;
  // Shared / Juridica fields
  ruc?: string;
  legalName?: string; // Razón social
  tradeName: string; // Nombre comercial
  economicActivity: string;
  representativeName?: string;
  representativeRole?: string;
  location: PeruLocation;
  validationStatus: ValidationStatus;
}

export interface BuyerProfile {
  id: string;
  userId: string;
  isDemo?: boolean;
  companyName: string;
  buyerType: BuyerType;
  subsector: string;
  companySize: CompanySize;
  businessDescription: string;
  finalProducts: string[];
  plantLocation: PeruLocation;
  yearsActive?: number;
  // Sourcing profile
  rawMaterialCategories: string[];
  requiredProducts: string[];
  preferredVarieties: string[];
  monthlyAverageVolumeTons?: number;
  sourcingFrequency: 'semanal' | 'quincenal' | 'mensual' | 'por_campana';
  requiredQuality: QualityGrade;
  technicalRequirements: string;
  preferredOrigin?: string;
  profileCompletionPercent: number;
}

export interface SupplierProfile {
  id: string;
  userId: string;
  isDemo?: boolean;
  organizationName: string;
  supplierType: SupplierType;
  mainActivity: SupplierMainActivity;
  businessDescription: string;
  contactPerson: string;
  contactRole: string;
  memberCount?: number;
  yearsActive?: number;
  validationStatus: ValidationStatus;
  // Production
  productCategories: string[];
  cultivatedProducts: string[];
  varieties: string[];
  productionLocation: PeruLocation;
  cultivatedAreaHa?: number;
  averageProductionTons?: number;
  marketableAvailabilityTons?: number;
  harvestSeason: string;
  harvestFrequency: string;
  maxOfferCapacityTons?: number;
  // Product characteristics
  qualityClassification: QualityGrade;
  sizeCaliber?: string;
  maturity?: string;
  humidity?: string;
  cultivationConditions?: string;
  certifications: string[];
  postHarvestTreatments?: string;
  photoUrls: string[];
  // Logistics
  hasOwnTransport: boolean;
  transportType?: string;
  loadCapacityTons?: number;
  hasCollectionCenter: boolean;
  hasStorage: boolean;
  hasColdChain: boolean;
  packagingType?: string;
  distributionZones: string[];
  deliveryMode: DeliveryMode;
  // Commercial conditions
  estimatedPrice?: number;
  currency: CurrencyCode;
  commercialUnit: UnitOfMeasure;
  priceNegotiable: boolean;
  minimumOrderQuantity?: number;
  saleModality?: string;
  deliveryConditions?: string;
  profileCompletionPercent: number;
}

export interface UserAccount {
  id: string;
  isDemo?: boolean;
  firstName: string;
  lastName: string;
  email: string;
  // Private phone number — never rendered on public commercial profiles
  phone: string;
  jobTitle: string;
  roleType: UserRoleType;
  personType: PersonType;
  identification: IdentificationInfo;
  onboardingStep: number; // 1..4, 5 = completed
  onboardingCompleted: boolean;
  buyerProfileId?: string;
  supplierProfileId?: string;
  createdAt: string;
}

export interface PurchaseRequest {
  id: string;
  buyerId: string;
  isDemo?: boolean;
  product: string;
  category: string;
  variety: string;
  varietyMandatory: boolean;
  quantity: number;
  unit: UnitOfMeasure;
  quality: QualityGrade;
  deliveryDate: string; // YYYY-MM-DD
  deliveryPeriodLabel?: string;
  receptionLocation: PeruLocation;
  targetPricePerKg?: number;
  currency: CurrencyCode;
  logisticsConditions: string;
  preferredDeliveryMode: DeliveryMode;
  requiresColdChain?: boolean;
  description: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SupplyOffer {
  id: string;
  supplierId: string;
  isDemo?: boolean;
  product: string;
  category: string;
  variety: string;
  availableQuantity: number;
  unit: UnitOfMeasure;
  quality: QualityGrade;
  location: PeruLocation;
  availableFrom: string; // YYYY-MM-DD
  availableTo: string; // YYYY-MM-DD
  pricePerUnit?: number;
  currency: CurrencyCode;
  priceNegotiable: boolean;
  minimumQuantity: number;
  deliveryMode: DeliveryMode;
  additionalFeatures: string;
  photoUrl?: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export type VariableStatus = 'compatible' | 'parcial' | 'pendiente' | 'incompatible';

export interface MatchVariableBreakdown {
  variable: string;
  status: VariableStatus;
  score: number; // 0..100
  weight: number; // %
  detail: string;
}

export interface MatchSupplierContribution {
  offer: SupplyOffer;
  supplier: SupplierProfile;
  offeredKg: number;
  allocatedKg: number;
  sharePercent: number;
  pricePerKgPen?: number;
  pricePending: boolean;
}

export interface MatchOpportunity {
  id: string;
  type: 'direct' | 'consolidated';
  request: PurchaseRequest;
  buyer: BuyerProfile;
  contributions: MatchSupplierContribution[];
  requiredKg: number;
  consolidatedAvailableKg: number;
  coveragePercent: number; // 0..100+
  missingKg: number;
  surplusKg: number;
  heuristicScore: number; // 0..100 heuristic prototype indicator
  estimatedWeightedPricePerKgPen?: number;
  pricePendingCount: number;
  qualityCompatible: boolean;
  availabilityCompatible: boolean;
  deliverySummary: string;
  locationSummary: string;
  breakdown: MatchVariableBreakdown[];
  pendingConfirmations: string[];
}

export interface CommercialInterest {
  id: string;
  initiatedByRole: ActiveRole;
  initiatorUserId: string;
  requestId: string;
  offerIds: string[];
  matchType: 'direct' | 'consolidated';
  buyerId: string;
  supplierIds: string[];
  message: string;
  status: 'pendiente' | 'contactado' | 'en_revision';
  createdAt: string;
}

export interface TradeEvent {
  id: string;
  isDemo?: boolean;
  title: string;
  organizer: string;
  date: string;
  location: string;
  modality: 'Presencial' | 'Híbrido' | 'Virtual';
  description: string;
  participatingSectors: string[];
  productsOfInterest: string[];
  participantCount: number;
  participatingSupplierIds: string[];
  participatingBuyerIds: string[];
  bannerImageUrl?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  role: ActiveRole;
  organizationName: string;
  productsFocus: string;
  notes: string;
  registeredAt: string;
}

export type WorkspaceSection =
  | 'dashboard'
  | 'matching'
  | 'requests'
  | 'offers'
  | 'explorer'
  | 'profiles'
  | 'stats'
  | 'events'
  | 'settings';
