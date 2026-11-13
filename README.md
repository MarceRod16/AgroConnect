# AgroConnect — MVP Web B2B de Consolidación Inteligente Agrícola

**AgroConnect** es una plataforma B2B SaaS (prototipo MVP funcional) orientada al mercado agrícola peruano que conecta a empresas procesadoras de alimentos e industriales (**Compradores**) con agricultores independientes, asociaciones, cooperativas, centros de acopio y comercializadores (**Proveedores**).

Su propuesta de valor central es el **Smart Matching con consolidación multi-proveedor**, permitiendo agrupar lotes compatibles de múltiples productores para cubrir demandas industriales que ningún proveedor individual alcanzaría por sí solo.

---

## 1. Instalación y ejecución local

Requisitos previos: **Node.js 18+** y **npm**.

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo (puerto 3000)
npm run dev

# 3. Verificar tipos y compilación de producción
npm run lint
npm run build
```

La aplicación estará disponible en `http://localhost:3000`.

### Accesos de demostración precargados

Al abrir AgroConnect se presenta la pantalla de **Inicio de Sesión y Onboarding Progresivo** (junto con un acceso a la Landing B2B). Puedes usar los botones de entrada directa:

- **Demo Comprador** (*Alimentos Procesados del Valle S.A.C.* — Lima): incluye el escenario demostrativo estrella de **10 toneladas de Tomate industrial Grado A** cubiertas al 100% por la consolidación de **3 proveedores compatibles (4 t + 3 t + 3 t)**.
- **Demo Proveedor** (*Cooperativa Agraria Valle de Cañete*): permite publicar/editar ofertas, buscar compradores y manifestar interés comercial.
- **Demo Cuenta Dual** (*AgroIndustrias & Acopio Pacífico*): permite alternar instantáneamente entre la vista de **Comprador** y **Proveedor** desde el menú lateral sin cerrar sesión.

---

## 2. Cómo funciona el algoritmo de Smart Matching y sus limitaciones

El motor de matching reside de forma independiente a la interfaz en `src/services/matchingEngine.ts`.

### Reglas estrictas de compatibilidad

1. **Sin mezcla de cultivos**: solo evalúa ofertas cuyo `product` coincida exactamente con el de la solicitud activa.
2. **Validación de calidad**: nunca combina calidades incompatibles (por ejemplo, una oferta *Grado B* es excluida automáticamente cuando la solicitud exige *Grado A*, lo cual puede comprobarse con el lote demo de Barranca).
3. **Variedad**: cuando `varietyMandatory` es verdadero, exige coincidencia de variedad; si es opcional, permite variedades industriales compatibles del mismo cultivo.
4. **Normalización de unidades**: convierte todas las cantidades (`kg`, `t`, `qq` = 46 kg, `sacos` = 50 kg) a kilogramos antes de calcular aportes o porcentajes de cobertura.
5. **Ventana temporal**: verifica el traslape entre la disponibilidad de cosecha (`availableFrom` – `availableTo`) y la fecha objetivo de entrega (`deliveryDate`).
6. **Sin duplicación de inventario**: dentro de una misma propuesta de consolidación, cada lote (`offer.id`) puede aparecer como máximo una vez; nunca se suman dos veces las toneladas disponibles de un mismo lote.

### Tipos de coincidencia

- **Direct Match**: cuando una sola oferta activa cubre el 100% o más del volumen requerido.
- **Consolidated Match**: cuando ninguna oferta compatible individual cubre el total (o existen lotes parciales complementarios), el algoritmo busca combinaciones óptimas de 2 a 4 proveedores distintos cuya suma alcance el 100% de cobertura (o maximice la cobertura parcial).

### Desglose de las 10 variables y puntaje heurístico

Cada oportunidad muestra un puntaje heurístico (`0–100`) y el desglose transparente de:
1. Producto agrícola
2. Variedad
3. Volumen normalizado
4. Calidad
5. Fecha y disponibilidad
6. Ubicación de producción
7. Ubicación de recepción
8. Precio estimado (conversión referencial USD/PEN cuando aplica)
9. Condiciones de entrega
10. Capacidad logística (transporte propio, centro de acopio, cadena de frío)

> **Limitaciones del algoritmo en el MVP**:
> - El puntaje de compatibilidad es un **indicador heurístico de prototipo**, no una predicción garantizada ni un contrato comercial.
> - La búsqueda combinatoria de consolidación evalúa los 10 mejores candidatos parciales en grupos de 2 a 4 lotes; en catálogos masivos deberá ejecutarse mediante programación lineal o heurísticas en servidor.
> - La cercanía geográfica usa macro-zonas departamentales del Perú en lugar de rutas viales reales o cálculo de fletes por kilómetro.
> - Una coincidencia **no reserva inventario** ni confirma una operación de compra.

---

## 3. Almacenamiento de datos del prototipo (`localStorage`)

El estado completo de la aplicación se persiste en el navegador bajo la clave `agroconnect_mvp_state_v1` en `localStorage` (`src/services/storageService.ts`).

Incluye:
- Sesión activa y rol visualizado (`buyer` / `supplier`).
- Cuentas creadas y perfiles de comprador/proveedor (sin almacenar contraseñas en texto plano).
- Solicitudes de compra, publicaciones de oferta y sus estados (`activa`, `pausada`, `cerrada`).
- Solicitudes de contacto e intereses comerciales (`pendiente`, `en_revision`, `contactado`).
- Inscripciones a eventos comerciales.

Desde la barra lateral o en **Cuenta y Planes**, el botón **Restaurar datos demo** reinicia `localStorage` al estado inicial de demostración.

---

## 4. Funcionalidades funcionales vs. simuladas

### Funcionalidades reales en el prototipo (interactivas y persistentes)
- Registro progresivo en 4 etapas con guardado parcial y perfiles duales.
- Registro inclusivo de agricultores independientes sin exigencia obligatoria de RUC (`pendiente_validacion`).
- Creación, edición, pausa, reactivación y cierre de **Solicitudes de compra** y **Publicaciones de oferta**.
- Recálculo en tiempo real del **Smart Matching** (Direct Match y Consolidated Match) al modificar ofertas o solicitudes.
- Filtros multicriterio de proveedores y compradores.
- Registro y actualización de estado de contactos e intereses comerciales.
- Estadísticas dinámicas calculadas a partir de los lotes y solicitudes activas.
- Directorio de eventos comerciales con visibilidad diferenciada por rol e inscripción persistente.

### Elementos simulados / de demostración
- **Autenticación y contraseñas**: el inicio de sesión es simulado localmente (las contraseñas se validan en el formulario pero no se persisten ni existe JWT/OAuth).
- **Validación SUNAT / RENIEC**: no existe integración real con SUNAT ni consulta de RUC/DNI; los estados son ilustrativos.
- **Planes SaaS y pagos**: la sección de planes es puramente referencial; no hay cobros, facturación ni restricciones de acceso.
- **Datos precargados**: todas las empresas, cooperativas y lotes iniciales son ficticios y se identifican explícitamente como datos de demostración.

---

## 5. Mejoras necesarias para pasar a producción

1. **Backend y Base de Datos Relacional (PostgreSQL)**: migrar la lógica de persistencia, autenticación segura (hash Argon2/bcrypt, JWT, MFA) y control de acceso por roles (RBAC) a una API backend.
2. **Validación documental oficial**: integrar consultas a APIs oficiales de SUNAT / RENIEC y verificación documental de cooperativas y certificaciones (BPA, GlobalG.A.P., Orgánico).
3. **Motor de optimización logística**: incorporar distancias viales reales, cálculo de fletes compartidos (consolidación de carga en ruta) y reservas temporales de lote con vigencia.
4. **Mensajería y negociación formal**: chat estructurado, envío de muestras, órdenes de compra, guías de remisión electrónicas y acuerdos marco.
5. **Notificaciones y analítica**: alertas por correo/WhatsApp cuando surjan consolidaciones compatibles y tableros históricos reales de cumplimiento de entrega.
