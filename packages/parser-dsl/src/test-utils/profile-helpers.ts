/**
 * Test utilities for profile parsing
 * Reduces boilerplate in profile-specific tests
 */

import type {
  DiagramProfile,
  DigitalProfile,
  ElectricalProfile,
  HydraulicProfile,
  PIDProfile,
  PneumaticProfile,
  Profile,
  RailroadProfile,
  SequenceProfile,
  TimelineProfile,
  WardleyProfile,
} from '@runiq/core';
import { expect } from 'vitest';
import { parse, type ParseResult } from '../langium-parser.js';

/**
 * Parse a Runiq document and extract a profile of specific type
 *
 * @param input - DSL input string
 * @param expectedType - Expected profile type discriminator
 * @returns Parsed profile of expected type
 * @throws If parsing fails or profile type doesn't match
 */
export function parseProfile<T extends Profile>(
  input: string,
  expectedType: T['type']
): T {
  const result = parse(input);

  expect(result.success).toBe(true);
  expect(result.document).toBeDefined();
  expect(result.document?.profiles).toHaveLength(1);

  const profile = result.document!.profiles[0];
  expect(profile.type).toBe(expectedType);

  return profile as T;
}

/**
 * Parse a Runiq document that may contain multiple profiles
 *
 * @param input - DSL input string
 * @param expectedCount - Expected number of profiles
 * @returns Parse result with all profiles
 */
export function parseMultiProfile(
  input: string,
  expectedCount: number
): ParseResult {
  const result = parse(input);

  expect(result.success).toBe(true);
  expect(result.document).toBeDefined();
  expect(result.document?.profiles).toHaveLength(expectedCount);

  return result;
}

/**
 * Parse a diagram profile with common assertions
 */
export function parseDiagramProfile(input: string): DiagramProfile {
  return parseProfile<DiagramProfile>(input, 'diagram');
}

/**
 * Parse a sequence profile with common assertions
 */
export function parseSequenceProfile(input: string): SequenceProfile {
  return parseProfile<SequenceProfile>(input, 'sequence');
}

/**
 * Parse a timeline profile with common assertions
 */
export function parseTimelineProfile(input: string): TimelineProfile {
  return parseProfile<TimelineProfile>(input, 'timeline');
}

/**
 * Parse an electrical profile with common assertions
 */
export function parseElectricalProfile(input: string): ElectricalProfile {
  return parseProfile<ElectricalProfile>(input, 'electrical');
}

/**
 * Parse a digital profile with common assertions
 */
export function parseDigitalProfile(input: string): DigitalProfile {
  return parseProfile<DigitalProfile>(input, 'digital');
}

/**
 * Parse a Wardley profile with common assertions
 */
export function parseWardleyProfile(input: string): WardleyProfile {
  return parseProfile<WardleyProfile>(input, 'wardley');
}

/**
 * Parse a pneumatic profile with common assertions
 */
export function parsePneumaticProfile(input: string): PneumaticProfile {
  return parseProfile<PneumaticProfile>(input, 'pneumatic');
}

/**
 * Parse a hydraulic profile with common assertions
 */
export function parseHydraulicProfile(input: string): HydraulicProfile {
  return parseProfile<HydraulicProfile>(input, 'hydraulic');
}

/**
 * Parse a P&ID profile with common assertions
 */
export function parsePIDProfile(input: string): PIDProfile {
  return parseProfile<PIDProfile>(input, 'pid');
}

/**
 * Parse a railroad profile with common assertions
 */
export function parseRailroadProfile(input: string): RailroadProfile {
  return parseProfile<RailroadProfile>(input, 'railroad');
}

/**
 * Assert that parsing fails with expected error
 *
 * @param input - DSL input string that should fail
 * @param expectedErrorPattern - Optional regex pattern to match error message
 */
export function expectParseError(
  input: string,
  expectedErrorPattern?: RegExp
): void {
  const result = parse(input);

  expect(result.success).toBe(false);

  if (expectedErrorPattern && result.errors && result.errors.length > 0) {
    const errorMessages = result.errors.join(' ');
    expect(errorMessages).toMatch(expectedErrorPattern);
  }
}
