import { CategoryDefinition, UnitCategory } from './types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    name: UnitCategory.LENGTH,
    baseUnitId: 'm',
    units: [
      { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
      { id: 'm', name: 'Meter', symbol: 'm', factor: 1 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.344 },
      { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
    ],
  },
  {
    name: UnitCategory.MASS,
    baseUnitId: 'kg',
    units: [
      { id: 't', name: 'Metric Ton', symbol: 't', factor: 1000 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1 },
      { id: 'g', name: 'Gram', symbol: 'g', factor: 0.001 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 0.000001 },
      { id: 'lb', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
      { id: 'st', name: 'Stone', symbol: 'st', factor: 6.35029 },
    ],
  },
  {
    name: UnitCategory.VOLUME,
    baseUnitId: 'l',
    units: [
      { id: 'l', name: 'Liter', symbol: 'L', factor: 1 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
      { id: 'qt_us', name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
      { id: 'pt_us', name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
      { id: 'cup_us', name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
      { id: 'fl_oz_us', name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
    ],
  },
  {
    name: UnitCategory.TEMPERATURE,
    baseUnitId: 'c',
    // Temperature is special, factors here are approximations for linear scale if we weren't handling it specially in logic
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', factor: 1, offset: 0 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', factor: 1, offset: 0 }, // Handled by specific logic
      { id: 'k', name: 'Kelvin', symbol: 'K', factor: 1, offset: 0 },    // Handled by specific logic
    ],
  },
  {
    name: UnitCategory.TIME,
    baseUnitId: 's',
    units: [
      { id: 'y', name: 'Year (avg)', symbol: 'yr', factor: 31557600 },
      { id: 'wk', name: 'Week', symbol: 'wk', factor: 604800 },
      { id: 'd', name: 'Day', symbol: 'd', factor: 86400 },
      { id: 'h', name: 'Hour', symbol: 'hr', factor: 3600 },
      { id: 'min', name: 'Minute', symbol: 'min', factor: 60 },
      { id: 's', name: 'Second', symbol: 's', factor: 1 },
      { id: 'ms', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
    ],
  },
  {
    name: UnitCategory.DIGITAL,
    baseUnitId: 'byte',
    units: [
      { id: 'tb', name: 'Terabyte', symbol: 'TB', factor: 1099511627776 },
      { id: 'gb', name: 'Gigabyte', symbol: 'GB', factor: 1073741824 },
      { id: 'mb', name: 'Megabyte', symbol: 'MB', factor: 1048576 },
      { id: 'kb', name: 'Kilobyte', symbol: 'KB', factor: 1024 },
      { id: 'byte', name: 'Byte', symbol: 'B', factor: 1 },
      { id: 'bit', name: 'Bit', symbol: 'b', factor: 0.125 },
    ],
  },
];
