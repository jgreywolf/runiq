import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';
import type { EdgeAst } from '@runiq/core';

describe('State Machine Transition Syntax (Event/Guard/Effect)', () => {
  it('should parse transition with event only', () => {
    const dsl = `
      diagram "State Machine" {
        locked -> unlocked event:"insertCoin"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(1);
    const edge = result.diagram?.edges[0] as EdgeAst;
    expect(edge.event).toBe('insertCoin');
    expect(edge.guard).toBeUndefined();
    expect(edge.effect).toBeUndefined();
  });

  it('should parse transition with guard only', () => {
    const dsl = `
      diagram "State Machine" {
        idle -> processing guard:"[balance >= amount]"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(1);
    const edge = result.diagram?.edges[0] as EdgeAst;
    expect(edge.guard).toBe('[balance >= amount]');
    expect(edge.event).toBeUndefined();
    expect(edge.effect).toBeUndefined();
  });

  it('should parse transition with effect only', () => {
    const dsl = `
      diagram "State Machine" {
        idle -> active effect:"turnOnLight()"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(1);
    const edge = result.diagram?.edges[0] as EdgeAst;
    expect(edge.effect).toBe('turnOnLight()');
    expect(edge.event).toBeUndefined();
    expect(edge.guard).toBeUndefined();
  });

  it('should parse transition with event and guard', () => {
    const dsl = `
      diagram "ATM" {
        idle -> processing event:"withdrawRequest" guard:"[balance >= amount]"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(1);
    const edge = result.diagram?.edges[0] as EdgeAst;
    expect(edge.event).toBe('withdrawRequest');
    expect(edge.guard).toBe('[balance >= amount]');
    expect(edge.effect).toBeUndefined();
  });

  it('should parse transition with event and effect', () => {
    const dsl = `
      diagram "Door" {
        locked -> unlocked event:"unlock" effect:"soundBeep(); logAccess()"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(1);
    const edge = result.diagram?.edges[0] as EdgeAst;
    expect(edge.event).toBe('unlock');
    expect(edge.effect).toBe('soundBeep(); logAccess()');
    expect(edge.guard).toBeUndefined();
  });

  it('should parse transition with guard and effect', () => {
    const dsl = `
      diagram "Elevator" {
        idle -> moving guard:"[requestedFloor != currentFloor]" effect:"startMotor()"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(1);
    const edge = result.diagram?.edges[0] as EdgeAst;
    expect(edge.guard).toBe('[requestedFloor != currentFloor]');
    expect(edge.effect).toBe('startMotor()');
    expect(edge.event).toBeUndefined();
  });

  it('should parse transition with event, guard, and effect (complete syntax)', () => {
    const dsl = `
      diagram "Complete Transition" {
        waiting -> processing event:"submit" guard:"[isValid && !isProcessing]" effect:"startTimer(); logEvent()"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(1);
    const edge = result.diagram?.edges[0] as EdgeAst;
    expect(edge.event).toBe('submit');
    expect(edge.guard).toBe('[isValid && !isProcessing]');
    expect(edge.effect).toBe('startTimer(); logEvent()');
  });

  it('should parse transitions with complex guard conditions', () => {
    const dsl = `
      diagram "Complex Guards" {
        idle -> ready guard:"[temperature > 20 && temperature < 80 && pressure == nominal]"
        ready -> running guard:"[fuel >= minFuel || batteryLevel > 0.5]"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(2);
    const edge1 = result.diagram?.edges[0] as EdgeAst;
    const edge2 = result.diagram?.edges[1] as EdgeAst;
    expect(edge1.guard).toBe('[temperature > 20 && temperature < 80 && pressure == nominal]');
    expect(edge2.guard).toBe('[fuel >= minFuel || batteryLevel > 0.5]');
  });

  it('should parse transitions with special characters in effects', () => {
    const dsl = `
      diagram "Special Effects" {
        idle -> active effect:"updateUI('Processing...'); notify(user, \\"Started\\")"
        active -> complete effect:"result = calculate(x, y, z); callback?.invoke()"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(2);
    const edge1 = result.diagram?.edges[0] as EdgeAst;
    const edge2 = result.diagram?.edges[1] as EdgeAst;
    expect(edge1.effect).toContain('updateUI');
    expect(edge2.effect).toContain('calculate');
  });

  it('should parse complex state machine with multiple transitions', () => {
    const dsl = `
      diagram "ATM Withdrawal" {
        // States with behaviors
        shape idle as @stateSimple label:"Idle" entry:"clearScreen()"
        shape verifying as @stateSimple label:"Verifying PIN" doActivity:"checkDatabase()"
        shape processing as @stateSimple label:"Processing" entry:"lockAccount()" exit:"unlockAccount()"
        shape dispensing as @stateSimple label:"Dispensing Cash" doActivity:"dispenseCash()"
        shape complete as @stateSimple label:"Complete" entry:"printReceipt()"
        shape error as @stateSimple label:"Error" entry:"showError(); logError()"

        // Transitions with full syntax
        idle -> verifying event:"cardInserted"
        verifying -> processing event:"pinEntered" guard:"[pinValid && accountActive]" effect:"logSuccess()"
        verifying -> error event:"pinEntered" guard:"[!pinValid || attempts >= 3]" effect:"incrementAttempts()"
        processing -> dispensing guard:"[balance >= amount && cashAvailable]" effect:"deductAmount()"
        processing -> error guard:"[balance < amount]" effect:"showInsufficientFunds()"
        dispensing -> complete event:"cashDispensed" effect:"ejectCard(); updateBalance()"
        error -> idle event:"timeout" effect:"ejectCard(); resetState()"
        complete -> idle event:"cardRemoved" effect:"clearSession()"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(6);
    expect(result.diagram?.edges).toHaveLength(8);

    // Verify specific transitions
    const idleToVerifying = result.diagram?.edges.find((e: EdgeAst) => e.from === 'idle' && e.to === 'verifying');
    expect(idleToVerifying?.event).toBe('cardInserted');

    const verifyingToProcessing = result.diagram?.edges.find(
      (e: EdgeAst) => e.from === 'verifying' && e.to === 'processing'
    );
    expect(verifyingToProcessing?.event).toBe('pinEntered');
    expect(verifyingToProcessing?.guard).toBe('[pinValid && accountActive]');
    expect(verifyingToProcessing?.effect).toBe('logSuccess()');

    const processingToDispensing = result.diagram?.edges.find(
      (e: EdgeAst) => e.from === 'processing' && e.to === 'dispensing'
    );
    expect(processingToDispensing?.guard).toBe('[balance >= amount && cashAvailable]');
    expect(processingToDispensing?.effect).toBe('deductAmount()');
  });
});
