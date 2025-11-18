export enum UnitCategory {
  LENGTH = 'Length',
  MASS = 'Mass',
  TEMPERATURE = 'Temperature',
  VOLUME = 'Volume',
  AREA = 'Area',
  TIME = 'Time',
  DIGITAL = 'Digital Storage',
  SPEED = 'Speed'
}

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  factor: number; // Conversion factor relative to base unit (e.g., meters for length)
  offset?: number; // For temperature (e.g., -273.15 for Kelvin)
}

export interface CategoryDefinition {
  name: UnitCategory;
  baseUnitId: string;
  units: UnitDefinition[];
}

export interface ConversionResult {
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
  category: string;
  timestamp: number;
  explanation?: string; // For AI results
  isAiGenerated?: boolean;
}

export interface AIConversionResponse {
  sourceValue: number;
  sourceUnit: string;
  targetValue: number;
  targetUnit: string;
  category: string;
  explanation: string;
  formula: string;
}
