import React from 'react';
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Truck } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface LandingViewProps {
  onGoToAuth: (initialTab?: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onGoToAuth }) => {
  const { loginDemoAccount } = useAgroConnect();

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#111814] flex flex-col">
      {/* Top Bar Contract: 3 zonas exactas separadas por gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#DFE6E0]">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <a
            href="#inicio"
            className="text-lg font-bold tracking-tight text-[#14532D] whitespace-nowrap shrink-0 font-display"
          >
            AgroConnect
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#526058]">
            <a href="#problema" className="hover:text-[#111814] transition-colors whitespace-nowrap shrink-0">
              Problema
            </a>
            <a href="#consolidacion" className="hover:text-[#111814] transition-colors whitespace-nowrap shrink-0">
              Consolidación
            </a>
            <a href="#perfiles" className="hover:text-[#111814] transition-colors whitespace-nowrap shrink-0">
              Perfiles
            </a>
            <a href="#planes" className="hover:text-[#111814] transition-colors whitespace-nowrap shrink-0">
              Planes SaaS
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onGoToAuth('login')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Ingresar o registrarse
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section id="inicio" className="max-w-[1200px] mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium text-[#15803D] mb-3">
                Plataforma B2B AgTech · Abastecimiento Agrícola en Perú (Prototipo MVP)
              </p>
              <h1
                className="font-display font-bold tracking-tight text-[#111814] leading-[1.1] mb-5"
                style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
              >
                Consolidación inteligente entre productores agrícolas e industria alimentaria
              </h1>
              <p className="text-base text-[#526058] leading-relaxed mb-7 max-w-xl">
                Cuando un solo productor no alcanza el volumen requerido por una planta procesadora,
                AgroConnect agrupa ofertas compatibles en variedad, calidad, fecha y logística mediante
                Smart Matching multi-proveedor.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => loginDemoAccount('buyer')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Probar Demo Comprador</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => loginDemoAccount('supplier')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#14532D] bg-white border border-[#DFE6E0] hover:border-[#14532D]/40 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Probar Demo Proveedor</span>
                </button>
                <button
                  type="button"
                  onClick={() => onGoToAuth('register')}
                  className="px-3 py-2.5 text-sm font-medium text-[#526058] hover:text-[#111814] underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Crear cuenta guiada
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] rounded-xl overflow-hidden border border-[#DFE6E0] bg-white">
                <ImageWithFallback
                  src="/src/assets/images/hero_agro_peru_1794588271702.jpg"
                  alt="Valle agrícola peruano y centro logístico agroindustrial"
                  className="w-full h-full object-cover"
                  fallbackLabel="AgroConnect · Infraestructura agrícola peruana"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Caso demostrativo de consolidación */}
        <section id="consolidacion" className="border-y border-[#DFE6E0] bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-12">
            <div className="max-w-2xl mb-8">
              <p className="text-xs font-medium text-[#B45309] mb-2">
                Escenario demostrativo precargado
              </p>
              <h2 className="text-2xl font-bold font-display text-[#111814] tracking-tight mb-2">
                Cómo cubrimos una demanda de 10 t cuando ningún productor individual llega al total
              </h2>
              <p className="text-sm text-[#526058]">
                Una procesadora en Ate, Lima solicita 10 toneladas de Tomate Industrial Grado A.
                El motor descarta lotes incompatibles (como Grado B) y consolida tres ofertas compatibles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl border border-[#DFE6E0] bg-[#F7F9F7]">
                <p className="text-xs text-[#526058] mb-1">01 · Solicitud industrial</p>
                <p className="text-lg font-bold font-display text-[#111814]">Tomate industrial · 10 t</p>
                <p className="text-xs text-[#526058] mt-2">
                  Grado A · Variedad Roma/compatible · Entrega en Lima · Objetivo S/ 1.90/kg
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#DFE6E0] bg-[#F7F9F7]">
                <p className="text-xs text-[#526058] mb-1">02 · Aportes consolidados</p>
                <p className="text-lg font-bold font-display text-[#14532D] font-mono-tabular">
                  4 t + 3 t + 3 t = 10 t
                </p>
                <p className="text-xs text-[#526058] mt-2">
                  Cañete (4 t) · Huaral (3 t) · Chincha (3 t) unidos sin duplicar inventario
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#DFE6E0] bg-[#F7F9F7]">
                <p className="text-xs text-[#526058] mb-1">03 · Cobertura heurística</p>
                <p className="text-lg font-bold font-display text-[#15803D] font-mono-tabular">
                  100% cubierto
                </p>
                <p className="text-xs text-[#526058] mt-2">
                  Desglose transparente de 10 variables para iniciar contacto directo
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mecanismo y perfiles */}
        <section id="problema" className="max-w-[1200px] mx-auto px-6 py-12">
          <div id="perfiles" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#DFE6E0] bg-white">
              <Layers className="w-5 h-5 text-[#14532D] mb-3" />
              <h3 className="text-base font-bold font-display text-[#111814] mb-2">
                01. Smart Matching de 10 variables
              </h3>
              <p className="text-sm text-[#526058] leading-relaxed">
                Evalúa cultivo, variedad, volumen normalizado, calidad, ventana de cosecha, ubicación,
                precio referencial, entrega y capacidad logística sin mezclar calidades incompatibles.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#DFE6E0] bg-white">
              <Truck className="w-5 h-5 text-[#14532D] mb-3" />
              <h3 className="text-base font-bold font-display text-[#111814] mb-2">
                02. Perfiles duales sin fricción
              </h3>
              <p className="text-sm text-[#526058] leading-relaxed">
                Una organización puede operar como Comprador y Proveedor en la misma cuenta, alternando
                de vista al instante. Agricultores independientes pueden registrarse sin RUC obligatorio.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#DFE6E0] bg-white">
              <ShieldCheck className="w-5 h-5 text-[#14532D] mb-3" />
              <h3 className="text-base font-bold font-display text-[#111814] mb-2">
                03. Privacidad y trazabilidad demo
              </h3>
              <p className="text-sm text-[#526058] leading-relaxed">
                DNI, RUC y teléfonos personales permanecen ocultos en los perfiles comerciales públicos.
                Los datos declarados se distinguen claramente de los indicadores calculados.
              </p>
            </div>
          </div>
        </section>

        {/* Planes SaaS (referencial) */}
        <section id="planes" className="border-t border-[#DFE6E0] bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold font-display text-[#111814] tracking-tight">
                  Modelo SaaS referencial (Demo sin cobros)
                </h2>
                <p className="text-sm text-[#526058] mt-1">
                  Todas las funcionalidades del MVP están habilitadas para evaluación; no existen cobros reales.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onGoToAuth('login')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Ir a Inicio de Sesión
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl border border-[#DFE6E0] bg-[#F7F9F7]">
                <p className="text-xs font-medium text-[#526058]">Para productores y asociaciones</p>
                <h3 className="text-lg font-bold font-display text-[#111814] mt-1">Plan Campo Inicial</h3>
                <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mt-2">S/ 0 / mes</p>
                <ul className="mt-4 space-y-2 text-xs text-[#526058]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span>Publicación de lotes disponibles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span>Inclusión en consolidaciones</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-[#14532D] bg-white">
                <p className="text-xs font-medium text-[#15803D]">Para procesadoras medianas</p>
                <h3 className="text-lg font-bold font-display text-[#111814] mt-1">Plan Industria Pro</h3>
                <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mt-2">S/ 390 / mes</p>
                <ul className="mt-4 space-y-2 text-xs text-[#526058]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span>Smart Matching y consolidación ilimitada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span>Filtros avanzados y eventos comerciales</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-xl border border-[#DFE6E0] bg-[#F7F9F7]">
                <p className="text-xs font-medium text-[#526058]">Para acopiadores y agroexportadoras</p>
                <h3 className="text-lg font-bold font-display text-[#111814] mt-1">Plan Red Dual</h3>
                <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mt-2">USD 160 / mes</p>
                <ul className="mt-4 space-y-2 text-xs text-[#526058]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span>Perfil dual Comprador + Proveedor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span>Analítica de demanda regional</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DFE6E0] bg-[#F7F9F7] py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#708077]">
          <span>AgroConnect MVP · Prototipo B2B AgTech para el mercado peruano</span>
          <span>Datos de demostración ficticios · Sin integración real con SUNAT ni pasarelas de pago</span>
        </div>
      </footer>
    </div>
  );
};
