import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';
import type { NodeAst } from '@runiq/core';

describe('Component Diagram Additional Shapes', () => {
  it('should parse port shape', () => {
    const dsl = `
      diagram "Component with Ports" {
        shape comp as @component label:"Web Server"
        shape httpPort as @port label:"HTTP"
        shape dbPort as @port label:"Database"
        
        comp -> httpPort
        comp -> dbPort
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(3);

    const httpPort = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'httpPort'
    );
    const dbPort = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'dbPort'
    );

    expect(httpPort?.shape).toBe('port');
    expect(httpPort?.label).toBe('HTTP');
    expect(dbPort?.shape).toBe('port');
    expect(dbPort?.label).toBe('Database');
  });

  it('should parse module shape', () => {
    const dsl = `
      diagram "Modular System" {
        shape authModule as @module label:"Authentication"
        shape dataModule as @module label:"Data Access"
        
        authModule -> dataModule
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(2);

    const authModule = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'authModule'
    );
    const dataModule = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'dataModule'
    );

    expect(authModule?.shape).toBe('module');
    expect(authModule?.label).toBe('Authentication');
    expect(dataModule?.shape).toBe('module');
  });

  it('should parse template shape', () => {
    const dsl = `
      diagram "Generic Components" {
        shape listTemplate as @template label:"List<T>"
        shape mapTemplate as @template label:"Map<K,V>"
        
        listTemplate -> mapTemplate
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(2);

    const listTemplate = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'listTemplate'
    );
    const mapTemplate = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'mapTemplate'
    );

    expect(listTemplate?.shape).toBe('template');
    expect(listTemplate?.label).toBe('List<T>');
    expect(mapTemplate?.shape).toBe('template');
  });

  it('should parse providedInterface shape (lollipop notation)', () => {
    const dsl = `
      diagram "Component Interfaces" {
        shape service as @component label:"Payment Service"
        shape iface as @providedInterface label:"IPayment"
        
        service -> iface
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(2);

    const iface = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'iface');
    expect(iface?.shape).toBe('providedInterface');
    expect(iface?.label).toBe('IPayment');
  });

  it('should parse requiredInterface shape (socket notation)', () => {
    const dsl = `
      diagram "Component Dependencies" {
        shape client as @component label:"API Client"
        shape required as @requiredInterface label:"IHttpClient"
        
        client -> required
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(2);

    const required = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'required'
    );
    expect(required?.shape).toBe('requiredInterface');
    expect(required?.label).toBe('IHttpClient');
  });

  it('should parse assembly connector pattern', () => {
    const dsl = `
      diagram "Component Assembly" {
        shape server as @component label:"Web Server"
        shape client as @component label:"Client"
        shape provided as @providedInterface label:"IWebAPI"
        shape required as @requiredInterface label:"IWebAPI"
        shape connector as @assembly label:"HTTP Assembly"
        
        server -> provided
        client -> required
        provided -> connector
        connector -> required
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(5);

    const connector = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'connector'
    );
    expect(connector?.shape).toBe('assembly');
    expect(connector?.label).toBe('HTTP Assembly');
  });

  it('should parse component with multiple ports', () => {
    const dsl = `
      diagram "Multi-Port Component" {
        shape apiGateway as @component label:"API Gateway"
        shape httpIn as @port label:"HTTP In"
        shape httpsIn as @port label:"HTTPS In"
        shape authOut as @port label:"Auth Out"
        shape dataOut as @port label:"Data Out"
        
        apiGateway -> httpIn
        apiGateway -> httpsIn
        apiGateway -> authOut
        apiGateway -> dataOut
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(5);

    const ports = result.diagram?.nodes?.filter(
      (n: NodeAst) => n.shape === 'port'
    );
    expect(ports).toHaveLength(4);
  });

  it('should parse modular architecture with templates', () => {
    const dsl = `
      diagram "Template-Based Architecture" {
        shape repository as @template label:"Repository<T>"
        shape service as @template label:"Service<T>"
        shape controller as @module label:"REST Controller"
        
        repository -> service
        service -> controller
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(3);

    const repository = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'repository'
    );
    const service = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'service'
    );
    const controller = result.diagram?.nodes?.find(
      (n: NodeAst) => n.id === 'controller'
    );

    expect(repository?.shape).toBe('template');
    expect(service?.shape).toBe('template');
    expect(controller?.shape).toBe('module');
  });

  it('should parse interface segregation pattern', () => {
    const dsl = `
      diagram "Interface Segregation" {
        shape service as @component label:"User Service"
        shape iRead as @providedInterface label:"IReadUser"
        shape iWrite as @providedInterface label:"IWriteUser"
        shape iDelete as @providedInterface label:"IDeleteUser"
        
        service -> iRead
        service -> iWrite
        service -> iDelete
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(4);

    const interfaces = result.diagram?.nodes?.filter(
      (n: NodeAst) => n.shape === 'providedInterface'
    );
    expect(interfaces).toHaveLength(3);
  });

  it('should parse component diagram with styling', () => {
    const dsl = `
      diagram "Styled Components" {
        style portStyle fill: "#e3f2fd" stroke: "#1976d2" strokeWidth: 2
        style moduleStyle fill: "#f3e5f5" stroke: "#7b1fa2" strokeWidth: 2
        
        shape gateway as @component label:"Gateway"
        shape port1 as @port label:"Port 1" style:portStyle
        shape auth as @module label:"Auth Module" style:moduleStyle
        
        gateway -> port1
        gateway -> auth
      }
    `;

    const result = parse(dsl);
    expect(result.errors).toHaveLength(0);
    expect(result.diagram?.nodes).toHaveLength(3);

    const port1 = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'port1');
    const auth = result.diagram?.nodes?.find((n: NodeAst) => n.id === 'auth');

    expect(port1?.style).toBe('portStyle');
    expect(auth?.style).toBe('moduleStyle');
  });
});
