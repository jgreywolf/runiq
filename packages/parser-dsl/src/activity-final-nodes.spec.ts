import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';
import type { NodeAst } from '@runiq/core';

describe('Activity Diagram Final Nodes', () => {
  it('should parse activityFinal shape', () => {
    const dsl = `
      diagram "Activity Final Test" {
        shape start as @initialState
        shape process as @activity label:"Process"
        shape done as @activityFinal
        
        start -> process flowType:"control"
        process -> done flowType:"control"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(3);

    const doneNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'done'
    );
    expect(doneNode).toBeDefined();
    expect(doneNode?.shape).toBe('activityFinal');
  });

  it('should parse flowFinal shape', () => {
    const dsl = `
      diagram "Flow Final Test" {
        shape start as @initialState
        shape process as @activity label:"Process"
        shape flowEnd as @flowFinal
        
        start -> process flowType:"control"
        process -> flowEnd flowType:"control"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(3);

    const flowEndNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'flowEnd'
    );
    expect(flowEndNode).toBeDefined();
    expect(flowEndNode?.shape).toBe('flowFinal');
  });

  it('should parse activity with both final node types', () => {
    const dsl = `
      diagram "Both Finals" {
        shape start as @initialState
        shape work as @activity label:"Work"
        shape cancel as @flowFinal
        shape complete as @activityFinal
        
        start -> work flowType:"control"
        work -> cancel flowType:"control" label:"[canceled]"
        work -> complete flowType:"control" label:"[success]"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(4);

    const cancelNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'cancel'
    );
    const completeNode = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'complete'
    );
    expect(cancelNode?.shape).toBe('flowFinal');
    expect(completeNode?.shape).toBe('activityFinal');
  });

  it('should parse parallel flows with individual flow finals', () => {
    const dsl = `
      diagram "Parallel with Flow Finals" {
        shape start as @initialState
        shape fork as @fork
        
        shape taskA as @activity label:"Task A"
        shape taskB as @activity label:"Task B"
        shape taskC as @activity label:"Task C"
        
        shape endA as @flowFinal
        shape endB as @flowFinal
        shape endC as @activityFinal
        
        start -> fork flowType:"control"
        fork -> taskA flowType:"control"
        fork -> taskB flowType:"control"
        fork -> taskC flowType:"control"
        
        taskA -> endA flowType:"control"
        taskB -> endB flowType:"control"
        taskC -> endC flowType:"control"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    // start, fork, 3 tasks, 3 finals = 8 nodes
    expect(result.diagram?.nodes).toHaveLength(8);

    const endA = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'endA');
    const endB = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'endB');
    const endC = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'endC');

    expect(endA?.shape).toBe('flowFinal');
    expect(endB?.shape).toBe('flowFinal');
    expect(endC?.shape).toBe('activityFinal');
  });

  it('should parse exception handling with flow final', () => {
    const dsl = `
      diagram "Exception Handling" {
        shape start as @initialState
        shape tryProcess as @activity label:"Try Process"
        shape success as @activity label:"Success Handler"
        shape error as @activity label:"Error Handler"
        shape errorEnd as @flowFinal
        shape complete as @activityFinal
        shape check as @choice
        
        start -> tryProcess flowType:"control"
        tryProcess -> check flowType:"control"
        check -> success flowType:"control" label:"[ok]"
        check -> error flowType:"control" label:"[error]"
        error -> errorEnd flowType:"control"
        success -> complete flowType:"control"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(7);

    const errorEnd = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'errorEnd'
    );
    const complete = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'complete'
    );

    expect(errorEnd?.shape).toBe('flowFinal');
    expect(complete?.shape).toBe('activityFinal');
  });

  it('should parse activity with early termination paths', () => {
    const dsl = `
      diagram "Early Termination" {
        shape start as @initialState
        shape process as @activity label:"Process"
        shape validate as @activity label:"Validate"
        shape check as @choice
        shape earlyExit as @flowFinal
        shape complete as @activityFinal
        
        start -> process flowType:"control"
        process -> validate flowType:"control"
        validate -> check flowType:"control"
        check -> earlyExit flowType:"control"
        check -> complete flowType:"control"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(6);

    const earlyExit = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'earlyExit'
    );
    const complete = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'complete'
    );

    expect(earlyExit?.shape).toBe('flowFinal');
    expect(complete?.shape).toBe('activityFinal');
  });

  it('should parse concurrent flows with selective termination', () => {
    const dsl = `
      diagram "Selective Flow Termination" {
        shape start as @initialState
        shape fork as @fork
        shape join as @join
        
        shape primary as @activity label:"Primary Task"
        shape secondary as @activity label:"Secondary Task"
        shape monitor as @activity label:"Monitor"
        
        shape primaryDone as @activityFinal
        shape secondaryAbort as @flowFinal
        
        start -> fork flowType:"control"
        fork -> primary flowType:"control"
        fork -> secondary flowType:"control"
        fork -> monitor flowType:"control"
        
        primary -> join flowType:"control"
        monitor -> join flowType:"control"
        
        secondary -> secondaryAbort flowType:"control" label:"[cancel]"
        join -> primaryDone flowType:"control"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    // start, fork, join, 3 activities, 2 finals = 8 nodes
    expect(result.diagram?.nodes).toHaveLength(8);

    const primaryDone = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'primaryDone'
    );
    const secondaryAbort = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'secondaryAbort'
    );

    expect(primaryDone?.shape).toBe('activityFinal');
    expect(secondaryAbort?.shape).toBe('flowFinal');
  });

  it('should parse final nodes with object flow', () => {
    const dsl = `
      diagram "Final with Objects" {
        shape start as @initialState
        shape produce as @activity label:"Produce Data"
        shape consume as @activity label:"Consume Data"
        shape data as @objectNode label:"Result"
        shape cleanup as @flowFinal
        shape success as @activityFinal
        
        start -> produce flowType:"control"
        produce -> data flowType:"object"
        data -> consume flowType:"object"
        consume -> success flowType:"control"
        produce -> cleanup flowType:"control" label:"[error]"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(6);

    const cleanup = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'cleanup'
    );
    const success = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'success'
    );

    expect(cleanup?.shape).toBe('flowFinal');
    expect(success?.shape).toBe('activityFinal');

    // Verify we have object flow
    const objectEdge = result.diagram?.edges?.find(
      (e: any) => e.from === 'produce' && e.to === 'data'
    );
    expect(objectEdge?.flowType).toBe('object');
  });

  it('should parse nested decision with multiple finals', () => {
    const dsl = `
      diagram "Multi-Path Termination" {
        shape start as @initialState
        shape validate as @activity label:"Validate"
        shape checkA as @choice
        shape checkB as @choice
        
        shape processA as @activity label:"Process A"
        shape processB as @activity label:"Process B"
        
        shape errorA as @flowFinal
        shape errorB as @flowFinal
        shape success as @activityFinal
        
        start -> validate flowType:"control"
        validate -> checkA flowType:"control"
        checkA -> processA flowType:"control"
        checkA -> processB flowType:"control"
        
        processA -> checkB flowType:"control"
        checkB -> success flowType:"control"
        checkB -> errorA flowType:"control"
        
        processB -> errorB flowType:"control"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    // start, validate, 2 choices, 2 processes, 3 finals = 9 nodes
    expect(result.diagram?.nodes).toHaveLength(9);

    const errorA = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'errorA'
    );
    const errorB = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'errorB'
    );
    const success = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'success'
    );

    expect(errorA?.shape).toBe('flowFinal');
    expect(errorB?.shape).toBe('flowFinal');
    expect(success?.shape).toBe('activityFinal');
  });

  it('should parse final nodes with styling', () => {
    const dsl = `
      diagram "Styled Finals" {
        style errorStyle fillColor: "#ffcccc" strokeColor: "#cc0000" strokeWidth: 2
        style successStyle fillColor: "#ccffcc" strokeColor: "#00cc00" strokeWidth: 2
        
        shape start as @initialState
        shape work as @activity label:"Work"
        shape abort as @flowFinal style:errorStyle
        shape done as @activityFinal style:successStyle
        
        start -> work flowType:"control"
        work -> abort flowType:"control" label:"[abort]"
        work -> done flowType:"control" label:"[complete]"
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(4);

    const abort = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'abort');
    const done = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'done');

    expect(abort?.shape).toBe('flowFinal');
    expect(abort?.style).toBe('errorStyle');
    expect(done?.shape).toBe('activityFinal');
    expect(done?.style).toBe('successStyle');
  });
});
