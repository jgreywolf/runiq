import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';
import type { NodeAst } from '@runiq/core';

describe('Activity Diagram Signal Shapes', () => {
  it('should parse sendSignal shape', () => {
    const dsl = `
      diagram "Activity with Signals" {
        shape sendMsg as @sendSignal label:"Send Alert"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(1);
    
    const node = result.diagram?.nodes[0] as NodeAst;
    expect(node.id).toBe('sendMsg');
    expect(node.shape).toBe('sendSignal');
    expect(node.label).toBe('Send Alert');
  });

  it('should parse receiveSignal shape', () => {
    const dsl = `
      diagram "Activity with Signals" {
        shape receiveMsg as @receiveSignal label:"Receive Notification"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(1);
    
    const node = result.diagram?.nodes[0] as NodeAst;
    expect(node.id).toBe('receiveMsg');
    expect(node.shape).toBe('receiveSignal');
    expect(node.label).toBe('Receive Notification');
  });

  it('should parse acceptEvent shape', () => {
    const dsl = `
      diagram "Activity with Events" {
        shape waitForEvent as @acceptEvent label:"Wait for Timer"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(1);
    
    const node = result.diagram?.nodes[0] as NodeAst;
    expect(node.id).toBe('waitForEvent');
    expect(node.shape).toBe('acceptEvent');
    expect(node.label).toBe('Wait for Timer');
  });

  it('should parse activity with send and receive signals', () => {
    const dsl = `
      diagram "Signal Communication" {
        shape processA as @activity label:"Process A"
        shape send as @sendSignal label:"Send Request"
        shape receive as @receiveSignal label:"Receive Response"
        shape processB as @activity label:"Process B"

        processA -> send
        send -> receive
        receive -> processB
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(4);
    expect(result.diagram?.edges).toHaveLength(3);

    // Verify signal shapes
    const sendNode = result.diagram?.nodes.find((n: NodeAst) => n.id === 'send');
    const receiveNode = result.diagram?.nodes.find((n: NodeAst) => n.id === 'receive');
    
    expect(sendNode?.shape).toBe('sendSignal');
    expect(receiveNode?.shape).toBe('receiveSignal');
  });

  it('should parse activity with multiple signal types', () => {
    const dsl = `
      diagram "Mixed Signal Types" {
        shape init as @initialState
        shape prepareData as @activity label:"Prepare Data"
        shape sendNotif as @sendSignal label:"Send Notification"
        shape waitResponse as @acceptEvent label:"Wait for Response"
        shape receiveAck as @receiveSignal label:"Receive ACK"
        shape processResult as @activity label:"Process Result"
        shape final as @finalState

        init -> prepareData
        prepareData -> sendNotif
        sendNotif -> waitResponse
        waitResponse -> receiveAck
        receiveAck -> processResult
        processResult -> final
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(7);
    expect(result.diagram?.edges).toHaveLength(6);

    // Verify all signal types present
    const nodes = result.diagram?.nodes || [];
    const sendSignals = nodes.filter((n: NodeAst) => n.shape === 'sendSignal');
    const receiveSignals = nodes.filter((n: NodeAst) => n.shape === 'receiveSignal');
    const acceptEvents = nodes.filter((n: NodeAst) => n.shape === 'acceptEvent');
    
    expect(sendSignals).toHaveLength(1);
    expect(receiveSignals).toHaveLength(1);
    expect(acceptEvents).toHaveLength(1);
  });

  it('should parse signal shapes with flowType edges', () => {
    const dsl = `
      diagram "Signal with Flow Types" {
        shape action as @activity label:"Execute Action"
        shape sendSig as @sendSignal label:"Broadcast Event"
        shape acceptSig as @acceptEvent label:"Wait for Event"
        shape nextAction as @activity label:"Next Action"

        action -> sendSig flowType:"control"
        acceptSig -> nextAction flowType:"control"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(2);

    const edges = result.diagram?.edges || [];
    expect(edges[0].flowType).toBe('control');
    expect(edges[1].flowType).toBe('control');
  });

  it('should parse parallel signal sending with fork/join', () => {
    const dsl = `
      diagram "Parallel Signal Broadcasting" {
        shape start as @initialState
        shape prepareMsg as @activity label:"Prepare Message"
        shape forkPoint as @fork
        
        shape sendEmail as @sendSignal label:"Send Email"
        shape sendSMS as @sendSignal label:"Send SMS"
        shape sendPush as @sendSignal label:"Send Push Notification"
        
        shape joinPoint as @join
        shape complete as @activity label:"Log Completion"
        shape end as @finalState

        start -> prepareMsg
        prepareMsg -> forkPoint
        
        forkPoint -> sendEmail
        forkPoint -> sendSMS
        forkPoint -> sendPush
        
        sendEmail -> joinPoint
        sendSMS -> joinPoint
        sendPush -> joinPoint
        
        joinPoint -> complete
        complete -> end
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(9); // start, prepareMsg, fork, 3 sends, join, complete, end

    // Verify three send signals
    const nodes = result.diagram?.nodes || [];
    const sendSignals = nodes.filter((n: NodeAst) => n.shape === 'sendSignal');
    expect(sendSignals).toHaveLength(3);
  });

  it('should parse event-driven workflow with accept events', () => {
    const dsl = `
      diagram "Event-Driven Workflow" {
        shape idle as @activity label:"Idle"
        shape waitTimer as @acceptEvent label:"Wait for Timer"
        shape waitUserAction as @acceptEvent label:"Wait for User Input"
        shape waitSystemEvent as @acceptEvent label:"Wait for System Event"
        
        shape decisionPoint as @choice
        shape handleTimer as @activity label:"Handle Timeout"
        shape handleUser as @activity label:"Handle User Action"
        shape handleSystem as @activity label:"Handle System Event"

        idle -> decisionPoint
        
        decisionPoint -> waitTimer label:"[timer]"
        decisionPoint -> waitUserAction label:"[user]"
        decisionPoint -> waitSystemEvent label:"[system]"
        
        waitTimer -> handleTimer
        waitUserAction -> handleUser
        waitSystemEvent -> handleSystem
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);

    // Verify three accept events
    const nodes = result.diagram?.nodes || [];
    const acceptEvents = nodes.filter((n: NodeAst) => n.shape === 'acceptEvent');
    expect(acceptEvents).toHaveLength(3);
  });

  it('should parse request-response pattern with signals', () => {
    const dsl = `
      diagram "Request-Response Pattern" {
        shape client as @activity label:"Client"
        shape sendRequest as @sendSignal label:"Send Request"
        shape server as @activity label:"Server"
        shape processRequest as @activity label:"Process Request"
        shape sendResponse as @sendSignal label:"Send Response"
        shape receiveResponse as @receiveSignal label:"Receive Response"
        shape clientProcess as @activity label:"Process Response"

        client -> sendRequest
        sendRequest -> server label:"HTTP Request"
        server -> processRequest
        processRequest -> sendResponse
        sendResponse -> receiveResponse label:"HTTP Response"
        receiveResponse -> clientProcess
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(7);

    const nodes = result.diagram?.nodes || [];
    const sends = nodes.filter((n: NodeAst) => n.shape === 'sendSignal').length;
    const receives = nodes.filter((n: NodeAst) => n.shape === 'receiveSignal').length;
    
    expect(sends).toBe(2);
    expect(receives).toBe(1);
  });

  it('should parse signal shapes with styling', () => {
    const dsl = `
      diagram "Styled Signals" {
        style signalStyle fill:"#fff3e0" stroke:"#e65100" strokeWidth:2

        shape send as @sendSignal label:"Send Alert" style:signalStyle
        shape receive as @receiveSignal label:"Receive Alert" style:signalStyle
        shape accept as @acceptEvent label:"Wait for Alert" style:signalStyle
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    
    const nodes = result.diagram?.nodes || [];
    expect(nodes).toHaveLength(3);
    
    // All nodes should have the style
    nodes.forEach((node: NodeAst) => {
      expect(node.style).toBe('signalStyle');
    });
  });
});
