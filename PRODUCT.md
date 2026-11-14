# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Compradores Industriales:** Gerentes de abastecimiento, jefes de planta y responsables de compras de empresas procesadoras de alimentos, agroindustrias y exportadoras en Perú. Su necesidad crítica es asegurar abastecimiento continuo de grandes volúmenes (e.g., 10 a 50 toneladas) con especificaciones estrictas de calidad (Grado A/B, variedades industriales específicas como Tomate Roma, ventanas de entrega exactas y trazabilidad sanitaria).
- **Proveedores Agrícolas:** Agricultores independientes (pequeña y mediana agricultura familiar), asociaciones de productores, cooperativas agrarias (e.g., Cooperativa Agraria Valle de Cañete), centros de acopio y comercializadores mayoristas. Su desafío es colocar sus cosechas a precios justos sin quedar excluidos por no alcanzar de forma individual las escalas que exige la gran industria.
- **Operadores Duales:** Organizaciones mixtas (e.g., acopiadores o agroindustrias intermedias) que compran materia prima en ciertas campañas o valles y simultáneamente ofertan lotes consolidados o excedentes en otros rubros.

## Product Purpose

AgroConnect existe para resolver la brecha estructural de escala y fragmentación en el agro peruano. Conecta la demanda de grandes plantas procesadoras con la oferta atomizada de valles costeros y andinos mediante **Smart Matching con consolidación multi-proveedor**. Cuando una procesadora requiere un volumen que ningún productor individual puede satisfacer por sí solo (e.g., 10 toneladas de Tomate Industrial Grado A), el sistema agrupa de manera determinista lotes compatibles en cultivo, variedad, calidad, calendario y logística, permitiendo compras industriales unificadas y acceso directo al mercado para los productores.

## Positioning

Frente a marketplaces de anuncios genéricos o directorios agrícolas estáticos, AgroConnect se posiciona como una **plataforma B2B transaccional y determinista con motor de consolidación inteligente**. No es un muro de clasificados ni una red social agrícola: es un sistema que calcula viabilidad técnica y logística sobre 10 variables agronómicas concretas, sumando lotes compatibles (4 t + 3 t + 3 t = 10 t) sin duplicar inventarios ni degradar exigencias de calidad.

## Operating Context

- **Geografía y Logística Agraria Peruana:** Valles de la costa y sierra (Cañete, Huaral, Chincha, Barranca, Virú, Ica, Ate/Lima). Rutas de transporte terrestre, centros de acopio regional, condiciones de entrega en chacra vs. puesta en planta industrial.
- **Unidades Tradicionales y Normalización:** Convivencia operativa de unidades tradicionales (quintales de 46 kg, sacos de 50 kg, kilogramos y toneladas métricas).
- **Temporalidad:** Ventanas de cosecha estrechas (fechas de inicio y fin de recolección) combinadas con cronogramas de procesamiento industrial estricto.

## Capabilities and Constraints

- **Motor de Matching de 10 Variables:** Evaluación algorítmica de producto, variedad (obligatoria u opcional), volumen normalizado a kg, grado de calidad, ventana de cosecha vs. entrega, departamento de origen vs. planta de destino, precio objetivo referencial, condiciones de entrega (origen/destino) y capacidad logística (flete propio, acopio, frío).
- **Consolidación Sin Dilución:** Prohibición estricta de mezclar calidades incompatibles (un lote Grado B jamás se consolida para una demanda Grado A) o variedades no autorizadas.
- **Registro Inclusivo:** Registro progresivo adaptado al campo peruano que permite la incorporación de agricultores independientes sin RUC inicial (`pendiente_validacion`), distinguiéndolos de cooperativas o empresas con RUC verificado.
- **Transparencia de Datos del Prototipo:** Persistencia en `localStorage` (`agroconnect_mvp_state_v1`). Identificación explícita de datos de demostración, sin simular conexiones ficticias a pasarelas de pago o APIs gubernamentales (SUNAT/RENIEC).

## Brand Commitments

- **Nombre:** AgroConnect.
- **Voz y Tono:** Profesional, técnico, riguroso, institucional y sobrio. Habla el lenguaje del agrónomo, del jefe de planta y del dirigente cooperativo, no el de un pitch publicitario de Silicon Valley.
- **Identidad Visual:** Inspirada en la sobriedad del campo productivo peruano: verdes botánicos profundos, superficies minerales limpias, tipografía estructurada de alta legibilidad y precisión tabular.
- **Cero Artificio:** Prohibición absoluta de jerga vacía, promesas no respaldadas por el software y clichés visuales de inteligencia artificial.

## Evidence on Hand & Anti-Fabrication Mandate

- **Datos y Modelos Reales del Código:** Catálogo de cultivos peruanos con variedades y calidades comerciales (`src/data/peruCatalog.ts`), semillas de datos de cooperativas y procesadoras reales (`src/data/demoSeed.ts`) y motor de matching auditable (`src/services/matchingEngine.ts`).
- **Escenario Demostrativo Estrella:** Demanda de 10 t de Tomate Industrial Grado A para procesadora en Ate, cubierta al 100% por 3 cooperativas de Cañete (4 t), Huaral (3 t) y Chincha (3 t).
- **Prohibición Estricta de Prueba Social Simulada (Zero Fake Social Proof):**
  - **Queda estrictamente prohibido inventar o incluir testimonios ficticios** (e.g., citas de "Juan Pérez, Agricultor Satisfecho"), calificaciones de 5 estrellas inventadas ("4.9/5 basado en 500+ agricultores"), logotipos inventados de clientes o métricas de vanidad artificiales ("+10,000 toneladas transaccionadas" si no existen en el sistema).
  - La credibilidad del producto descansa en su motor algorítmico verificable y en sus datos demostrativos transparentes. Todo dato numérico en pantalla debe provenir de cálculos reales sobre lotes activos o estar explícitamente etiquetado como escenario de demostración.
- **Prohibición de Etiquetas y Rellenos Genéricos:**
  - Prohibido el uso de etiquetas de relleno en mayúsculas espaciadas (`FEATURES`, `WHY CHOOSE US`, `OUR MISSION`). La jerarquía debe comunicarse mediante títulos directos y contenido sustantivo.

## Product Principles

1. **Verdad Operativa y Cero Falsificación:** Cada cifra, porcentaje de compatibilidad y lote proviene de un cálculo real o de un caso demostrativo declarado. No se inventan clientes, citas de apoyo, métricas de éxito infladas ni sellos de certificación inexistentes.
2. **Rechazo a los Clichés Genéricos de IA:** Prohibición expresa de los patrones predeterminados de la IA generativa: no a degradados púrpura/cian, no a insignias o badges repetitivos encima de cada encabezado, no a cuadrículas genéricas de 3 tarjetas con íconos Lucide, no a microetiquetas en mayúsculas espaciadas.
3. **Consolidación con Rigor Agronómico:** El motor prioriza la compatibilidad estricta sobre la cantidad. La consolidación existe para resolver problemas logísticos reales, no para crear combinaciones imposibles en el campo.
4. **Claridad Tipográfica y Espaciado Nítido:** La interfaz se organiza mediante jerarquía tipográfica intencional, espaciado generoso y ritmo editorial claro. Los datos clave (tonelajes, fechas, precios) se destacan con fuentes tabulares legibles.
5. **Inclusión Pragmática para la Realidad Rural:** Reconocimiento de las condiciones del agricultor peruano sin exigir barreras burocráticas inmediatas que impidan la digitalización del acopio.

## Accessibility & Inclusion

- Contraste tipográfico elevado (mínimo 4.5:1 en texto regular y 3:1 en encabezados) para legibilidad en pantallas móviles bajo luz solar en campo.
- Soporte para navegación completa por teclado y etiquetas accesibles en controles interactivos.
- Respeto estricto a las preferencias del sistema para reducción de movimiento (`prefers-reduced-motion`).
