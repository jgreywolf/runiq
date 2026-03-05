import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser';

describe('State Machine Diagrams - Entry/Exit/DoActivity Behaviors', () => {
  it('should parse state with entry action', () => {
    const dsl = `
      diagram "Door Lock" {
        shape locked as @state label:"Locked" entry:"lockBolt()"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const state = result.diagram?.nodes[0];
    expect(state?.label).toBe('Locked');
    expect(state?.entry).toBe('lockBolt()');
    expect(state?.exit).toBeUndefined();
    expect(state?.doActivity).toBeUndefined();
  });

  it('should parse state with exit action', () => {
    const dsl = `
      diagram "Traffic Light" {
        shape green as @state label:"Green" exit:"turnOffGreen()"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const state = result.diagram?.nodes[0];
    expect(state?.label).toBe('Green');
    expect(state?.exit).toBe('turnOffGreen()');
    expect(state?.entry).toBeUndefined();
  });

  it('should parse state with doActivity', () => {
    const dsl = `
      diagram "Audio Player" {
        shape playing as @state label:"Playing" doActivity:"playAudio()"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const state = result.diagram?.nodes[0];
    expect(state?.label).toBe('Playing');
    expect(state?.doActivity).toBe('playAudio()');
    expect(state?.entry).toBeUndefined();
    expect(state?.exit).toBeUndefined();
  });

  it('should parse state with all three behaviors', () => {
    const dsl = `
      diagram "Vending Machine" {
        shape dispensing as @state 
          label:"Dispensing" 
          entry:"openDispenser()" 
          doActivity:"releaseProduct()" 
          exit:"closeDispenser()"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const state = result.diagram?.nodes[0];
    expect(state?.label).toBe('Dispensing');
    expect(state?.entry).toBe('openDispenser()');
    expect(state?.doActivity).toBe('releaseProduct()');
    expect(state?.exit).toBe('closeDispenser()');
  });

  it('should parse multiple states with different behaviors', () => {
    const dsl = `
      diagram "State Machine" {
        shape idle as @state label:"Idle" entry:"resetTimer()"
        shape active as @state label:"Active" doActivity:"processData()"
        shape complete as @state label:"Complete" exit:"cleanup()"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(3);

    const idle = result.diagram?.nodes[0];
    expect(idle?.entry).toBe('resetTimer()');
    expect(idle?.doActivity).toBeUndefined();

    const active = result.diagram?.nodes[1];
    expect(active?.doActivity).toBe('processData()');
    expect(active?.entry).toBeUndefined();

    const complete = result.diagram?.nodes[2];
    expect(complete?.exit).toBe('cleanup()');
    expect(complete?.entry).toBeUndefined();
  });

  it('should handle complex action expressions', () => {
    const dsl = `
      diagram "Complex Actions" {
        shape processing as @state 
          label:"Processing" 
          entry:"initializeBuffer(size: 1024)" 
          doActivity:"transform(input, output)" 
          exit:"flushBuffer() ; logStats()"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const state = result.diagram?.nodes[0];
    expect(state?.entry).toBe('initializeBuffer(size: 1024)');
    expect(state?.doActivity).toBe('transform(input, output)');
    expect(state?.exit).toBe('flushBuffer() ; logStats()');
  });

  it('should parse state behaviors with special characters', () => {
    const dsl = `
      diagram "Special Chars" {
        shape working as @state 
          label:"Working" 
          entry:"log(\\"Started\\")" 
          doActivity:"count++" 
          exit:"save('/tmp/data.json')"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const state = result.diagram?.nodes[0];
    expect(state?.entry).toBe('log("Started")');
    expect(state?.doActivity).toBe('count++');
    expect(state?.exit).toBe("save('/tmp/data.json')");
  });

  it('should work with state machines having transitions', () => {
    const dsl = `
      diagram "Complete State Machine" {
        shape initial as @initialState
        shape running as @state label:"Running" entry:"start()" exit:"stop()"
        shape paused as @state label:"Paused" doActivity:"showPaused()"
        shape final as @finalState

        initial -> running
        running -> paused label:"pause"
        paused -> running label:"resume"
        running -> final label:"terminate"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(4);
    expect(result.diagram?.edges).toHaveLength(4);

    const running = result.diagram?.nodes.find((n) => n.label === 'Running');
    expect(running?.entry).toBe('start()');
    expect(running?.exit).toBe('stop()');

    const paused = result.diagram?.nodes.find((n) => n.label === 'Paused');
    expect(paused?.doActivity).toBe('showPaused()');
  });

  it('should handle states with behaviors and other properties', () => {
    const dsl = `
      diagram "Rich State" {
        shape heating as @state 
          label:"Heating" 
          entry:"turnOnHeater()" 
          doActivity:"maintainTemp()" 
          exit:"turnOffHeater()"
          tooltip:"Heating water to target temperature"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const state = result.diagram?.nodes[0];
    expect(state?.label).toBe('Heating');
    expect(state?.entry).toBe('turnOnHeater()');
    expect(state?.doActivity).toBe('maintainTemp()');
    expect(state?.exit).toBe('turnOffHeater()');
    expect(state?.tooltip).toBe('Heating water to target temperature');
  });

  it('should handle empty behaviors gracefully', () => {
    const dsl = `
      diagram "Empty Behaviors" {
        shape waiting as @state label:"Waiting"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const state = result.diagram?.nodes[0];
    expect(state?.label).toBe('Waiting');
    expect(state?.entry).toBeUndefined();
    expect(state?.exit).toBeUndefined();
    expect(state?.doActivity).toBeUndefined();
  });
});
