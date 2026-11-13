import { DeliveryMode, QualityGrade, SupplierType, UnitOfMeasure } from '../types/agroconnect';

export const INDUSTRIAL_SUBSECTORS: string[] = [
  'Procesamiento de frutas, jugos y pulpas',
  'Procesamiento de hortalizas',
  'Fabricación de salsas, pastas y condimentos',
  'Procesamiento de tubérculos',
  'Fabricación de snacks y productos deshidratados',
  'Procesamiento de granos y cereales',
  'Fabricación de productos congelados',
  'Conservas y alimentos envasados',
  'Otros productos alimentarios',
];

export const SUPPLIER_TYPE_LABELS: Record<SupplierType, string> = {
  productor_individual: 'Productor individual',
  persona_natural_negocio: 'Persona natural con negocio',
  asociacion: 'Asociación agrícola',
  cooperativa: 'Cooperativa agraria',
  empresa_agricola: 'Empresa agrícola',
  centro_acopio: 'Centro de acopio',
  comercializador: 'Comercializador',
};

export const DELIVERY_MODE_LABELS: Record<DeliveryMode, string> = {
  en_origen: 'En origen (recojo en fundo/acopio)',
  en_destino: 'En destino (entrega en planta)',
  negociable: 'Negociable según volumen',
};

export const UNIT_LABELS: Record<UnitOfMeasure, string> = {
  kg: 'Kilogramos (kg)',
  t: 'Toneladas (t)',
  qq: 'Quintales (qq · 46 kg)',
  sacos: 'Sacos (50 kg)',
};

export const QUALITY_GRADES: QualityGrade[] = [
  'Exportación',
  'Grado A',
  'Grado B',
  'Industrial Estándar',
];

export interface PeruRegionItem {
  department: string;
  provinces: Record<string, string[]>;
  macroZone: 'Costa Norte' | 'Costa Centro' | 'Costa Sur' | 'Sierra Centro' | 'Sierra Sur' | 'Selva';
}

export const PERU_LOCATIONS: PeruRegionItem[] = [
  {
    department: 'Lima',
    macroZone: 'Costa Centro',
    provinces: {
      Lima: ['Lima', 'Ate', 'Lurín', 'Santa Anita', 'Villa El Salvador', 'Puente Piedra'],
      Cañete: ['San Vicente de Cañete', 'Imperial', 'Mala', 'Asia'],
      Huaral: ['Huaral', 'Chancay', 'Aucallama'],
      Barranca: ['Barranca', 'Supe', 'Paramonga'],
    },
  },
  {
    department: 'Ica',
    macroZone: 'Costa Centro',
    provinces: {
      Ica: ['Ica', 'La Tinguiña', 'Santiago', 'Salas'],
      Chincha: ['Chincha Alta', 'Sunampe', 'El Carmen', 'Grocio Prado'],
      Pisco: ['Pisco', 'Humay', 'Independencia'],
      Nazca: ['Nazca', 'Vista Alegre'],
    },
  },
  {
    department: 'Arequipa',
    macroZone: 'Costa Sur',
    provinces: {
      Arequipa: ['Arequipa', 'Majes', 'La Joya', 'Yura', 'Socabaya'],
      Camaná: ['Camaná', 'Samuel Pastor'],
      Caylloma: ['Majes - El Pedregal', 'Chivay'],
    },
  },
  {
    department: 'Piura',
    macroZone: 'Costa Norte',
    provinces: {
      Piura: ['Piura', 'Tambogrande', 'Castilla', 'Catacaos'],
      Sullana: ['Sullana', 'Querecotillo', 'Marcavelica'],
      Morropón: ['Chulucanas', 'Buenos Aires'],
    },
  },
  {
    department: 'La Libertad',
    macroZone: 'Costa Norte',
    provinces: {
      Trujillo: ['Trujillo', 'Moche', 'Laredo', 'Virú'],
      Virú: ['Virú', 'Chao', 'Guadalupito'],
      Pacasmayo: ['San Pedro de Lloc', 'Guadalupe'],
    },
  },
  {
    department: 'Lambayeque',
    macroZone: 'Costa Norte',
    provinces: {
      Chiclayo: ['Chiclayo', 'José Leonardo Ortiz', 'Reque'],
      Lambayeque: ['Lambayeque', 'Olmos', 'Motupe', 'Jayanca'],
    },
  },
  {
    department: 'Junín',
    macroZone: 'Sierra Centro',
    provinces: {
      Huancayo: ['Huancayo', 'El Tambo', 'Chilca', 'Sicaya'],
      Concepción: ['Concepción', 'Matahuasi'],
      Jauja: ['Jauja', 'Acolla'],
      Chanchamayo: ['La Merced', 'San Ramón', 'Perené'],
    },
  },
  {
    department: 'Cusco',
    macroZone: 'Sierra Sur',
    provinces: {
      Cusco: ['Cusco', 'San Jerónimo', 'San Sebastián'],
      Urubamba: ['Urubamba', 'Ollantaytambo', 'Maras'],
      Calca: ['Calca', 'Pisac'],
    },
  },
  {
    department: 'Áncash',
    macroZone: 'Costa Centro',
    provinces: {
      Santa: ['Chimbote', 'Nuevo Chimbote', 'Moro'],
      Casma: ['Casma', 'Buena Vista Alta'],
      Huaraz: ['Huaraz', 'Independencia'],
    },
  },
];

export interface ProductCatalogEntry {
  product: string;
  category: string;
  varieties: string[];
  defaultUnit: UnitOfMeasure;
  imageUrl?: string;
}

export const PRODUCT_CATALOG: ProductCatalogEntry[] = [
  {
    product: 'Tomate industrial',
    category: 'Hortalizas',
    varieties: ['Roma', 'Río Grande', 'Híbrido Heinz', 'Cualquiera'],
    defaultUnit: 't',
    imageUrl: '/src/assets/images/crop_tomato_industrial_1794588271950.jpg',
  },
  {
    product: 'Mango',
    category: 'Frutas',
    varieties: ['Kent', 'Edward', 'Haden', 'Criollo', 'Cualquiera'],
    defaultUnit: 't',
    imageUrl: '/src/assets/images/crop_mango_export_1794588272370.jpg',
  },
  {
    product: 'Papa',
    category: 'Tubérculos',
    varieties: ['Yungay (Blanca)', 'Amarilla Tumbay', 'Peruanita', 'Canchán', 'Cualquiera'],
    defaultUnit: 't',
    imageUrl: '/src/assets/images/crop_potato_andes_1794588273249.jpg',
  },
  {
    product: 'Cebolla',
    category: 'Hortalizas',
    varieties: ['Roja Arequipeña', 'Blanca Dulce', 'Amarilla', 'Cualquiera'],
    defaultUnit: 't',
  },
  {
    product: 'Maíz',
    category: 'Granos y cereales',
    varieties: ['Amiláceo Blanco', 'Amarillo Duro', 'Morado', 'Choclo Cusco', 'Cualquiera'],
    defaultUnit: 't',
  },
  {
    product: 'Limón',
    category: 'Frutas',
    varieties: ['Sutil', 'Tahití', 'Cualquiera'],
    defaultUnit: 't',
  },
  {
    product: 'Palta',
    category: 'Frutas',
    varieties: ['Hass', 'Fuerte', 'Cualquiera'],
    defaultUnit: 't',
  },
  {
    product: 'Ají amarillo',
    category: 'Hortalizas',
    varieties: ['Escabeche Costa', 'Criollo', 'Cualquiera'],
    defaultUnit: 't',
  },
  {
    product: 'Quinua',
    category: 'Granos y cereales',
    varieties: ['Blanca Real', 'Negra Collana', 'Roja Pasankalla', 'Cualquiera'],
    defaultUnit: 't',
  },
];

export const PRODUCT_CATEGORIES = Array.from(new Set(PRODUCT_CATALOG.map((p) => p.category)));

export function getMacroZone(department: string): string {
  return PERU_LOCATIONS.find((r) => r.department === department)?.macroZone ?? 'Otras regiones';
}
