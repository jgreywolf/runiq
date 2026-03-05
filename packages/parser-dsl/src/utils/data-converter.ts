import * as Langium from '../generated/ast.js';

/**
 * Convert Langium DataProperty to core data format
 * Handles arrays of values and arrays of objects
 */
export function convertDataProperty(
  prop: Langium.DataProperty
): Record<string, unknown> {
  const values: Array<number | Record<string, unknown>> = [];

  for (const item of prop.items) {
    if (Langium.isDataObject(item)) {
      // Convert object properties to key-value pairs
      const obj: Record<string, unknown> = {};
      for (const objProp of item.properties) {
        const key = objProp.key;
        const value = objProp.value;

        // Handle arrays (DataArray type)
        if (Langium.isDataArray(value)) {
          const arrayValues = value.items.map((num) => parseFloat(num));
          obj[key] = arrayValues;
          continue;
        }

        // Remove quotes from strings
        if (typeof value === 'string') {
          let strValue = value;
          if (strValue.startsWith('"') && strValue.endsWith('"')) {
            strValue = strValue.slice(1, -1);
          }
          // Try to parse as number
          const numValue = parseFloat(strValue);
          if (!isNaN(numValue) && strValue === numValue.toString()) {
            obj[key] = numValue;
          } else {
            obj[key] = strValue;
          }
        } else {
          obj[key] = value;
        }
      }
      values.push(obj);
    } else if (Langium.isDataValue(item)) {
      // Plain number value (DataValue type)
      const numValue = parseFloat(item.value);
      if (!isNaN(numValue)) {
        values.push(numValue);
      }
    }
  }

  return { values };
}
