import { describe, expect, it } from 'vitest';
import { parseFaultTreeProfile } from '../test-utils/profile-helpers.js';
import { expectParseError } from '../test-utils/profile-helpers.js';

describe('Fault Tree Profile Tests', () => {
  it('should parse a basic fault tree', () => {
    const profile = parseFaultTreeProfile(`
      faultTree "Brake Failure" {
        topEvent loss "Brake system fails"
        gate g1 type:or under:loss
        event hydLoss "Hydraulic pressure lost" under:g1
        event controlFailure "Controller failure" under:g1
      }
    `);

    expect(profile.title).toBe('Brake Failure');
    expect(profile.events).toHaveLength(3);
    expect(profile.gates).toHaveLength(1);
    expect(profile.events[0]).toMatchObject({
      id: 'loss',
      label: 'Brake system fails',
      kind: 'topEvent',
    });
    expect(profile.gates[0]).toMatchObject({
      id: 'g1',
      gateType: 'or',
      under: 'loss',
    });
  });

  it('should parse undeveloped events and probabilities', () => {
    const profile = parseFaultTreeProfile(`
      faultTree "Power Loss" {
        topEvent outage "Loss of power"
        gate main type:and under:outage
      event mainFeedLoss "Main feed lost" under:main probability:0.2
      undevelopedEvent backup "Backup unavailable" under:main
      }
    `);

    expect(profile.events.find((event) => event.id === 'mainFeedLoss')).toMatchObject({
      probability: 0.2,
      kind: 'event',
    });
    expect(profile.events.find((event) => event.id === 'backup')).toMatchObject({
      kind: 'undevelopedEvent',
    });
  });

  it('should reject gates without a type', () => {
    expectParseError(`
      faultTree "Invalid" {
        topEvent loss "Top"
        gate g1 under:loss
      }
    `);
  });
});
