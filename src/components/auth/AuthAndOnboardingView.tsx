import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Layers,
  Save,
  ShieldAlert,
  Sprout,
  UserCheck,
} from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import {
  DELIVERY_MODE_LABELS,
  INDUSTRIAL_SUBSECTORS,
  PERU_LOCATIONS,
  PRODUCT_CATALOG,
  PRODUCT_CATEGORIES,
  QUALITY_GRADES,
  SUPPLIER_TYPE_LABELS,
} from '../../data/peruCatalog';
import {
  BuyerProfile,
  BuyerType,
  CompanySize,
  CurrencyCode,
  DeliveryMode,
  DocumentType,
  PersonType,
  QualityGrade,
  SupplierMainActivity,
  SupplierProfile,
  SupplierType,
  UnitOfMeasure,
  UserAccount,
  UserRoleType,
} from '../../types/agroconnect';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface AuthAndOnboardingViewProps {
  initialMode?: 'login' | 'register';
  onOpenLanding: () => void;
}

export const AuthAndOnboardingView: React.FC<AuthAndOnboardingViewProps> = ({
  initialMode = 'login',
  onOpenLanding,
}) => {
  const {
    loginDemoAccount,
    loginWithEmail,
    upsertUserAccount,
    upsertBuyerProfile,
    upsertSupplierProfile,
    showToast,
  } = useAgroConnect();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loginEmail, setLoginEmail] = useState('compras@vallealimentos.demo.pe');
  const [loginPassword, setLoginPassword] = useState('demo1234');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Onboarding wizard step: 1 = Cuenta, 2 = Identificación, 3 = Comprador, 4 = Proveedor
  const [step, setStep] = useState<number>(1);
  const [formError, setFormError] = useState<string | null>(null);
  const [draftUserId] = useState<string>(() => `user_${Date.now()}`);

  // Etapa 1: Cuenta
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [roleType, setRoleType] = useState<UserRoleType>('buyer');
  const [personType, setPersonType] = useState<PersonType>('juridica');

  // Etapa 2: Identificación
  const [docType, setDocType] = useState<DocumentType>('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [hasRuc, setHasRuc] = useState<boolean>(false);
  const [ruc, setRuc] = useState('');
  const [legalName, setLegalName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [economicActivity, setEconomicActivity] = useState('');
  const [repName, setRepName] = useState('');
  const [repRole, setRepRole] = useState('');
  const [department, setDepartment] = useState('Lima');
  const [province, setProvince] = useState('Lima');
  const [district, setDistrict] = useState('Ate');

  // Etapa 3: Perfil Comprador
  const [buyerType, setBuyerType] = useState<BuyerType>('procesadora_alimentos');
  const [subsector, setSubsector] = useState(INDUSTRIAL_SUBSECTORS[2]);
  const [companySize, setCompanySize] = useState<CompanySize>('mediana');
  const [buyerDesc, setBuyerDesc] = useState('');
  const [finalProducts, setFinalProducts] = useState('');
  const [buyerReqCategories, setBuyerReqCategories] = useState<string[]>(['Hortalizas']);
  const [buyerReqProducts, setBuyerReqProducts] = useState<string[]>(['Tomate industrial']);
  const [buyerVarieties, setBuyerVarieties] = useState('Roma, Río Grande');
  const [monthlyVolTons, setMonthlyVolTons] = useState('15');
  const [sourcingFreq, setSourcingFreq] = useState<BuyerProfile['sourcingFrequency']>('quincenal');
  const [buyerQuality, setBuyerQuality] = useState<QualityGrade>('Grado A');
  const [techReq, setTechReq] = useState('');
  const [preferredOrigin, setPreferredOrigin] = useState('Lima, Ica');

  // Etapa 4: Perfil Proveedor
  const [supplierType, setSupplierType] = useState<SupplierType>('productor_individual');
  const [mainActivity, setMainActivity] = useState<SupplierMainActivity>('produccion_agricola');
  const [orgName, setOrgName] = useState('');
  const [supDesc, setSupDesc] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [memberCount, setMemberCount] = useState('');
  const [supCategories, setSupCategories] = useState<string[]>(['Hortalizas']);
  const [supProducts, setSupProducts] = useState<string[]>(['Tomate industrial']);
  const [supVarieties, setSupVarieties] = useState('Roma');
  const [supZone, setSupZone] = useState('');
  const [areaHa, setAreaHa] = useState('');
  const [avgProdTons, setAvgProdTons] = useState('');
  const [availTons, setAvailTons] = useState('4');
  const [harvestSeason, setHarvestSeason] = useState('Todo el año');
  const [harvestFreq, setHarvestFreq] = useState('Semanal');
  const [maxCapacityTons, setMaxCapacityTons] = useState('6');
  const [supQuality, setSupQuality] = useState<QualityGrade>('Grado A');
  const [sizeCaliber, setSizeCaliber] = useState('');
  const [maturity, setMaturity] = useState('');
  const [humidity, setHumidity] = useState('');
  const [cultConditions, setCultConditions] = useState('');
  const [certifications, setCertifications] = useState('');
  const [postHarvest, setPostHarvest] = useState('');
  const [photoUrl, setPhotoUrl] = useState('/src/assets/images/crop_tomato_industrial_1794588271950.jpg');
  const [hasOwnTransport, setHasOwnTransport] = useState(false);
  const [transportType, setTransportType] = useState('');
  const [loadCapacity, setLoadCapacity] = useState('');
  const [hasCollectionCenter, setHasCollectionCenter] = useState(false);
  const [hasStorage, setHasStorage] = useState(true);
  const [hasColdChain, setHasColdChain] = useState(false);
  const [packagingType, setPackagingType] = useState('Jabas plásticas de 20 kg');
  const [distZones, setDistZones] = useState('Lima');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('negociable');
  const [estPrice, setEstPrice] = useState('1.85');
  const [currency, setCurrency] = useState<CurrencyCode>('PEN');
  const [commUnit, setCommUnit] = useState<UnitOfMeasure>('kg');
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [minOrderQty, setMinOrderQty] = useState('500');
  const [saleModality, setSaleModality] = useState('Venta por lote o campaña');

  // Provincias y distritos dinámicos para Perú
  const selectedRegion = useMemo(
    () => PERU_LOCATIONS.find((r) => r.department === department) ?? PERU_LOCATIONS[0],
    [department]
  );
  const availableProvinces = Object.keys(selectedRegion.provinces);
  const availableDistricts = selectedRegion.provinces[province] ?? selectedRegion.provinces[availableProvinces[0]] ?? [];

  const handleDepartmentChange = (nextDept: string) => {
    setDepartment(nextDept);
    const region = PERU_LOCATIONS.find((r) => r.department === nextDept);
    if (region) {
      const firstProv = Object.keys(region.provinces)[0];
      setProvince(firstProv);
      setDistrict(region.provinces[firstProv][0] ?? '');
    }
  };

  const handleProvinceChange = (nextProv: string) => {
    setProvince(nextProv);
    const list = selectedRegion.provinces[nextProv] ?? [];
    setDistrict(list[0] ?? '');
  };

  const activeSteps = useMemo(() => {
    const base = [
      { id: 1, label: 'Cuenta' },
      { id: 2, label: 'Identificación' },
    ];
    if (roleType === 'buyer' || roleType === 'both') {
      base.push({ id: 3, label: 'Perfil Comprador' });
    }
    if (roleType === 'supplier' || roleType === 'both') {
      base.push({ id: 4, label: 'Perfil Proveedor' });
    }
    return base;
  }, [roleType]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail.includes('@')) {
      setLoginError('Ingresa un correo electrónico válido.');
      return;
    }
    if (loginPassword.length < 6) {
      setLoginError('La contraseña de acceso debe tener al menos 6 caracteres.');
      return;
    }
    const res = loginWithEmail(loginEmail);
    if (!res.ok && res.error) {
      setLoginError(res.error);
    }
  };

  const validateStep1 = (): boolean => {
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('Ingresa tus nombres y apellidos.');
      return false;
    }
    if (!email.includes('@')) {
      setFormError('Ingresa un correo electrónico válido.');
      return false;
    }
    if (phone.trim().length < 7) {
      setFormError('Ingresa un número de celular válido.');
      return false;
    }
    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (!jobTitle.trim()) {
      setFormError('Indica tu cargo o función.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (personType === 'natural') {
      if (!docNumber.trim() || docNumber.trim().length < 6) {
        setFormError('Ingresa tu número de documento.');
        return false;
      }
      if (hasRuc && ruc.trim().length !== 11) {
        setFormError('Si cuentas con RUC, debe tener 11 dígitos.');
        return false;
      }
      if (!economicActivity.trim()) {
        setFormError('Describe brevemente tu actividad económica.');
        return false;
      }
    } else {
      if (!legalName.trim() || !tradeName.trim()) {
        setFormError('Ingresa la razón social y el nombre comercial.');
        return false;
      }
      if (ruc.trim().length !== 11) {
        setFormError('El RUC de persona jurídica debe tener 11 dígitos.');
        return false;
      }
      if (!repName.trim()) {
        setFormError('Ingresa el nombre del representante.');
        return false;
      }
    }
    return true;
  };

  const buildAndPersistProgress = (completed: boolean, currentStepNum: number) => {
    const isPendingValidation = personType === 'natural' && !hasRuc;
    const validationStatus = isPendingValidation ? 'pendiente_validacion' : 'validado_demo';
    const resolvedTradeName =
      tradeName.trim() ||
      (personType === 'natural' ? `${firstName.trim()} ${lastName.trim()}` : legalName.trim());

    const buyerId = `buyer_${draftUserId}`;
    const supplierId = `sup_${draftUserId}`;

    if (roleType === 'buyer' || roleType === 'both') {
      const buyerProfile: BuyerProfile = {
        id: buyerId,
        userId: draftUserId,
        companyName: resolvedTradeName,
        buyerType,
        subsector,
        companySize,
        businessDescription:
          buyerDesc.trim() || 'Empresa compradora registrada mediante onboarding guiado.',
        finalProducts: finalProducts
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        plantLocation: {
          country: 'Perú',
          department,
          province,
          district,
        },
        rawMaterialCategories: buyerReqCategories,
        requiredProducts: buyerReqProducts,
        preferredVarieties: buyerVarieties
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        monthlyAverageVolumeTons: Number(monthlyVolTons) || undefined,
        sourcingFrequency: sourcingFreq,
        requiredQuality: buyerQuality,
        technicalRequirements: techReq.trim() || 'Por definir en ficha técnica.',
        preferredOrigin: preferredOrigin.trim() || undefined,
        profileCompletionPercent: completed ? 100 : 75,
      };
      upsertBuyerProfile(buyerProfile);
    }

    if (roleType === 'supplier' || roleType === 'both') {
      const supProfile: SupplierProfile = {
        id: supplierId,
        userId: draftUserId,
        organizationName: orgName.trim() || resolvedTradeName,
        supplierType,
        mainActivity,
        businessDescription:
          supDesc.trim() || 'Productor o proveedor agrícola registrado en AgroConnect.',
        contactPerson: contactPerson.trim() || `${firstName.trim()} ${lastName.trim()}`,
        contactRole: contactRole.trim() || jobTitle.trim() || 'Representante',
        memberCount: memberCount ? Number(memberCount) : undefined,
        validationStatus,
        productCategories: supCategories,
        cultivatedProducts: supProducts,
        varieties: supVarieties
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        productionLocation: {
          country: 'Perú',
          department,
          province,
          district,
          zone: supZone.trim() || undefined,
        },
        cultivatedAreaHa: areaHa ? Number(areaHa) : undefined,
        averageProductionTons: avgProdTons ? Number(avgProdTons) : undefined,
        marketableAvailabilityTons: availTons ? Number(availTons) : undefined,
        harvestSeason,
        harvestFrequency: harvestFreq,
        maxOfferCapacityTons: maxCapacityTons ? Number(maxCapacityTons) : undefined,
        qualityClassification: supQuality,
        sizeCaliber: sizeCaliber.trim() || undefined,
        maturity: maturity.trim() || undefined,
        humidity: humidity.trim() || undefined,
        cultivationConditions: cultConditions.trim() || undefined,
        certifications: certifications
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        postHarvestTreatments: postHarvest.trim() || undefined,
        photoUrls: photoUrl ? [photoUrl] : [],
        hasOwnTransport,
        transportType: transportType.trim() || undefined,
        loadCapacityTons: loadCapacity ? Number(loadCapacity) : undefined,
        hasCollectionCenter,
        hasStorage,
        hasColdChain,
        packagingType: packagingType.trim() || undefined,
        distributionZones: distZones
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        deliveryMode,
        estimatedPrice: estPrice ? Number(estPrice) : undefined,
        currency,
        commercialUnit: commUnit,
        priceNegotiable,
        minimumOrderQuantity: minOrderQty ? Number(minOrderQty) : undefined,
        saleModality,
        profileCompletionPercent: completed ? 100 : 75,
      };
      upsertSupplierProfile(supProfile);
    }

    const user: UserAccount = {
      id: draftUserId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      jobTitle: jobTitle.trim(),
      roleType,
      personType,
      identification: {
        personType,
        documentType: personType === 'natural' ? docType : undefined,
        documentNumber: personType === 'natural' ? docNumber.trim() : undefined,
        hasRuc: personType === 'natural' ? hasRuc : true,
        ruc: personType === 'juridica' || hasRuc ? ruc.trim() : undefined,
        legalName: personType === 'juridica' ? legalName.trim() : undefined,
        tradeName: resolvedTradeName,
        economicActivity: economicActivity.trim() || 'Actividad agrícola/agroindustrial',
        representativeName: personType === 'juridica' ? repName.trim() : undefined,
        representativeRole: personType === 'juridica' ? repRole.trim() : undefined,
        location: {
          country: 'Perú',
          department,
          province,
          district,
        },
        validationStatus,
      },
      onboardingStep: completed ? 5 : currentStepNum,
      onboardingCompleted: completed,
      buyerProfileId: roleType === 'buyer' || roleType === 'both' ? buyerId : undefined,
      supplierProfileId: roleType === 'supplier' || roleType === 'both' ? supplierId : undefined,
      createdAt: new Date().toISOString(),
    };

    upsertUserAccount(user);
    showToast(
      completed
        ? 'Registro completado. Bienvenido a AgroConnect.'
        : 'Perfil guardado parcialmente. Puedes completar los datos avanzados luego en Configuración.'
    );
  };

  const handleNextStep = () => {
    setFormError(null);
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;

    const currentIndex = activeSteps.findIndex((s) => s.id === step);
    if (currentIndex < activeSteps.length - 1) {
      setStep(activeSteps[currentIndex + 1].id);
    } else {
      buildAndPersistProgress(true, 5);
    }
  };

  const handlePrevStep = () => {
    setFormError(null);
    const currentIndex = activeSteps.findIndex((s) => s.id === step);
    if (currentIndex > 0) {
      setStep(activeSteps[currentIndex - 1].id);
    }
  };

  const handleSavePartial = () => {
    setFormError(null);
    if (!firstName.trim() || !email.includes('@')) {
      setFormError('Completa al menos tu nombre y correo en la Etapa 1 para guardar el borrador.');
      return;
    }
    buildAndPersistProgress(false, step);
  };

  const toggleArrayItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      if (arr.length > 1) setArr(arr.filter((x) => x !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#111814] flex flex-col">
      {/* Barra superior minimalista */}
      <header className="bg-white border-b border-[#DFE6E0]">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <span className="text-lg font-bold tracking-tight text-[#14532D] font-display whitespace-nowrap shrink-0">
            AgroConnect
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onOpenLanding}
              className="text-sm font-medium text-[#526058] hover:text-[#111814] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Conocer la plataforma
            </button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setFormError(null);
                setLoginError(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-[#14532D] border border-[#DFE6E0] hover:border-[#14532D] bg-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {mode === 'login' ? 'Crear cuenta nueva' : 'Ya tengo cuenta'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna principal: Login o Onboarding Progresivo */}
        <div className="lg:col-span-7 bg-white border border-[#DFE6E0] rounded-xl p-6 sm:p-8">
          {/* Selector de pestaña Acceso / Registro */}
          <div className="flex items-center gap-1 p-1 bg-[#EFF4F0] rounded-lg w-fit mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setFormError(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#111814] shadow-xs'
                  : 'text-[#526058] hover:text-[#111814]'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setLoginError(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#111814] shadow-xs'
                  : 'text-[#526058] hover:text-[#111814]'
              }`}
            >
              Registro y Onboarding guiado
            </button>
          </div>

          {mode === 'login' ? (
            <div>
              <h1 className="text-2xl font-bold font-display text-[#111814] tracking-tight mb-2">
                Ingresa a tu espacio de abastecimiento agrícola
              </h1>
              <p className="text-sm text-[#526058] mb-6">
                Accede con tu cuenta registrada o utiliza un entorno de demostración listo para probar
                el Smart Matching y la consolidación de proveedores.
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1.5">
                    Correo electrónico corporativo o personal
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ejemplo@empresa.pe"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1.5">
                    Contraseña (simulada para prototipo)
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                    required
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                    {loginError}
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors cursor-pointer"
                  >
                    Ingresar a AgroConnect
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="px-4 py-2.5 text-sm font-medium text-[#14532D] hover:underline cursor-pointer"
                  >
                    Registrar nueva organización
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-[#DFE6E0]">
                <p className="text-xs font-semibold text-[#111814] mb-3">
                  Acceso directo a cuentas de demostración (Perú)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => loginDemoAccount('buyer')}
                    className="p-3.5 text-left rounded-lg border border-[#DFE6E0] hover:border-[#14532D] bg-[#F7F9F7] transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-[#14532D] mb-2" />
                    <p className="text-xs font-bold text-[#111814]">Demo Comprador</p>
                    <p className="text-xs text-[#526058] mt-0.5">
                      Alimentos del Valle · Caso Tomate 10 t
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => loginDemoAccount('supplier')}
                    className="p-3.5 text-left rounded-lg border border-[#DFE6E0] hover:border-[#14532D] bg-[#F7F9F7] transition-colors cursor-pointer"
                  >
                    <Sprout className="w-4 h-4 text-[#15803D] mb-2" />
                    <p className="text-xs font-bold text-[#111814]">Demo Proveedor</p>
                    <p className="text-xs text-[#526058] mt-0.5">
                      Coop. Valle de Cañete · 4 t Tomate
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => loginDemoAccount('both')}
                    className="p-3.5 text-left rounded-lg border border-[#DFE6E0] hover:border-[#14532D] bg-[#F7F9F7] transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#D97706] mb-2" />
                    <p className="text-xs font-bold text-[#111814]">Demo Cuenta Dual</p>
                    <p className="text-xs text-[#526058] mt-0.5">
                      Comprador y Proveedor en un perfil
                    </p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Indicador de progreso de etapas */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h1 className="text-xl font-bold font-display text-[#111814]">
                    Onboarding progresivo
                  </h1>
                  <span className="text-xs font-mono-tabular text-[#526058]">
                    Etapa {activeSteps.findIndex((s) => s.id === step) + 1} de {activeSteps.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeSteps.map((s, idx) => {
                    const currentIdx = activeSteps.findIndex((a) => a.id === step);
                    const isDone = idx < currentIdx;
                    const isCurrent = s.id === step;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (idx <= currentIdx) setStep(s.id);
                        }}
                        className={`px-3 py-2 rounded-lg border text-left transition-colors ${
                          isCurrent
                            ? 'border-[#14532D] bg-[#EFF4F0] text-[#14532D]'
                            : isDone
                            ? 'border-[#DFE6E0] bg-white text-[#15803D] cursor-pointer'
                            : 'border-[#DFE6E0] bg-[#F7F9F7] text-[#708077]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>0{idx + 1}. {s.label}</span>
                          {isDone && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
                  {formError}
                </div>
              )}

              {/* ETAPA 1: CUENTA */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Nombres *</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Ej. María Elena"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Apellidos *</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Ej. Huamán Quispe"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Correo electrónico *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@organizacion.pe"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Número de celular *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+51 987 654 321"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Contraseña *</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres (no se guarda en texto plano)"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Cargo o función *</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Ej. Jefe de Compras / Productor"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1.5">Tipo de usuario *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(
                          [
                            { id: 'buyer', label: 'Comprador' },
                            { id: 'supplier', label: 'Proveedor' },
                            { id: 'both', label: 'Ambos' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setRoleType(opt.id)}
                            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                              roleType === opt.id
                                ? 'border-[#14532D] bg-[#14532D] text-white'
                                : 'border-[#DFE6E0] bg-white text-[#526058]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1.5">Tipo de persona *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { id: 'natural', label: 'Persona Natural' },
                            { id: 'juridica', label: 'Persona Jurídica' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setPersonType(opt.id)}
                            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                              personType === opt.id
                                ? 'border-[#14532D] bg-[#14532D] text-white'
                                : 'border-[#DFE6E0] bg-white text-[#526058]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 2: IDENTIFICACIÓN */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-[#EFF4F0] border border-[#DFE6E0] text-xs text-[#526058] flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                    <span>
                      Privacidad y alcance prototipo: el DNI, RUC y teléfono personal nunca se muestran
                      públicamente. Este prototipo no realiza validación real en línea con SUNAT.
                    </span>
                  </div>

                  {personType === 'natural' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#111814] mb-1">
                            Tipo de documento *
                          </label>
                          <select
                            value={docType}
                            onChange={(e) => setDocType(e.target.value as DocumentType)}
                            className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg bg-white focus:outline-none focus:border-[#14532D]"
                          >
                            <option value="DNI">DNI</option>
                            <option value="CE">Carné de extranjería</option>
                            <option value="Pasaporte">Pasaporte</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111814] mb-1">
                            Número de documento (privado) *
                          </label>
                          <input
                            type="text"
                            value={docNumber}
                            onChange={(e) => setDocNumber(e.target.value)}
                            placeholder="Ej. 45123456"
                            className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-[#111814]">¿Cuenta con RUC?</p>
                            <p className="text-xs text-[#526058]">
                              No exigimos RUC a agricultores independientes; el perfil quedará en estado pendiente de validación.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setHasRuc(false)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer ${
                                !hasRuc ? 'bg-[#14532D] text-white border-[#14532D]' : 'bg-white text-[#526058] border-[#DFE6E0]'
                              }`}
                            >
                              No (Pendiente validación)
                            </button>
                            <button
                              type="button"
                              onClick={() => setHasRuc(true)}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer ${
                                hasRuc ? 'bg-[#14532D] text-white border-[#14532D]' : 'bg-white text-[#526058] border-[#DFE6E0]'
                              }`}
                            >
                              Sí tengo RUC
                            </button>
                          </div>
                        </div>

                        {hasRuc && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-[#111814] mb-1">
                              Número de RUC (11 dígitos) *
                            </label>
                            <input
                              type="text"
                              value={ruc}
                              onChange={(e) => setRuc(e.target.value)}
                              maxLength={11}
                              placeholder="10..."
                              className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#111814] mb-1">Razón social *</label>
                          <input
                            type="text"
                            value={legalName}
                            onChange={(e) => setLegalName(e.target.value)}
                            placeholder="Ej. AgroProcesos del Sur S.A.C."
                            className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111814] mb-1">RUC (11 dígitos, privado) *</label>
                          <input
                            type="text"
                            value={ruc}
                            onChange={(e) => setRuc(e.target.value)}
                            maxLength={11}
                            placeholder="20..."
                            className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-[#111814] mb-1">Nombre del representante *</label>
                          <input
                            type="text"
                            value={repName}
                            onChange={(e) => setRepName(e.target.value)}
                            placeholder="Nombre completo"
                            className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#111814] mb-1">Cargo del representante</label>
                          <input
                            type="text"
                            value={repRole}
                            onChange={(e) => setRepRole(e.target.value)}
                            placeholder="Ej. Gerente General"
                            className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Nombre comercial</label>
                      <input
                        type="text"
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                        placeholder="Nombre público comercial"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Actividad económica *</label>
                      <input
                        type="text"
                        value={economicActivity}
                        onChange={(e) => setEconomicActivity(e.target.value)}
                        placeholder="Ej. Cultivo de hortalizas / Elaboración de pulpas"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  </div>

                  {/* Ubicación Perú */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">País</label>
                      <input
                        type="text"
                        value="Perú"
                        readOnly
                        className="w-full px-3 py-2 text-sm bg-[#F7F9F7] border border-[#DFE6E0] rounded-lg text-[#526058]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Departamento</label>
                      <select
                        value={department}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
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
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      >
                        {availableProvinces.map((p) => (
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
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg focus:outline-none focus:border-[#14532D]"
                      >
                        {availableDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA 3: PERFIL COMPRADOR */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Tipo de comprador</label>
                      <select
                        value={buyerType}
                        onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                      >
                        <option value="procesadora_alimentos">Procesadora de alimentos</option>
                        <option value="fabricante">Fabricante</option>
                        <option value="otro">Otro comprador industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Tamaño empresarial</label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value as CompanySize)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                      >
                        <option value="micro">Microempresa</option>
                        <option value="pequena">Pequeña empresa</option>
                        <option value="mediana">Mediana empresa</option>
                        <option value="grande">Gran empresa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Frecuencia abastecimiento</label>
                      <select
                        value={sourcingFreq}
                        onChange={(e) => setSourcingFreq(e.target.value as BuyerProfile['sourcingFrequency'])}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                      >
                        <option value="semanal">Semanal</option>
                        <option value="quincenal">Quincenal</option>
                        <option value="mensual">Mensual</option>
                        <option value="por_campana">Por campaña</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111814] mb-1">Subsector industrial</label>
                    <select
                      value={subsector}
                      onChange={(e) => setSubsector(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                    >
                      {INDUSTRIAL_SUBSECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111814] mb-1">
                      Descripción del negocio y productos finales que fabrica
                    </label>
                    <textarea
                      rows={2}
                      value={buyerDesc}
                      onChange={(e) => setBuyerDesc(e.target.value)}
                      placeholder="Describe brevemente tu planta procesadora y líneas productivas"
                      className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">
                        Productos finales (separados por coma)
                      </label>
                      <input
                        type="text"
                        value={finalProducts}
                        onChange={(e) => setFinalProducts(e.target.value)}
                        placeholder="Ej. Pasta de tomate, conservas"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">
                        Volumen promedio mensual (t) y calidad
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={monthlyVolTons}
                          onChange={(e) => setMonthlyVolTons(e.target.value)}
                          placeholder="t/mes"
                          className="w-1/2 px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                        />
                        <select
                          value={buyerQuality}
                          onChange={(e) => setBuyerQuality(e.target.value as QualityGrade)}
                          className="w-1/2 px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                        >
                          {QUALITY_GRADES.map((q) => (
                            <option key={q} value={q}>
                              {q}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111814] mb-1.5">
                      Categorías y productos agrícolas requeridos
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleArrayItem(buyerReqCategories, setBuyerReqCategories, cat)}
                          className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${
                            buyerReqCategories.includes(cat)
                              ? 'bg-[#14532D] text-white border-[#14532D]'
                              : 'bg-white text-[#526058] border-[#DFE6E0]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {PRODUCT_CATALOG.map((p) => (
                        <button
                          key={p.product}
                          type="button"
                          onClick={() => toggleArrayItem(buyerReqProducts, setBuyerReqProducts, p.product)}
                          className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${
                            buyerReqProducts.includes(p.product)
                              ? 'bg-[#EFF4F0] text-[#14532D] border-[#14532D] font-semibold'
                              : 'bg-white text-[#526058] border-[#DFE6E0]'
                          }`}
                        >
                          {p.product}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Variedades preferidas</label>
                      <input
                        type="text"
                        value={buyerVarieties}
                        onChange={(e) => setBuyerVarieties(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Origen preferido</label>
                      <input
                        type="text"
                        value={preferredOrigin}
                        onChange={(e) => setPreferredOrigin(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111814] mb-1">
                      Características técnicas requeridas (opcional)
                    </label>
                    <input
                      type="text"
                      value={techReq}
                      onChange={(e) => setTechReq(e.target.value)}
                      placeholder="Ej. Brix mínimo, porcentaje de humedad, calibre"
                      className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 4: PERFIL PROVEEDOR */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Tipo de proveedor</label>
                      <select
                        value={supplierType}
                        onChange={(e) => setSupplierType(e.target.value as SupplierType)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                      >
                        {Object.entries(SUPPLIER_TYPE_LABELS).map(([k, lbl]) => (
                          <option key={k} value={k}>
                            {lbl}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Actividad principal</label>
                      <select
                        value={mainActivity}
                        onChange={(e) => setMainActivity(e.target.value as SupplierMainActivity)}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                      >
                        <option value="produccion_agricola">Producción agrícola</option>
                        <option value="acopio">Acopio</option>
                        <option value="comercializacion">Comercialización</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">
                        Nombre del productor u organización
                      </label>
                      <input
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder={tradeName || 'Ej. Asociación Agraria Santa María'}
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">
                        Zona o comunidad de producción (opcional)
                      </label>
                      <input
                        type="text"
                        value={supZone}
                        onChange={(e) => setSupZone(e.target.value)}
                        placeholder="Ej. Valle Viejo / Sector Retes"
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#111814] mb-1.5">
                      Productos cultivados o acopiados
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRODUCT_CATALOG.map((p) => (
                        <button
                          key={p.product}
                          type="button"
                          onClick={() => {
                            toggleArrayItem(supProducts, setSupProducts, p.product);
                            if (!supCategories.includes(p.category)) {
                              setSupCategories([...supCategories, p.category]);
                            }
                          }}
                          className={`px-2.5 py-1 text-xs rounded-md border cursor-pointer ${
                            supProducts.includes(p.product)
                              ? 'bg-[#EFF4F0] text-[#14532D] border-[#14532D] font-semibold'
                              : 'bg-white text-[#526058] border-[#DFE6E0]'
                          }`}
                        >
                          {p.product}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Variedades</label>
                      <input
                        type="text"
                        value={supVarieties}
                        onChange={(e) => setSupVarieties(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Disponibilidad (t)</label>
                      <input
                        type="number"
                        value={availTons}
                        onChange={(e) => setAvailTons(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Calidad</label>
                      <select
                        value={supQuality}
                        onChange={(e) => setSupQuality(e.target.value as QualityGrade)}
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
                      <label className="block text-xs font-medium text-[#111814] mb-1">Temporada cosecha</label>
                      <input
                        type="text"
                        value={harvestSeason}
                        onChange={(e) => setHarvestSeason(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#111814] mb-1">Modalidad entrega</label>
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
                      <label className="block text-xs font-medium text-[#111814] mb-1">
                        Precio estimado ({currency}/{commUnit})
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          step="0.05"
                          value={estPrice}
                          onChange={(e) => setEstPrice(e.target.value)}
                          className="w-2/3 px-2.5 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                        />
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                          className="w-1/3 px-2 py-2 text-xs bg-white border border-[#DFE6E0] rounded-lg"
                        >
                          <option value="PEN">PEN</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-[#DFE6E0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasOwnTransport}
                        onChange={(e) => setHasOwnTransport(e.target.checked)}
                      />
                      <span>Transporte propio</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-[#DFE6E0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasCollectionCenter}
                        onChange={(e) => setHasCollectionCenter(e.target.checked)}
                      />
                      <span>Centro acopio</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-[#DFE6E0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasStorage}
                        onChange={(e) => setHasStorage(e.target.checked)}
                      />
                      <span>Almacenamiento</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-[#DFE6E0] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasColdChain}
                        onChange={(e) => setHasColdChain(e.target.checked)}
                      />
                      <span>Cadena de frío</span>
                    </label>
                  </div>

                  <p className="text-xs text-[#708077]">
                    Los campos avanzados (área exacta, calibre, humedad, certificaciones y flota) pueden
                    completarse ahora o posteriormente desde Configuración de Cuenta.
                  </p>
                </div>
              )}

              {/* Controles de navegación del wizard */}
              <div className="mt-6 pt-5 border-t border-[#DFE6E0] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#526058] border border-[#DFE6E0] hover:text-[#111814] rounded-lg cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>
                  )}
                  {step >= 2 && (
                    <button
                      type="button"
                      onClick={handleSavePartial}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#14532D] bg-[#EFF4F0] hover:bg-[#E1ECE3] rounded-lg cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar y completar después</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors cursor-pointer"
                >
                  <span>
                    {activeSteps.findIndex((s) => s.id === step) === activeSteps.length - 1
                      ? 'Finalizar y entrar'
                      : 'Continuar'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha: Contexto visual + resumen de valor */}
        <aside className="lg:col-span-5 space-y-5">
          <div className="rounded-xl overflow-hidden border border-[#DFE6E0] bg-white">
            <div className="h-52 w-full">
              <ImageWithFallback
                src="/src/assets/images/hero_agro_peru_1794588271702.jpg"
                alt="Abastecimiento agrícola conectado en Perú"
                className="w-full h-full object-cover"
                fallbackLabel="AgroConnect Perú"
              />
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold text-[#15803D] mb-1.5">
                Entorno de demostración · Mercado peruano
              </p>
              <h2 className="text-lg font-bold font-display text-[#111814] mb-2">
                Consolidación multi-proveedor para industria alimentaria
              </h2>
              <p className="text-sm text-[#526058] leading-relaxed mb-4">
                Simula el flujo completo desde la publicación de demanda industrial hasta la
                consolidación automática de varios productores y solicitud de contacto.
              </p>

              <div className="space-y-2.5 pt-3 border-t border-[#DFE6E0] text-xs text-[#526058]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#111814]">Escenario clave incluido:</strong> Demanda de 10 t de
                    Tomate Industrial cubierta por 3 proveedores (4 t + 3 t + 3 t).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <UserCheck className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#111814]">Inclusión sin barreras:</strong> Productores sin RUC
                    pueden crear su perfil en estado pendiente de validación.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Layers className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#111814]">Persistencia local:</strong> Tus cambios en solicitudes,
                    ofertas e intereses se mantienen al recargar.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
