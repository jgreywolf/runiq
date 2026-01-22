import { describe, expect, it } from 'vitest';
import { ElkLayoutEngine } from './elk-adapter.js';
import type {
  ContainerDeclaration,
  DiagramAst,
  PositionedContainer,
  PositionedNode,
  RoutedEdge,
} from '@runiq/core';
import { LayoutAlgorithm, Orientation } from '@runiq/core';

describe('ElkLayoutEngine helper methods', () => {
  it('extracts node IDs from member and indexed references', () => {
    const engine = new ElkLayoutEngine() as any;

    expect(engine.extractNodeId('Order.customerId')).toBe('Order');
    expect(engine.extractNodeId('Node#3')).toBe('Node');
    expect(engine.extractNodeId('PlainId')).toBe('PlainId');
    expect(engine.extractNodeId('Entity.field#2')).toBe('Entity');
  });

  it('creates standard ports for a node', () => {
    const engine = new ElkLayoutEngine() as any;
    const ports = engine.createNodePorts(100, 60);

    expect(ports).toHaveLength(4);
    expect(ports[0].properties['port.side']).toBe('NORTH');
    expect(ports[1].properties['port.side']).toBe('SOUTH');
    expect(ports[2].properties['port.side']).toBe('EAST');
    expect(ports[3].properties['port.side']).toBe('WEST');
  });

  it('generates orthogonal routing for vertical and horizontal layouts', () => {
    const engine = new ElkLayoutEngine() as any;

    const vertical = engine.generateOrthogonalRouting(10, 10, 50, 90, 'DOWN');
    expect(vertical).toEqual([
      { x: 10, y: 10 },
      { x: 10, y: 50 },
      { x: 50, y: 50 },
      { x: 50, y: 90 },
    ]);

    const horizontal = engine.generateOrthogonalRouting(10, 10, 90, 50, 'RIGHT');
    expect(horizontal).toEqual([
      { x: 10, y: 10 },
      { x: 50, y: 10 },
      { x: 50, y: 50 },
      { x: 90, y: 50 },
    ]);
  });

  it('maps algorithms and directions to ELK values', () => {
    const engine = new ElkLayoutEngine() as any;

    expect(engine.mapAlgorithmToElk(LayoutAlgorithm.LAYERED)).toBe('layered');
    expect(engine.mapAlgorithmToElk(LayoutAlgorithm.FORCE)).toBe('org.eclipse.elk.force');
    expect(engine.mapAlgorithmToElk(LayoutAlgorithm.STRESS)).toBe('org.eclipse.elk.stress');
    expect(engine.mapAlgorithmToElk(LayoutAlgorithm.RADIAL)).toBe('org.eclipse.elk.radial');
    expect(engine.mapAlgorithmToElk(LayoutAlgorithm.MRTREE)).toBe('org.eclipse.elk.mrtree');
    expect(engine.mapAlgorithmToElk(LayoutAlgorithm.CIRCULAR)).toBe('circular');
    expect(engine.mapAlgorithmToElk('unknown')).toBe('layered');

    expect(engine.mapDirectionToElk('TB')).toBe('DOWN');
    expect(engine.mapDirectionToElk('BT')).toBe('UP');
    expect(engine.mapDirectionToElk('LR')).toBe('RIGHT');
    expect(engine.mapDirectionToElk('RL')).toBe('LEFT');
    expect(engine.mapDirectionToElk('DOWN')).toBe('DOWN');
    expect(engine.mapDirectionToElk('unknown')).toBe('DOWN');
  });

  it('converts directions with fallbacks', () => {
    const engine = new ElkLayoutEngine() as any;

    expect(engine.convertDirection('BT')).toBe('UP');
    expect(engine.convertDirection('LEFT')).toBe('LEFT');
    expect(engine.convertDirection('diagonal')).toBe('DOWN');
  });

  it('simplifies radial edges to straight lines', () => {
    const engine = new ElkLayoutEngine() as any;
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'A', shape: 'circle' },
        { id: 'B', shape: 'circle' },
      ],
      edges: [{ from: 'A', to: 'B' }],
      containers: [
        {
          type: 'container',
          id: 'radial',
          label: 'Radial',
          children: ['A', 'B'],
          layoutOptions: { algorithm: LayoutAlgorithm.RADIAL },
        },
      ],
    };
    const edges: RoutedEdge[] = [
      {
        from: 'A',
        to: 'B',
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 20, y: 20 },
        ],
      },
    ];

    engine.simplifyRadialEdges(diagram, edges);

    expect(edges[0].points).toEqual([
      { x: 0, y: 0 },
      { x: 20, y: 20 },
    ]);
  });

  it('skips radial simplification when no radial containers', () => {
    const engine = new ElkLayoutEngine() as any;
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'A', shape: 'circle' },
        { id: 'B', shape: 'circle' },
      ],
      edges: [{ from: 'A', to: 'B' }],
    };
    const edges: RoutedEdge[] = [
      {
        from: 'A',
        to: 'B',
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 20, y: 20 },
        ],
      },
    ];

    engine.simplifyRadialEdges(diagram, edges);

    expect(edges[0].points).toHaveLength(4);
  });

  it('finds nearest anchors and applies snapping', () => {
    const engine = new ElkLayoutEngine() as any;

    const nearest = engine.findNearestAnchor(
      { x: 12, y: 2 },
      [
        { x: 0, y: 0, name: 'left' },
        { x: 20, y: 0, name: 'right' },
      ],
      { id: 'A', x: 10, y: 0, width: 40, height: 20 }
    );

    expect(nearest?.name).toBe('left');

    const edge: RoutedEdge = {
      from: 'A',
      to: 'B',
      points: [
        { x: 0, y: 0 },
        { x: 20, y: 20 },
      ],
    };

    engine.applyAnchorSnapping(
      edge,
      { x: 5, y: 5 },
      { x: 25, y: 25 },
      { x: 0, y: 0, name: 'left' },
      { x: 0, y: 0, name: 'right' },
      { id: 'A', x: 0, y: 0, width: 20, height: 20 },
      { id: 'B', x: 20, y: 20, width: 20, height: 20 }
    );

    expect(edge.points).toHaveLength(4);
    expect(edge.points[0]).toEqual({ x: 5, y: 5 });
    expect(edge.points[edge.points.length - 1]).toEqual({ x: 25, y: 25 });
  });

  it('applies anchor snapping to existing orthogonal paths', () => {
    const engine = new ElkLayoutEngine() as any;
    const edge: RoutedEdge = {
      from: 'A',
      to: 'B',
      points: [
        { x: 0, y: 0 },
        { x: 0, y: 10 },
        { x: 20, y: 10 },
        { x: 20, y: 20 },
      ],
    };

    engine.applyAnchorSnapping(
      edge,
      { x: 2, y: 2 },
      { x: 22, y: 22 },
      { x: 0, y: 0, name: 'top' },
      { x: 0, y: 0, name: 'bottom' },
      { id: 'A', x: 0, y: 0, width: 20, height: 20 },
      { id: 'B', x: 20, y: 20, width: 20, height: 20 }
    );

    expect(edge.points[0]).toEqual({ x: 2, y: 2 });
    expect(edge.points[edge.points.length - 1]).toEqual({ x: 22, y: 22 });
  });

  it('maps anchor names to orientation', () => {
    const engine = new ElkLayoutEngine() as any;

    expect(engine.getAnchorDirection('left')).toBe(Orientation.HORIZONTAL);
    expect(engine.getAnchorDirection('right')).toBe(Orientation.HORIZONTAL);
    expect(engine.getAnchorDirection('top')).toBe(Orientation.VERTICAL);
    expect(engine.getAnchorDirection('bottom')).toBe(Orientation.VERTICAL);
    expect(engine.getAnchorDirection('unknown')).toBeNull();
  });

  it('arranges sibling containers with swimlane orientation', () => {
    const engine = new ElkLayoutEngine() as any;
    const containers: ContainerDeclaration[] = [
      {
        type: 'container',
        id: 'lane1',
        label: 'Lane 1',
        children: [],
        layoutOptions: { orientation: Orientation.HORIZONTAL },
      },
      {
        type: 'container',
        id: 'lane2',
        label: 'Lane 2',
        children: [],
        layoutOptions: { orientation: Orientation.HORIZONTAL },
      },
    ];
    const placeholders = new Map<string, { width: number; height: number }>([
      ['lane1', { width: 300, height: 200 }],
      ['lane2', { width: 500, height: 200 }],
    ]);

    const positions = engine.arrangeSiblingContainers(
      containers,
      40,
      placeholders,
      'DOWN'
    );

    expect(positions.get('lane1')).toEqual({ x: 0, y: 0 });
    expect(positions.get('lane2')?.y).toBeGreaterThan(0);
  });

  it('arranges regular containers based on direction', () => {
    const engine = new ElkLayoutEngine() as any;
    const containers: ContainerDeclaration[] = [
      { type: 'container', id: 'c1', label: 'C1', children: [] },
      { type: 'container', id: 'c2', label: 'C2', children: [] },
    ];
    const placeholders = new Map<string, { width: number; height: number }>([
      ['c1', { width: 200, height: 100 }],
      ['c2', { width: 200, height: 100 }],
    ]);

    const positions = engine.arrangeSiblingContainers(
      containers,
      40,
      placeholders,
      'RIGHT'
    );

    expect(positions.get('c2')?.x).toBeGreaterThan(0);
  });

  it('arranges BPMN lanes with uniform widths', () => {
    const engine = new ElkLayoutEngine() as any;
    const lanes: ContainerDeclaration[] = [
      { type: 'container', id: 'laneA', label: 'Lane A', children: [] },
      { type: 'container', id: 'laneB', label: 'Lane B', children: [] },
    ];
    const placeholders = new Map<string, { width: number; height: number }>([
      ['laneA', { width: 350, height: 120 }],
      ['laneB', { width: 420, height: 140 }],
    ]);

    const positions = engine.arrangeBpmnLanes(lanes, placeholders, 80);

    expect(positions.get('laneA')).toEqual({ x: 0, y: 0 });
    expect(positions.get('laneB')?.y).toBeGreaterThan(0);
    expect(placeholders.get('laneA')?.width).toBe(420);
    expect(placeholders.get('laneB')?.width).toBe(420);
  });

  it('builds container maps and ancestry chains', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeContainerMap = new Map<string, string>();
    const containerMap = new Map<string, ContainerDeclaration>();
    const containers: ContainerDeclaration[] = [
      {
        type: 'container',
        id: 'parent',
        label: 'Parent',
        children: ['A'],
        containers: [
          {
            type: 'container',
            id: 'child',
            label: 'Child',
            children: ['B'],
          },
        ],
      },
    ];

    engine.buildContainerMap(containers, nodeContainerMap, containerMap);

    expect(containerMap.has('parent')).toBe(true);
    expect(containerMap.has('child')).toBe(true);
    expect(nodeContainerMap.get('A')).toBe('parent');
    expect(nodeContainerMap.get('B')).toBe('child');
    expect(nodeContainerMap.get('__parent__child')).toBe('parent');

    const chain = engine.getAncestorChain('child', nodeContainerMap);
    expect(chain).toEqual(['child', 'parent']);
  });

  it('recalculates cross-container edges', () => {
    const engine = new ElkLayoutEngine() as any;
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'A', shape: 'rounded' },
        { id: 'B', shape: 'rounded' },
      ],
      edges: [{ from: 'A', to: 'B' }],
    };
    const nodeContainerMap = new Map<string, string>([['A', 'c1']]);
    const nodes: PositionedNode[] = [
      { id: 'A', x: 0, y: 0, width: 40, height: 20 },
      { id: 'B', x: 120, y: 60, width: 40, height: 20 },
    ];
    const edges: RoutedEdge[] = [{ from: 'A', to: 'B', points: [] }];

    engine.recalculateCrossContainerEdges(diagram, nodeContainerMap, nodes, edges, 'DOWN');

    expect(edges[0].points.length).toBeGreaterThanOrEqual(2);
  });

  it('applies uniform swimlane dimensions and adjusts nodes', () => {
    const engine = new ElkLayoutEngine() as any;
    const containers: ContainerDeclaration[] = [
      {
        type: 'container',
        id: 'lane1',
        label: 'Lane 1',
        children: ['A'],
        layoutOptions: { orientation: Orientation.HORIZONTAL },
      },
      {
        type: 'container',
        id: 'lane2',
        label: 'Lane 2',
        children: ['B'],
        layoutOptions: { orientation: Orientation.HORIZONTAL },
      },
    ];
    const positionedContainers: PositionedContainer[] = [
      { id: 'lane1', x: 0, y: 10, width: 300, height: 120 },
      { id: 'lane2', x: 0, y: 200, width: 420, height: 100 },
    ];
    const nodes: PositionedNode[] = [
      { id: 'A', x: 20, y: 20, width: 40, height: 20 },
      { id: 'B', x: 20, y: 220, width: 40, height: 20 },
    ];
    const edges: RoutedEdge[] = [
      { from: 'A', to: 'B', points: [{ x: 40, y: 30 }, { x: 40, y: 230 }] },
    ];
    const nodeContainerMap = new Map<string, string>([
      ['A', 'lane1'],
      ['B', 'lane2'],
    ]);

    engine.applyUniformSwimlaneDimensions(
      containers,
      positionedContainers,
      nodes,
      edges,
      'DOWN',
      nodeContainerMap
    );

    expect(positionedContainers[0].width).toBe(positionedContainers[1].width);
    expect(nodes[0].y).toBeLessThan(nodes[1].y);
    expect(edges[0].points.length).toBeGreaterThanOrEqual(2);
  });

  it('applies uniform vertical swimlane sizing', () => {
    const engine = new ElkLayoutEngine() as any;
    const containers: ContainerDeclaration[] = [
      {
        type: 'container',
        id: 'v1',
        label: 'V1',
        children: ['A'],
        layoutOptions: { orientation: Orientation.VERTICAL },
      },
      {
        type: 'container',
        id: 'v2',
        label: 'V2',
        children: ['B'],
        layoutOptions: { orientation: Orientation.VERTICAL },
      },
    ];
    const positionedContainers: PositionedContainer[] = [
      { id: 'v1', x: 10, y: 0, width: 180, height: 200 },
      { id: 'v2', x: 220, y: 0, width: 240, height: 260 },
    ];
    const nodes: PositionedNode[] = [
      { id: 'A', x: 20, y: 20, width: 40, height: 20 },
      { id: 'B', x: 240, y: 20, width: 40, height: 20 },
    ];
    const edges: RoutedEdge[] = [];
    const nodeContainerMap = new Map<string, string>([
      ['A', 'v1'],
      ['B', 'v2'],
    ]);

    engine.applyUniformSwimlaneDimensions(
      containers,
      positionedContainers,
      nodes,
      edges,
      'RIGHT',
      nodeContainerMap
    );

    expect(positionedContainers[0].height).toBe(positionedContainers[1].height);
    expect(nodes[0].x).toBeLessThan(nodes[1].x);
  });

  it('applies BPMN pool sizing and stretches lanes', () => {
    const engine = new ElkLayoutEngine() as any;
    const containers: ContainerDeclaration[] = [
      {
        type: 'container',
        id: 'pool1',
        label: 'Pool 1',
        shape: 'bpmnPool',
        children: [],
      },
      {
        type: 'container',
        id: 'pool2',
        label: 'Pool 2',
        shape: 'bpmnPool',
        children: [],
      },
    ];
    const positionedContainers: PositionedContainer[] = [
      {
        id: 'pool1',
        x: 0,
        y: 0,
        width: 300,
        height: 200,
        containers: [{ id: 'lane1', x: 0, y: 0, width: 200, height: 80 }],
      },
      {
        id: 'pool2',
        x: 0,
        y: 240,
        width: 500,
        height: 200,
        containers: [{ id: 'lane2', x: 0, y: 0, width: 200, height: 80 }],
      },
    ];

    engine.applyUniformBpmnPoolDimensions(containers, positionedContainers);
    engine.stretchBpmnLanesInPools(containers, positionedContainers);

    expect(positionedContainers[0].width).toBe(positionedContainers[1].width);
    const stretchedWidth = positionedContainers[1].containers?.[0].width ?? 0;
    expect(stretchedWidth).toBeGreaterThan(0);
  });

  it('skips BPMN sizing when only one pool exists', () => {
    const engine = new ElkLayoutEngine() as any;
    const containers: ContainerDeclaration[] = [
      {
        type: 'container',
        id: 'pool1',
        label: 'Pool 1',
        shape: 'bpmnPool',
        children: [],
      },
    ];
    const positionedContainers: PositionedContainer[] = [
      { id: 'pool1', x: 0, y: 0, width: 300, height: 200 },
    ];

    engine.applyUniformBpmnPoolDimensions(containers, positionedContainers);

    expect(positionedContainers[0].width).toBe(300);
  });
  it('finds lowest common ancestor and distributes edges', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeContainerMap = new Map<string, string>();
    nodeContainerMap.set('A', 'parent');
    nodeContainerMap.set('B', 'child');
    nodeContainerMap.set('__parent__child', 'parent');

    expect(engine.findLowestCommonAncestor('parent', 'child', nodeContainerMap)).toBe(
      'parent'
    );
    expect(engine.findLowestCommonAncestor(undefined, 'child', nodeContainerMap)).toBeNull();

    const elkGraph: any = {
      id: 'root',
      children: [
        { id: 'parent', children: [{ id: 'child' }], edges: [] },
      ],
      edges: [],
    };

    engine.distributeEdges(
      [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
      ],
      elkGraph,
      nodeContainerMap
    );

    expect(elkGraph.edges.length).toBeGreaterThan(0);
  });

  it('finds elk nodes by id', () => {
    const engine = new ElkLayoutEngine() as any;
    const elkGraph: any = {
      id: 'root',
      children: [
        { id: 'level1', children: [{ id: 'level2' }] },
      ],
    };

    expect(engine.findElkNodeById(elkGraph, 'level2')?.id).toBe('level2');
    expect(engine.findElkNodeById(elkGraph, 'missing')).toBeNull();
  });

  it('calculates mindmap levels from root', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeLevels = new Map<string, number>();
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'root', shape: 'circle' },
        { id: 'child1', shape: 'rounded' },
        { id: 'child2', shape: 'rounded' },
      ],
      edges: [
        { from: 'root', to: 'child1' },
        { from: 'root', to: 'child2' },
      ],
    };

    const rootId = engine.calculateMindmapLevels(diagram, nodeLevels);

    expect(rootId).toBe('root');
    expect(nodeLevels.get('root')).toBe(0);
    expect(nodeLevels.get('child1')).toBe(1);
    expect(nodeLevels.get('child2')).toBe(1);
  });

  it('selects circle node when graph is cyclic', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeLevels = new Map<string, number>();
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'n1', shape: 'rounded' },
        { id: 'n2', shape: 'circle' },
        { id: 'n3', shape: 'rounded' },
      ],
      edges: [
        { from: 'n1', to: 'n2' },
        { from: 'n2', to: 'n3' },
        { from: 'n3', to: 'n1' },
      ],
    };

    const rootId = engine.calculateMindmapLevels(diagram, nodeLevels);

    expect(rootId).toBe('n2');
    expect(nodeLevels.get('n2')).toBe(0);
  });

  it('falls back to first node when no roots have circle shape', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeLevels = new Map<string, number>();
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'a', shape: 'rounded' },
        { id: 'b', shape: 'rounded' },
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'a' },
      ],
    };

    const rootId = engine.calculateMindmapLevels(diagram, nodeLevels);

    expect(rootId).toBe('a');
    expect(nodeLevels.get('a')).toBe(0);
  });

  it('prefers circle node when multiple roots exist', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeLevels = new Map<string, number>();
    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'root1', shape: 'circle' },
        { id: 'root2', shape: 'rounded' },
        { id: 'child', shape: 'rounded' },
      ],
      edges: [{ from: 'root2', to: 'child' }],
    };

    const rootId = engine.calculateMindmapLevels(diagram, nodeLevels);

    expect(rootId).toBe('root1');
    expect(nodeLevels.get('root1')).toBe(0);
  });

  it('applies mindmap styling defaults to nodes and edges', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeLevels = new Map<string, number>([
      ['root', 0],
      ['child', 1],
      ['leaf', 2],
    ]);

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'root', shape: 'circle' },
        { id: 'child', shape: 'rounded' },
        { id: 'leaf', shape: 'rounded' },
      ],
      edges: [
        { from: 'root', to: 'child' },
        { from: 'child', to: 'leaf' },
      ],
    };

    engine.applyMindmapLevelStyling(diagram, nodeLevels);

    const root = diagram.nodes.find((n) => n.id === 'root')!;
    const leaf = diagram.nodes.find((n) => n.id === 'leaf')!;

    expect(root.data?.mindmapLevel).toBe(0);
    expect(leaf.data?.mindmapLevel).toBe(2);
    expect(diagram.edges[0].arrowType).toBeDefined();
    expect(diagram.edges[0].strokeWidth).toBeGreaterThan(1);
  });

  it('preserves explicit branch colors and fills missing child strokes', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeLevels = new Map<string, number>([
      ['root', 0],
      ['branch', 1],
      ['leaf', 2],
    ]);

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'root', shape: 'circle' },
        {
          id: 'branch',
          shape: 'rounded',
          data: { fillColor: '#123456' },
        },
        {
          id: 'leaf',
          shape: 'rounded',
          data: { fillColor: '#abcdef' },
        },
      ],
      edges: [
        { from: 'root', to: 'branch' },
        { from: 'branch', to: 'leaf' },
      ],
    };

    engine.applyMindmapLevelStyling(diagram, nodeLevels);

    const branch = diagram.nodes.find((n) => n.id === 'branch')!;
    const leaf = diagram.nodes.find((n) => n.id === 'leaf')!;

    expect(branch.data?.fillColor).toBe('#123456');
    expect(leaf.data?.strokeColor).toBeDefined();
  });

  it('calculates pedigree generations and spouse pairs', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeGenerations = new Map<string, number>();
    const spousePairs = new Map<string, string>();

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'p1', shape: 'pedigree-male' },
        { id: 'p2', shape: 'pedigree-female' },
        { id: 'child', shape: 'pedigree-male' },
      ],
      edges: [
        { from: 'p1', to: 'p2' },
        { from: 'p2', to: 'p1' },
        { from: 'p1', to: 'child' },
        { from: 'p2', to: 'child' },
      ],
    };

    engine.calculatePedigreeGenerations(diagram, nodeGenerations, spousePairs);

    expect(nodeGenerations.get('p1')).toBe(0);
    expect(nodeGenerations.get('p2')).toBe(0);
    expect(nodeGenerations.get('child')).toBe(1);
    expect(spousePairs.get('p1')).toBe('p2');
    expect(spousePairs.get('p2')).toBe('p1');
  });

  it('adds unvisited spouses during pedigree traversal', () => {
    const engine = new ElkLayoutEngine() as any;
    const nodeGenerations = new Map<string, number>();
    const spousePairs = new Map<string, string>();

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [
        { id: 'p1', shape: 'pedigree-male' },
        { id: 'p2', shape: 'pedigree-female' },
        { id: 'child', shape: 'pedigree-male' },
      ],
      edges: [
        { from: 'p1', to: 'p2' },
        { from: 'p2', to: 'p1' },
        { from: 'p1', to: 'child' },
      ],
    };

    engine.calculatePedigreeGenerations(diagram, nodeGenerations, spousePairs);

    expect(nodeGenerations.get('p1')).toBe(0);
    expect(nodeGenerations.get('p2')).toBe(0);
    expect(nodeGenerations.get('child')).toBe(1);
  });
});
