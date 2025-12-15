import { describe, expect, test } from 'vitest';
import { parse } from '../langium-parser.js';
import type { NodeAst } from '@runiq/core';

describe('State Machine Pseudo-states Parser', () => {
  test('should parse historyShallow pseudo-state', () => {
    const dsl = `
      diagram "State Machine Diagram" {
        shape mediaPlayer as @historyShallow label:"Resume Playback"
        shape playing as @state label:"Playing"
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(2);

    const historyNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'mediaPlayer'
    );
    expect(historyNode).toBeDefined();
    expect(historyNode?.shape).toBe('historyShallow');
    expect(historyNode?.label).toBe('Resume Playback');
  });

  test('should parse historyDeep pseudo-state', () => {
    const dsl = `
      diagram "State Machine Diagram" {
        shape deepHistory as @historyDeep label:"Deep Resume"
        shape compositeState as @state label:"Composite State"
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(2);

    const deepHistoryNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'deepHistory'
    );
    expect(deepHistoryNode).toBeDefined();
    expect(deepHistoryNode?.shape).toBe('historyDeep');
    expect(deepHistoryNode?.label).toBe('Deep Resume');
  });

  test('should parse junction pseudo-state', () => {
    const dsl = `
      diagram "State Machine Diagram" {
        shape j1 as @junction label:"Decision Point"
        shape stateA as @state label:"State A"
        shape stateB as @state label:"State B"
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(3);

    const junctionNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'j1'
    );
    expect(junctionNode).toBeDefined();
    expect(junctionNode?.shape).toBe('junction');
    expect(junctionNode?.label).toBe('Decision Point');
  });

  test('should parse entryPoint pseudo-state', () => {
    const dsl = `
      diagram "State Machine Diagram" {
        shape entry1 as @entryPoint label:"Main Entry"
        shape composite as @state label:"Composite State"
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(2);

    const entryNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'entry1'
    );
    expect(entryNode).toBeDefined();
    expect(entryNode?.shape).toBe('entryPoint');
    expect(entryNode?.label).toBe('Main Entry');
  });

  test('should parse exitPoint pseudo-state', () => {
    const dsl = `
      diagram "State Machine Diagram" {
        shape exit1 as @exitPoint label:"Exit to Outer"
        shape composite as @state label:"Composite State"
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(2);

    const exitNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'exit1'
    );
    expect(exitNode).toBeDefined();
    expect(exitNode?.shape).toBe('exitPoint');
    expect(exitNode?.label).toBe('Exit to Outer');
  });

  test('should parse terminate pseudo-state', () => {
    const dsl = `
      diagram "State Machine Diagram" {
        shape term1 as @terminate label:"Abort"
        shape errorState as @state label:"Error"
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(2);

    const terminateNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'term1'
    );
    expect(terminateNode).toBeDefined();
    expect(terminateNode?.shape).toBe('terminate');
    expect(terminateNode?.label).toBe('Abort');
  });

  test('should parse complex workflow with junction and entry/exit points', () => {
    const dsl = `
      diagram "Complex State Machine" {
        shape idle as @state label:"Idle"
        shape mainEntry as @entryPoint label:"Entry"
        shape validate as @junction label:"Validate"
        shape processing as @state label:"Processing"
        shape success as @exitPoint label:"Success Exit"
        shape failure as @exitPoint label:"Failure Exit"
        shape done as @state label:"Done"

        idle -> mainEntry
        mainEntry -> validate
        validate -> processing label:"valid"
        validate -> failure label:"invalid"
        processing -> success label:"completed"
        success -> done
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(7);

    const entryNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'mainEntry'
    );
    expect(entryNode?.shape).toBe('entryPoint');

    const junctionNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'validate'
    );
    expect(junctionNode?.shape).toBe('junction');

    const successExit = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'success'
    );
    expect(successExit?.shape).toBe('exitPoint');

    const failureExit = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'failure'
    );
    expect(failureExit?.shape).toBe('exitPoint');

    expect(result.diagram?.edges?.length).toBe(6);
  });

  test('should parse composite state with history', () => {
    const dsl = `
      diagram "Media Player State Machine" {
        shape idle as @state label:"Idle"
        shape activeContainer as @state label:"Active"
        shape resumeState as @historyShallow label:"H"
        shape playing as @state label:"Playing"
        shape paused as @state label:"Paused"
        shape stopped as @state label:"Stopped"

        idle -> activeContainer label:"power on"
        idle -> resumeState label:"resume"
        resumeState -> paused label:"restore"
        activeContainer -> playing label:"play"
        playing -> paused label:"pause"
        paused -> playing label:"resume"
        playing -> stopped label:"stop"
        stopped -> idle label:"power off"
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(6);

    const historyNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'resumeState'
    );
    expect(historyNode?.shape).toBe('historyShallow');

    const containerNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'activeContainer'
    );
    expect(containerNode).toBeDefined();

    expect(result.diagram?.edges?.length).toBe(8);
  });

  test('should parse nested state machine with terminate', () => {
    const dsl = `
      diagram "Processing State Machine" {
        shape init as @state label:"Initialize"
        shape running as @state label:"Running"
        shape checkError as @junction label:"Check Error"
        shape error as @state label:"Error"
        shape abort as @terminate label:"Abort All"
        shape cleanup as @state label:"Cleanup"
        shape final as @state label:"Final"

        init -> running label:"start"
        running -> checkError label:"check"
        checkError -> error label:"has error"
        checkError -> cleanup label:"no error"
        error -> abort label:"critical"
        error -> cleanup label:"recoverable"
        cleanup -> final
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(7);

    const junctionNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'checkError'
    );
    expect(junctionNode?.shape).toBe('junction');

    const terminateNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'abort'
    );
    expect(terminateNode?.shape).toBe('terminate');

    expect(result.diagram?.edges?.length).toBe(7);
  });

  test('should parse styled pseudo-states', () => {
    const dsl = `
      diagram "Styled State Machine" {
        style historyStyle fillColor: "#ffddaa" strokeColor: "#ff8800"
        style junctionStyle fillColor: "#000000"
        style entryStyle fillColor: "#ffffff" strokeColor: "#0000ff"
        style exitStyle fillColor: "#ffffff" strokeColor: "#ff0000"
        style terminateStyle fillColor: "#ffcccc" strokeColor: "#cc0000"

        shape h1 as @historyShallow label:"Resume" style:historyStyle
        shape j1 as @junction label:"Decision" style:junctionStyle
        shape e1 as @entryPoint label:"Entry" style:entryStyle
        shape x1 as @exitPoint label:"Exit" style:exitStyle
        shape t1 as @terminate label:"Abort" style:terminateStyle
      }
    `;

    const result = parse(dsl);
    expect(result.errors.length).toBe(0);
    expect(result.diagram?.nodes?.length).toBe(5);

    const historyNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'h1'
    );
    expect(historyNode?.shape).toBe('historyShallow');

    const junctionNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'j1'
    );
    expect(junctionNode?.shape).toBe('junction');

    const entryNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'e1'
    );
    expect(entryNode?.shape).toBe('entryPoint');

    const exitNode = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'x1');
    expect(exitNode?.shape).toBe('exitPoint');

    const terminateNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 't1'
    );
    expect(terminateNode?.shape).toBe('terminate');
  });
});
