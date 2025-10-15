import { DefaultValueConverter } from 'langium';

/**
 * Custom value converter for Runiq language.
 * Handles conversion of parsed terminal values into JavaScript values.
 *
 * Currently uses default behavior - can be extended later for custom conversions.
 */
export class RuniqValueConverter extends DefaultValueConverter {
  // Uses default Langium conversion for now
  // STRING terminals automatically have quotes stripped
  // NUMBER terminals automatically converted to numbers
}
