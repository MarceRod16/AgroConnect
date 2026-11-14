import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAgroConnect } from '../../context/AgroConnectContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface LandingViewProps {
  onGoToAuth: (initialTab?: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onGoToAuth }) => {
  const { loginDemoAccount } = useAgroConnect();

  return (
    <div className="min-h-screen bg-[#F7F9F7] text-[#111814] flex flex-col">
      {/* Top Bar: Navegación sobria sin desenfoque ornamental */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#DFE6E0]">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <a
            href="#inicio"
            className="text-lg font-bold tracking-tight text-[#14532D] whitespace-nowrap shrink-0 font-display"
          >
            AgroConnect
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#526058]">
            <a href="#inicio" className="hover:text-[#111814] transition-colors whitespace-nowrap shrink-0">
              Inicio
            </a>
            <a href="#consolidacion" className="hover:text-[#111814] transition-colors whitespace-nowrap shrink-0">
              Consolidación
            </a>
            <a href="#mecanismo" className="hover:text-[#111814] transition-colors whitespace-nowrap shrink-0">
              Smart Matching
            </a>
            <a href="#modelo-operativo" className="hover:text-[#111814] transition-colors whitespace-nowrap shrink-0">
              Modelo Operativo
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onGoToAuth('login')}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Ingresar o registrarse
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero: Tipografía intencional sin badges flotantes */}
        <section id="inicio" className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <h1
                className="font-display font-bold tracking-tight text-[#111814] leading-[1.1] mb-5"
                style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
              >
                Consolidación inteligente entre productores agrícolas e industria alimentaria
              </h1>
              <p className="text-base text-[#526058] leading-relaxed mb-8 max-w-xl">
                Cuando un solo productor no alcanza el volumen requerido por una planta procesadora,
                AgroConnect agrupa ofertas compatibles en variedad, calidad, fecha de cosecha y logística
                mediante Smart Matching multi-proveedor.
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
              <div className="h-full min-h-[300px] rounded-xl overflow-hidden border border-[#DFE6E0] bg-white shadow-none">
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

        {/* Componente Insignia: Ecuación Continua de Consolidación */}
        <section id="consolidacion" className="border-y border-[#DFE6E0] bg-white py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-[#111814] tracking-tight mb-3">
                Cómo cubrimos una demanda de 10 t cuando ningún productor individual llega al total
              </h2>
              <p className="text-sm text-[#526058] leading-relaxed">
                Escenario demostrativo precargado: Una planta procesadora en Ate (Lima) solicita 10 toneladas de Tomate
                Industrial Grado A. El algoritmo descarta automáticamente lotes incompatibles (como partidas Grado B) y
                consolida tres ofertas compatibles sin duplicación de inventario.
              </p>
            </div>

            {/* Barra Continua de Consolidación */}
            <div className="rounded-xl border border-[#DFE6E0] bg-[#F7F9F7] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#DFE6E0]">
                {/* Paso 1: Solicitud Industrial */}
                <div className="lg:col-span-4 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#526058]">Demanda Industrial</span>
                    <h3 className="text-xl font-bold font-display text-[#111814] mt-1 mb-2">
                      Tomate industrial · 10 t
                    </h3>
                    <p className="text-xs text-[#526058] leading-relaxed">
                      Requerimiento: Grado A · Variedad Roma · Entrega en planta Ate · Precio objetivo S/ 1.90/kg
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#DFE6E0]/60 text-xs text-[#708077]">
                    Tolerancia estricta: No admite mezcla con Grado B
                  </div>
                </div>

                {/* Paso 2: Aportes Consolidados (Ecuación) */}
                <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-white">
                  <div>
                    <span className="text-xs font-medium text-[#14532D]">Aportes Multi-Lote Compatibles</span>
                    <div className="text-2xl font-bold font-display text-[#14532D] font-mono-tabular mt-1 mb-2 tracking-tight">
                      4 t + 3 t + 3 t = 10 t
                    </div>
                    <p className="text-xs text-[#526058] leading-relaxed">
                      Cañete (4 t, Coop. Valle de Cañete) · Huaral (3 t) · Chincha (3 t). Tres orígenes compatibles en
                      ventana de cosecha, calidad y logística de transporte.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#DFE6E0]/60 text-xs text-[#15803D] font-medium">
                    Inventario validado: Cada lote comprometido exactamente una vez
                  </div>
                </div>

                {/* Paso 3: Cobertura Validada */}
                <div className="lg:col-span-3 p-6 flex flex-col justify-between bg-[#F7F9F7]">
                  <div>
                    <span className="text-xs font-medium text-[#15803D]">Resultado Heurístico</span>
                    <div className="text-2xl font-bold font-display text-[#15803D] font-mono-tabular mt-1 mb-2">
                      100% Cubierto
                    </div>
                    <p className="text-xs text-[#526058] leading-relaxed">
                      10 variables agronómicas evaluadas. Listo para emitir orden de compra y coordinar acopio.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#DFE6E0]/60 text-xs text-[#708077]">
                    Lote Grado B de Barranca excluido por calidad
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Matching de 10 Variables y Perfiles: Layout Asimétrico 7:5 */}
        <section id="mecanismo" className="max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold font-display text-[#111814] tracking-tight mb-3">
              Smart Matching de 10 variables agronómicas
            </h2>
            <p className="text-sm text-[#526058] leading-relaxed">
              El motor algorítmico evalúa la compatibilidad comercial y operativa en tiempo real, distinguiendo los datos
              declarados por las partes de los indicadores calculados de viabilidad logística.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Matriz Técnica de 10 Variables (7 columnas) */}
            <div className="lg:col-span-7 p-6 lg:p-8 rounded-xl border border-[#DFE6E0] bg-white">
              <h3 className="text-lg font-bold font-display text-[#111814] mb-2">
                Matriz de Variables Evaluadas
              </h3>
              <p className="text-xs text-[#526058] mb-6">
                Cada coincidencia desglosa transparentemente los siguientes factores de cumplimiento:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">01. Cultivo Agrícola</p>
                  <p className="text-[#526058]">Coincidencia botánica estricta sin mezcla de productos distintos.</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">02. Variedad</p>
                  <p className="text-[#526058]">Evaluación de variedades compatibles para proceso industrial.</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">03. Volumen Normalizado</p>
                  <p className="text-[#526058]">Conversión de sacos (50 kg) y quintales (46 kg) a kilogramos y toneladas.</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">04. Calidad y Grado</p>
                  <p className="text-[#526058]">Exclusión absoluta de lotes que no cumplan el estándar exigido (A/B/Exp).</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">05. Ventana Temporal</p>
                  <p className="text-[#526058]">Traslape garantizado entre cosecha disponible y fecha de recepción.</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">06. Ubicación de Origen</p>
                  <p className="text-[#526058]">Valle de producción y punto de acopio (Cañete, Huaral, Chincha).</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">07. Destino Industrial</p>
                  <p className="text-[#526058]">Planta de procesamiento para cálculo de cercanía y rutas viales.</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">08. Precio Objetivo</p>
                  <p className="text-[#526058]">Alineación referencial por kilogramo en moneda nacional (PEN) o USD.</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">09. Condiciones de Entrega</p>
                  <p className="text-[#526058]">Modalidad en chacra (origen), puesta en planta (destino) o negociable.</p>
                </div>

                <div className="p-3 rounded-lg border border-[#DFE6E0] bg-[#F7F9F7]">
                  <p className="font-semibold text-[#111814] mb-1">10. Capacidad Logística</p>
                  <p className="text-[#526058]">Disponibilidad de transporte propio, centro de acopio y cadena de frío.</p>
                </div>
              </div>
            </div>

            {/* Perfiles Duales e Inclusión Rural (5 columnas) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-xl border border-[#DFE6E0] bg-white">
                <h3 className="text-base font-bold font-display text-[#111814] mb-2">
                  Perfiles duales sin fricción
                </h3>
                <p className="text-sm text-[#526058] leading-relaxed">
                  Una misma organización (como una empresa de acopio o agroindustria intermedia) puede operar como
                  Comprador y Proveedor en la misma cuenta, alternando instantáneamente de vista desde el menú lateral
                  sin necesidad de cerrar sesión.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[#DFE6E0] bg-white">
                <h3 className="text-base font-bold font-display text-[#111814] mb-2">
                  Inclusión para la agricultura familiar
                </h3>
                <p className="text-sm text-[#526058] leading-relaxed mb-3">
                  Los pequeños agricultores independientes pueden registrarse con DNI y publicar sus ofertas bajo el
                  estado <span className="font-medium text-[#111814]">pendiente de validación</span>, permitiendo su
                  inclusión comercial en acopios consolidados sin exigir trabas burocráticas previas.
                </p>
                <p className="text-xs text-[#708077] border-t border-[#DFE6E0]/60 pt-3">
                  Privacidad demo: DNI, RUC y teléfonos personales permanecen protegidos y fuera del directorio público.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Modelo Operativo Institucional (Sustituye la tabla SaaS de consumo) */}
        <section id="modelo-operativo" className="border-t border-[#DFE6E0] bg-white py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold font-display text-[#111814] tracking-tight mb-2">
                Modelo Operativo del Prototipo B2B
              </h2>
              <p className="text-sm text-[#526058]">
                Todas las capacidades del MVP están habilitadas para evaluación técnica de compradores industriales y
                organizaciones agrarias en Perú. No existen cobros de suscripción ni pasarelas financieras en esta fase.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Panel Productores */}
              <div className="p-6 lg:p-8 rounded-xl border border-[#DFE6E0] bg-[#F7F9F7] flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#111814]">
                    Productores y Organizaciones Agrarias
                  </h3>
                  <p className="text-xs text-[#526058] mt-1 mb-4">
                    Para agricultores independientes, cooperativas y centros de acopio regional
                  </p>
                  <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mb-6">
                    S/ 0 · Acceso Abierto Piloto
                  </p>
                  <ul className="space-y-3 text-xs text-[#526058]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Publicación de lotes agrícolas disponibles por valle y variedad</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Inclusión automática en propuestas de consolidación multi-proveedor</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Registro inclusivo con DNI sin exigencia inicial de RUC</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Contacto directo con jefes de abastecimiento de plantas industriales</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#DFE6E0]">
                  <button
                    type="button"
                    onClick={() => loginDemoAccount('supplier')}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-[#14532D] bg-white border border-[#DFE6E0] hover:border-[#14532D]/40 rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Ingresar con cuenta Demo Proveedor
                  </button>
                </div>
              </div>

              {/* Panel Industria */}
              <div className="p-6 lg:p-8 rounded-xl border border-[#14532D] bg-white flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-[#111814]">
                    Industria Alimentaria y Agroexportación
                  </h3>
                  <p className="text-xs text-[#526058] mt-1 mb-4">
                    Para plantas procesadoras, fabricantes y compradores a gran escala
                  </p>
                  <p className="text-2xl font-bold font-mono-tabular text-[#14532D] mb-6">
                    Validación Institucional · Sin Arancel
                  </p>
                  <ul className="space-y-3 text-xs text-[#526058]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Generación de solicitudes de compra con especificaciones técnicas estrictas</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Smart Matching con consolidación de 2 a 4 lotes compatibles</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Desglose analítico de las 10 variables agronómicas de coincidencia</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Acceso al directorio de eventos comerciales y calendario de cosecha</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#DFE6E0]">
                  <button
                    type="button"
                    onClick={() => loginDemoAccount('buyer')}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#0F3F22] rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Ingresar con cuenta Demo Comprador
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#DFE6E0] bg-[#F7F9F7] py-8">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#708077]">
          <span>AgroConnect MVP · Prototipo B2B AgTech para el mercado agroindustrial peruano</span>
          <span>Datos de demostración precargados para evaluación técnica · Sin pasarelas de pago ni consulta oficial SUNAT</span>
        </div>
      </footer>
    </div>
  );
};
