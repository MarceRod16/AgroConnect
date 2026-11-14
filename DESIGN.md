---
name: AgroConnect
description: Sistema de diseño para plataforma B2B de consolidación inteligente y abastecimiento agrícola peruano.
colors:
  primary: "#14532D"
  primary-hover: "#0F3F22"
  agro-green: "#15803D"
  accent-amber: "#D97706"
  accent-amber-soft: "#FEF3C7"
  canvas: "#F7F9F7"
  surface: "#FFFFFF"
  subtle: "#EFF4F0"
  border-hairline: "#DFE6E0"
  text-primary: "#111814"
  text-secondary: "#526058"
  text-muted: "#708077"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2.15rem, 3.6vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  label:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
---

# Design System: AgroConnect

## Overview

**Creative North Star: "The Agrarian Exchange" (La Mesa Agroindustrial)**

AgroConnect es una plataforma de negociación y consolidación B2B de alto rigor técnico para el mercado agroalimentario peruano. Su identidad visual debe transmitir la solidez de una bolsa de productos agrarios, la precisión de una orden de compra industrial y la autenticidad del campo productivo. El entorno gráfico rechaza de plano la estética de plantilla genérica de startup tecnológica y adopta un lenguaje visual utilitario, sobrio y de alta densidad de información real.

Este sistema de diseño prohíbe explícitamente los patrones clichés de la inteligencia artificial generativa: queda vetado el uso de degradados púrpura/cian, los distintivos o badges repetitivos encima de cada encabezado, las cuadrículas simétricas de 3 tarjetas con íconos Lucide dentro de cajitas redondeadas, las microetiquetas en mayúsculas espaciadas de relleno, y cualquier simulación de testimonios o prueba social ficticia. En su lugar, el diseño se fundamenta en tipografía intencional, jerarquía visual basada en escala y peso, y espaciado nítido con aire generoso.

**Key Characteristics:**
- **Rigor Tipográfico:** Encabezados rotundos con `Plus Jakarta Sans`, texto de lectura pausada con `DM Sans` y alineación numérica estricta con `JetBrains Mono` tabular.
- **Paleta Botánica y Mineral:** Verdes bosque profundos, blanco puro de manifiesto de carga y grises minerales con bordes filosos de 1px.
- **Espacio en Blanco Nítido:** Separación clara entre secciones (64px) y agrupaciones lógicas compactas, dejando que los datos respiren sin marcos innecesarios.
- **Arquitectura de Información Funcional:** Ecuaciones de consolidación (`4 t + 3 t + 3 t = 10 t`), tablas comparativas y desglose transparente de variables en lugar de tarjetas decorativas con íconos vacíos.

## Colors

La paleta cromática se inspira en el suelo agrícola fértil, las plantaciones peruanas de exportación y la claridad documental del comercio industrial B2B.

### Primary
- **Deep Forest Green** (`#14532D`): Color nuclear del sistema. Denota autoridad institucional, solidez y confiabilidad agronómica. Se utiliza en acciones primarias, marcas de navegación activa y títulos de máximo impacto.
- **Deep Forest Hover** (`#0F3F22`): Estado activo e interactivo de botones y controles principales.

### Secondary
- **Field Agro Green** (`#15803D`): Verde vegetal complementario. Se usa para indicar confirmación de lotes, cobertura 100% alcanzada y compatibilidad validada.

### Neutral
- **Mineral Canvas** (`#F7F9F7`): Fondo base de la aplicación. Cálido, orgánico y descansado para la vista, alejado del blanco hospitalario frío.
- **Surface White** (`#FFFFFF`): Planos de tarjetas, paneles de control y tablas de datos.
- **Subtle Surface** (`#EFF4F0`): Fondos de contenedores secundarios, filas alternas de tablas y bloques de métricas secundarias.
- **Hairline Border** (`#DFE6E0`): Delimitador estructural de 1px para todas las divisiones, bordes de tabla y contenedores.
- **Deep Charcoal Text** (`#111814`): Texto principal de lectura y títulos principales; proporciona contraste superior a 12:1 sobre el fondo mineral.
- **Slate Green Secondary** (`#526058`): Texto de apoyo, especificaciones técnicas y descripciones secundarias.
- **Muted Moss Caption** (`#708077`): Metadatos, pies de página y notas legales.

### Accent
- **Harvest Amber** (`#D97706`): Tono ámbar de advertencia controlada. Reservado exclusivamente para alertas de cosecha próxima a expirar, diferencias de calidad menores o estados pendientes de validación.
- **Harvest Amber Soft** (`#FEF3C7`): Fondo tenue para contenedores de advertencia agronómica.

### Named Rules
**The Anti-AI Gradient Rule.** Queda terminantemente prohibido el uso de degradados lineales o radiales genéricos (especialmente combinaciones púrpura/cian, violeta/magenta o azul neón), así como el texto con relleno en degradado (`bg-clip-text`). Los colores deben aplicarse como planos sólidos y honestos.
**The Rarity of Accent Rule.** El color ámbar de acento (`#D97706`) nunca debe utilizarse como fondo decorativo ni en más del 5% de la superficie visual. Su valor reside exclusivamente en señalar una condición que requiere atención del operador.
**The Hairline Boundary Rule.** Las jerarquías espaciales se demarcan mediante bordes de 1px (`#DFE6E0`) y contraste de fondos (`#FFFFFF` vs `#F7F9F7`), nunca mediante sombras difusas o halos de color.

## Typography

La tipografía es el pilar central de la experiencia visual. Debe sostener por sí misma la estructura y el ritmo de cada página, sin recurrir a muletas ornamentales.

**Display Font:** `Plus Jakarta Sans` (con fallbacks `-apple-system, BlinkMacSystemFont, sans-serif`)
**Body Font:** `DM Sans` (con fallbacks `-apple-system, BlinkMacSystemFont, sans-serif`)
**Tabular / Data Font:** `JetBrains Mono` (con fallback `monospace`)

**Character:** Encuentro entre la modernidad geométrica y legible de `Plus Jakarta Sans` para encabezados y la calidez humanista de `DM Sans` para párrafos extensos, complementado por la precisión contable de `JetBrains Mono`.

### Hierarchy
- **Display** (Bold 700, `clamp(2.15rem, 3.6vw, 3.25rem)`, `line-height: 1.1`, `letter-spacing: -0.02em`): Encabezado del Hero y llamados centrales. Se formatea con balance de texto (`text-wrap: balance`).
- **Headline** (Bold 700, `1.75rem` / `28px`, `line-height: 1.2`, `letter-spacing: -0.015em`): Títulos de sección principal (Problema, Consolidación, Planes).
- **Title** (Semi-Bold 600, `1.25rem` / `20px`, `line-height: 1.3`, `letter-spacing: -0.01em`): Títulos de tarjetas de lotes, nombres de empresas y subsecciones.
- **Body** (Regular 400, `1rem` / `16px`, `line-height: 1.6`, `letter-spacing: 0em`): Texto explicativo, descripciones de oferta y requerimientos técnicos. Longitud de línea óptima: 60–75ch.
- **Label / Metadata** (Medium 500, `0.875rem` / `14px`, `line-height: 1.4`): Formularios, filtros y especificaciones de lote.
- **Tabular Data** (Mono Medium 500 / Bold 700, `JetBrains Mono`, `tabular-nums`): Cifras de tonelaje (`10 t`), sumas de consolidación (`4 t + 3 t + 3 t`), precios (`S/ 1.90/kg`) y porcentajes de coincidencia (`100%`).

### Named Rules
**The Intentional Typography Rule.** La importancia de un elemento se comunica por tamaño relativo, peso y distancia en blanco, no por agregados decorativos. Un título no necesita un adorno para mandar sobre la sección.
**The No-Filler-Uppercase Rule.** Se prohíbe terminantemente el uso de microetiquetas de relleno en mayúsculas espaciadas (`letter-spacing: 0.15em+`, e.g., `CARACTERÍSTICAS`, `CÓMO FUNCIONA`, `NUESTRO PROCESO`). Los encabezados deben enunciarse en formato oración o título natural, con redacción directa y sustantiva.
**The Tabular Data Mandate.** Todo número que represente volumen, precio, fecha o porcentaje debe renderizarse obligatoriamente con la clase `font-mono-tabular` (`font-variant-numeric: tabular-nums`) para garantizar alineación vertical perfecta en reportes y listas.

## Layout

El diseño descarta las composiciones simétricas de relleno y prioriza un modelo espacial asimétrico, editorial y orientado a datos.

- **Ancho Máximo:** `1200px` con padding lateral fluido (`px-6`).
- **Ritmo Vertical:** Secciones separadas por `64px` a `80px` (`py-16` / `py-20`).
- **Relación de Espaciado en Encabezados:** Siempre debe existir mayor espacio en blanco por encima de un encabezado que por debajo (proporción mínima 2:1), vinculando el título visualmente con el bloque que encabeza.
- **Contenedores de Contenido:** Se rechaza el patrón de encapsular cada párrafo en una tarjeta individual. La información fluye sobre el lienzo `#F7F9F7` o `#FFFFFF`, utilizando bordes de 1px solo cuando existe necesidad de delimitar entidades transaccionales (lotes, solicitudes, contratos).

### Named Rules
**The Anti-Grid Rule.** Prohibición explícita de la clásica cuadrícula de 3 columnas donde cada columna es una tarjeta idéntica con un ícono Lucide en una caja redondeada, un título de 3 palabras y dos líneas de texto genérico. Los flujos de trabajo deben representarse mediante estructuras específicas:
- Ecuaciones lineales de consolidación (`Demanda Industrial` → `Suma de Aportes` → `Resultado de Cobertura`).
- Tablas comparativas de especificaciones agronómicas.
- Divisiones asimétricas (e.g., 7 columnas de desglose técnico y 5 columnas de resumen de lote).
**The Crisp Whitespace Rule.** El espacio en blanco es un elemento estructural activo, no un vacío que deba llenarse con ilustraciones abstractas o tarjetas flotantes. Los márgenes limpios guían el ojo del comprador hacia las variables decisorias.

## Elevation & Depth

AgroConnect opera sobre un modelo de superficies planas con estratificación tonal y líneas nítidas.

- **Superficie en Reposo:** Plano completamente plano (`box-shadow: none`), demarcado por bordes `1px solid #DFE6E0`.
- **Contraste de Capas:** La profundidad se logra disponiendo tarjetas en blanco puro (`#FFFFFF`) sobre el fondo mineral (`#F7F9F7`), o mediante fondos sutiles (`#EFF4F0`) para datos consolidados.
- **Elevación Máxima:** Limitada exclusivamente a menús desplegables o modales emergentes: `box-shadow: 0 4px 16px rgba(17, 24, 20, 0.06)`.

### Named Rules
**The Flat Hairline Rule.** Se prohíben las sombras oscuras proyectadas, los efectos de neomorfismo y el uso indiscriminado de desenfoque de fondo (`backdrop-blur`) como adorno estético. Las interfaces de agronegocios demandan nitidez óptica absoluta.

## Shapes

- **Esquinas y Radios:** Lenguaje sobrio y angular controlado.
  - Botones y campos de formulario: `rounded-md` (`8px`).
  - Tarjetas de datos y tablas: `rounded-lg` o `rounded-xl` (`8px` a `12px`).
  - Micro-etiquetas de estado de lote: `rounded` (`4px`).
- **Prohibición de Formas Exageradas:** Prohibido el uso de píldoras exageradas (`rounded-full`) en contenedores estructurales o botones de acción primaria, así como siluetas orgánicas amorfas o blobs de fondo.

## Components

### Buttons
- **Primary:** Fondo `#14532D`, texto `#FFFFFF`, `font-semibold text-sm`, padding `10px 20px`, radio `8px`. Hover: fondo `#0F3F22`.
- **Secondary:** Fondo `#FFFFFF`, borde `1px solid #DFE6E0`, texto `#14532D`, `font-semibold text-sm`, padding `10px 20px`, radio `8px`. Hover: borde `#14532D` al 40%.
- **Ghost / Enlace Textual:** Texto `#526058`, `hover:text-[#111814]`, subrayado con offset (`underline underline-offset-4`).

### Cards & Data Containers
- Fondo blanco `#FFFFFF`, borde `1px solid #DFE6E0`, padding interno de `20px` a `24px`, esquinas de `12px`.
- **Cero íconos decorativos en la cabecera:** Las tarjetas de datos deben abrir directamente con el título de la métrica o la descripción agronómica, sin un ícono Lucide flotante como adorno.

### Inputs & Selects
- Fondo `#FFFFFF`, borde `1px solid #DFE6E0`, padding `10px 14px`, texto `#111814`, texto de marcador `#708077`.
- Foco visible: anillo de 2px en `#14532D` con transición de 150ms.

### Signature Component: Bloque de Ecuación de Consolidación
- Contenedor horizontal que muestra la demanda industrial, el desglose de aportes de cooperativas y el porcentaje de cobertura resultante.
- Tipografía monoespaciada para las cantidades (`4 t + 3 t + 3 t = 10 t`).
- Resalta la verdad agronómica y el Smart Matching sin necesidad de gráficos abstractos.

### Named Rules
**The No-Eyebrow Rule.** Queda terminantemente prohibido colocar "eyebrow badges" (píldoras de colores, cintillos o etiquetas flotantes) inmediatamente encima de cada encabezado. Los títulos tienen peso y presencia suficientes para comandar el flujo visual sin muletas.

## Do's and Don'ts

### Don't:
- **Don't** usar degradados genéricos púrpura/cian, violeta/magenta o azul neón en fondos, botones o textos.
- **Don't** colocar "eyebrow badges" o etiquetas tipo píldora encima de los títulos principales en cada sección.
- **Don't** estructurar secciones con cuadrículas de 3 tarjetas idénticas con íconos genéricos de Lucide en esquinas redondeadas.
- **Don't** emplear microetiquetas en mayúsculas espaciadas (`letter-spacing: 0.15em`) para rellenar encabezados.
- **Don't** inventar prueba social falsa: testimonios ficticios de agricultores, citas inventadas, sellos de 5 estrellas ("4.9 de 5") o logotipos de clientes imaginarios.
- **Don't** usar sombras pesadas, halos de brillo de color ni fondos de vidrio borroso como decoración.
- **Don't** esconder datos agronómicos relevantes detrás de jerga de marketing o metáforas visuales vacías.

### Do:
- **Do** priorizar tipografía intencional con escala definida (`Plus Jakarta Sans` en títulos, `DM Sans` en cuerpo y `JetBrains Mono` en cifras).
- **Do** construir una jerarquía visual real mediante contraste de tamaño, peso tipográfico y ritmo espacial.
- **Do** mantener espaciado en blanco nítido y generoso (`64px` entre secciones, mayor separación sobre títulos que bajo ellos).
- **Do** utilizar la paleta botánica y mineral oficial (`#14532D`, `#15803D`, `#F7F9F7`, `#FFFFFF`, `#DFE6E0`).
- **Do** representar la consolidación y el Smart Matching con estructuras de datos reales: ecuaciones de suma de lotes, tablas comparativas y desgloses de 10 variables.
- **Do** mostrar evidencia auténtica del sistema: datos de lotes y cooperativas reales del código (`src/data/`), respetando la honestidad del prototipo MVP.
