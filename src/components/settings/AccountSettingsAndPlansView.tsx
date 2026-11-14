import React, { useState } from 'react';
import { CheckCircle2, Layers, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { INDUSTRIAL_SUBSECTORS, SUPPLIER_TYPE_LABELS } from '../../data/peruCatalog';
import { BuyerProfile, SupplierProfile, SupplierType } from '../../types/agroconnect';
import { StatusLabel } from '../common/StatusLabel';

export const AccountSettingsAndPlansView: React.FC = () => {
  const {
    currentUser,
    currentBuyerProfile,
    currentSupplierProfile,
    upsertUserAccount,
    upsertBuyerProfile,
    upsertSupplierProfile,
    resetDemoData,
    showToast,
  } = useAgroConnect();

  const [firstName, setFirstName] = useState(currentUser?.firstName ?? '');
  const [lastName, setLastName] = useState(currentUser?.lastName ?? '');
  const [jobTitle, setJobTitle] = useState(currentUser?.jobTitle ?? '');
  const [tradeName, setTradeName] = useState(currentUser?.identification.tradeName ?? '');

  // Campos de Buyer
  const [buyerSubsector, setBuyerSubsector] = useState(
    currentBuyerProfile?.subsector ?? INDUSTRIAL_SUBSECTORS[0]
  );
  const [buyerDesc, setBuyerDesc] = useState(currentBuyerProfile?.businessDescription ?? '');
  const [buyerMonthlyVol, setBuyerMonthlyVol] = useState(
    String(currentBuyerProfile?.monthlyAverageVolumeTons ?? 15)
  );

  // Campos de Supplier
  const [supOrgName, setSupOrgName] = useState(currentSupplierProfile?.organizationName ?? '');
  const [supType, setSupType] = useState<SupplierType>(
    currentSupplierProfile?.supplierType ?? 'productor_individual'
  );
  const [supDesc, setSupDesc] = useState(currentSupplierProfile?.businessDescription ?? '');
  const [supAreaHa, setSupAreaHa] = useState(
    String(currentSupplierProfile?.cultivatedAreaHa ?? '')
  );
  const [supAvailTons, setSupAvailTons] = useState(
    String(currentSupplierProfile?.marketableAvailabilityTons ?? 4)
  );

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    upsertUserAccount({
      ...currentUser,
      firstName: firstName.trim() || currentUser.firstName,
      lastName: lastName.trim() || currentUser.lastName,
      jobTitle: jobTitle.trim() || currentUser.jobTitle,
      identification: {
        ...currentUser.identification,
        tradeName: tradeName.trim() || currentUser.identification.tradeName,
      },
      onboardingCompleted: true,
      onboardingStep: 5,
    });

    if (currentBuyerProfile) {
      upsertBuyerProfile({
        ...currentBuyerProfile,
        companyName: tradeName.trim() || currentBuyerProfile.companyName,
        subsector: buyerSubsector,
        businessDescription: buyerDesc.trim() || currentBuyerProfile.businessDescription,
        monthlyAverageVolumeTons: Number(buyerMonthlyVol) || currentBuyerProfile.monthlyAverageVolumeTons,
        profileCompletionPercent: 100,
      });
    }

    if (currentSupplierProfile) {
      upsertSupplierProfile({
        ...currentSupplierProfile,
        organizationName: supOrgName.trim() || currentSupplierProfile.organizationName,
        supplierType: supType,
        businessDescription: supDesc.trim() || currentSupplierProfile.businessDescription,
        cultivatedAreaHa: supAreaHa ? Number(supAreaHa) : currentSupplierProfile.cultivatedAreaHa,
        marketableAvailabilityTons: supAvailTons
          ? Number(supAvailTons)
          : currentSupplierProfile.marketableAvailabilityTons,
        profileCompletionPercent: 100,
      });
    }

    showToast('Configuración de cuenta y perfiles actualizada.');
  };

  const handleEnableDualRole = () => {
    if (!currentUser) return;
    let nextBuyerId = currentUser.buyerProfileId;
    let nextSupplierId = currentUser.supplierProfileId;

    if (!currentBuyerProfile) {
      nextBuyerId = `buyer_${currentUser.id}`;
      const newBuyer: BuyerProfile = {
        id: nextBuyerId,
        userId: currentUser.id,
        companyName: currentUser.identification.tradeName,
        buyerType: 'procesadora_alimentos',
        subsector: INDUSTRIAL_SUBSECTORS[0],
        companySize: 'pequena',
        businessDescription: 'Perfil de comprador habilitado desde configuración de cuenta.',
        finalProducts: ['Alimentos procesados'],
        plantLocation: currentUser.identification.location,
        rawMaterialCategories: ['Hortalizas'],
        requiredProducts: ['Tomate industrial'],
        preferredVarieties: ['Roma'],
        sourcingFrequency: 'mensual',
        requiredQuality: 'Grado A',
        technicalRequirements: 'Por especificar.',
        profileCompletionPercent: 75,
      };
      upsertBuyerProfile(newBuyer);
    }

    if (!currentSupplierProfile) {
      nextSupplierId = `sup_${currentUser.id}`;
      const newSup: SupplierProfile = {
        id: nextSupplierId,
        userId: currentUser.id,
        organizationName: currentUser.identification.tradeName,
        supplierType: 'comercializador',
        mainActivity: 'comercializacion',
        businessDescription: 'Perfil de proveedor habilitado desde configuración de cuenta.',
        contactPerson: `${currentUser.firstName} ${currentUser.lastName}`,
        contactRole: currentUser.jobTitle,
        validationStatus: currentUser.identification.validationStatus,
        productCategories: ['Hortalizas'],
        cultivatedProducts: ['Tomate industrial'],
        varieties: ['Roma'],
        productionLocation: currentUser.identification.location,
        harvestSeason: 'Todo el año',
        harvestFrequency: 'Mensual',
        qualityClassification: 'Grado A',
        certifications: [],
        photoUrls: [],
        hasOwnTransport: false,
        hasCollectionCenter: false,
        hasStorage: true,
        hasColdChain: false,
        distributionZones: [currentUser.identification.location.department],
        deliveryMode: 'negociable',
        currency: 'PEN',
        commercialUnit: 'kg',
        priceNegotiable: true,
        profileCompletionPercent: 75,
      };
      upsertSupplierProfile(newSup);
    }

    upsertUserAccount({
      ...currentUser,
      roleType: 'both',
      buyerProfileId: nextBuyerId,
      supplierProfileId: nextSupplierId,
    });
    showToast('Perfil dual activado. Ahora puedes alternar entre Comprador y Proveedor en el menú.');
  };

  return (
    <div className="space-y-6">
      {/* Edición de cuenta y perfiles */}
      <form
        onSubmit={handleSaveAccount}
        className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DFE6E0]">
          <div>
            <h2 className="text-lg font-bold font-display text-[#111814]">
              Configuración de cuenta y perfiles
            </h2>
            <p className="text-xs text-[#526058]">
              Completa o actualiza tu información general y comercial guardada en este navegador.
            </p>
          </div>
          {currentUser && (
            <StatusLabel variant={currentUser.identification.validationStatus} />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#111814] mb-1">Nombres</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#111814] mb-1">Apellidos</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#111814] mb-1">Cargo</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#111814] mb-1">Nombre comercial</label>
            <input
              type="text"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
            />
          </div>
        </div>

        {currentBuyerProfile && (
          <div className="pt-4 border-t border-[#DFE6E0] space-y-3">
            <h3 className="text-sm font-bold font-display text-[#14532D]">
              Datos del Perfil Comprador
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#111814] mb-1">
                  Subsector industrial
                </label>
                <select
                  value={buyerSubsector}
                  onChange={(e) => setBuyerSubsector(e.target.value)}
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
                  Volumen mensual promedio declarado (t)
                </label>
                <input
                  type="number"
                  value={buyerMonthlyVol}
                  onChange={(e) => setBuyerMonthlyVol(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#111814] mb-1">
                Descripción de la empresa
              </label>
              <textarea
                rows={2}
                value={buyerDesc}
                onChange={(e) => setBuyerDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
              />
            </div>
          </div>
        )}

        {currentSupplierProfile && (
          <div className="pt-4 border-t border-[#DFE6E0] space-y-3">
            <h3 className="text-sm font-bold font-display text-[#14532D]">
              Datos del Perfil Proveedor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#111814] mb-1">
                  Nombre de organización o productor
                </label>
                <input
                  type="text"
                  value={supOrgName}
                  onChange={(e) => setSupOrgName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#111814] mb-1">
                  Tipo de proveedor
                </label>
                <select
                  value={supType}
                  onChange={(e) => setSupType(e.target.value as SupplierType)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DFE6E0] rounded-lg"
                >
                  {Object.entries(SUPPLIER_TYPE_LABELS).map(([k, lbl]) => (
                    <option key={k} value={k}>
                      {lbl}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Área (ha)</label>
                  <input
                    type="number"
                    value={supAreaHa}
                    onChange={(e) => setSupAreaHa(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111814] mb-1">Disp. (t)</label>
                  <input
                    type="number"
                    value={supAvailTons}
                    onChange={(e) => setSupAvailTons(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#111814] mb-1">
                Descripción comercial del productor
              </label>
              <textarea
                rows={2}
                value={supDesc}
                onChange={(e) => setSupDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#DFE6E0] rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[#DFE6E0] flex flex-wrap items-center justify-between gap-3">
          {currentUser?.roleType !== 'both' ? (
            <button
              type="button"
              onClick={handleEnableDualRole}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#14532D] bg-[#EFF4F0] hover:bg-[#E1ECE3] rounded-lg cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Habilitar también rol complementario (Cuenta Dual)</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-[#15803D] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Cuenta Dual activa (Comprador + Proveedor)</span>
            </span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar cambios</span>
          </button>
        </div>
      </form>

      {/* Modelo Operativo B2B del Prototipo */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-base font-bold font-display text-[#111814]">
            Modelo Operativo del Prototipo B2B
          </h3>
          <p className="text-xs text-[#526058] mt-1">
            En este MVP todas las herramientas de Smart Matching, consolidación, exploradores y
            eventos están desbloqueadas para evaluación técnica de la agroindustria peruana. No existen cobros de suscripción ni pasarelas bancarias activas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-[#DFE6E0] bg-[#F7F9F7] flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold font-display text-[#111814]">
                Productores y Organizaciones Agrarias
              </h4>
              <p className="text-xs text-[#526058] mt-0.5">
                Para agricultores independientes, cooperativas y centros de acopio regional
              </p>
              <p className="text-xl font-bold font-mono-tabular text-[#14532D] mt-3 mb-4">
                S/ 0 · Acceso Abierto Piloto
              </p>
              <ul className="space-y-2 text-xs text-[#526058]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Publicación ilimitada de lotes disponibles por valle y variedad</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Participación en consolidaciones multi-proveedor</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Registro inclusivo con DNI sin exigencia inicial de RUC</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-[#DFE6E0] text-xs text-[#15803D] font-medium">
              Acceso libre y sin arancel de intermediación
            </div>
          </div>

          <div className="p-5 rounded-xl border border-[#14532D] bg-white flex flex-col justify-between">
            <div>
              <h4 className="text-base font-bold font-display text-[#111814]">
                Industria Alimentaria y Agroexportación
              </h4>
              <p className="text-xs text-[#526058] mt-0.5">
                Para plantas procesadoras, fabricantes y compradores a gran escala
              </p>
              <p className="text-xl font-bold font-mono-tabular text-[#14532D] mt-3 mb-4">
                Validación Institucional · Sin Arancel
              </p>
              <ul className="space-y-2 text-xs text-[#526058]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Smart Matching y propuestas automáticas de consolidación</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Búsqueda avanzada de proveedores, eventos y contacto directo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                  <span>Desglose transparente de las 10 variables agronómicas de coincidencia</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-[#DFE6E0] text-xs text-[#14532D] font-medium">
              Habilitado para pruebas y evaluación de abastecimiento
            </div>
          </div>
        </div>
      </section>

      {/* Gestión de persistencia local */}
      <section className="bg-white border border-[#DFE6E0] rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold font-display text-[#111814]">
            Datos de demostración y almacenamiento local
          </h3>
          <p className="text-xs text-[#526058] mt-0.5">
            Los cambios se guardan en <code className="font-mono-tabular">localStorage</code>. Puedes
            reiniciar en cualquier momento al escenario inicial del Perú (incluyendo el caso Tomate 10 t).
          </p>
        </div>
        <button
          type="button"
          onClick={resetDemoData}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#111814] bg-[#EFF4F0] hover:bg-[#E1ECE3] border border-[#DFE6E0] rounded-lg cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restaurar datos demo</span>
        </button>
      </section>
    </div>
  );
};
