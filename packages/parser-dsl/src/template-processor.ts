/**
 * Template Processor Module
 * Phase 2.2: Variable Substitution Implementation
 * Phase 3.3: Dynamic Shape Generator Integration
 * Phase 3.4: Legend Generation Integration
 *
 * Processes data-driven templates to generate diagram elements (nodes, edges).
 * Integrates with dynamic shape generator for auto-generating nodes/edges with style mapping.
 * Supports automatic legend generation for visualizing style mappings.
 */

import {
  evaluateExpression,
  evaluateExpressionValue,
  type DataContext,
} from './template-evaluator.js';
import {
  generateNodes,
  generateEdges,
  generateNodesAndEdges,
  type NodeGenerationConfig,
  type EdgeGenerationConfig,
  type GeneratedNode,
  type GeneratedEdge,
  type StyleMappingConfig,
} from './dynamic-shape-generator.js';
import {
  generateLegendsFromMappings,
  type Legend,
  type LegendConfig,
} from './legendGenerator.js';

/**
 * Generic data object (compatible with @runiq/core DataObject)
 */
export type DataObject = Record<string, unknown>;

/**
 * Data template definition from parsed AST
 */
export interface DataTemplate {
  id: string;
  dataKey: string;
  filter?: string;
  limit?: number;
  statements: TemplateStatement[];
}

/**
 * Template statement types
 */
export type TemplateStatement =
  | TemplateNodeStatement
  | TemplateEdgeStatement
  | ConditionalStatement
  | LoopStatement
  | TemplateCallStatement;

/**
 * Template node declaration
 */
export interface TemplateNodeStatement {
  type: 'node';
  id: TemplateExpression;
  shape?: string;
  properties?: Record<string, TemplateExpression>;
}

/**
 * Template edge declaration
 */
export interface TemplateEdgeStatement {
  type: 'edge';
  from: TemplateExpression;
  to: TemplateExpression;
  edgeType?: string;
  properties?: Record<string, TemplateExpression>;
}

/**
 * Conditional block (Phase 2.3)
 */
export interface ConditionalStatement {
  type: 'conditional';
  condition: TemplateExpression;
  statements: TemplateStatement[];
  elseStatements?: TemplateStatement[];
}

/**
 * Loop block (Phase 2.3)
 */
export interface LoopStatement {
  type: 'loop';
  variable: string;
  collection: TemplateExpression;
  statements: TemplateStatement[];
}

/**
 * Template call statement (Phase 2.4)
 *
 * Calls another template with optional parameters
 */
export interface TemplateCallStatement {
  type: 'template-call';
  templateId: string;
  parameters?: Record<string, TemplateExpression>;
}

/**
 * Template expression - either a literal string or variable reference
 */
export type TemplateExpression = string;

/**
 * Processed node result
 */
export interface ProcessedNode {
  id: string;
  shape: string;
  properties: Record<string, unknown>;
}

/**
 * Processed edge result
 */
export interface ProcessedEdge {
  from: string;
  to: string;
  type?: string;
  properties: Record<string, unknown>;
}

/**
 * Template processing result
 */
export interface TemplateResult {
  nodes: ProcessedNode[];
  edges: ProcessedEdge[];
  legends?: Legend[];
}

/**
 * Processing context for error reporting
 */
export interface ProcessingContext {
  templateId: string;
  dataIndex: number;
}

/**
 * Process a data template against provided data array
 *
 * @param template Template definition with statements
 * @param data Array of data objects to process
 * @returns Generated nodes and edges
 *
 * @example
 * ```typescript
 * const template = {
 *   id: 'users',
 *   dataKey: 'userData',
 *   statements: [
 *     {
 *       type: 'node',
 *       id: '${item.id}',
 *       shape: 'rect',
 *       properties: {
 *         label: '${item.name}',
 *         fill: '${item.color}'
 *       }
 *     }
 *   ]
 * };
 * const data = [
 *   { id: 'u1', name: 'Alice', color: 'blue' },
 *   { id: 'u2', name: 'Bob', color: 'green' }
 * ];
 * const result = processTemplate(template, data);
 * // result.nodes = [
 * //   { id: 'u1', shape: 'rect', properties: { label: 'Alice', fill: 'blue' } },
 * //   { id: 'u2', shape: 'rect', properties: { label: 'Bob', fill: 'green' } }
 * // ]
 * ```
 */
export function processTemplate(
  template: DataTemplate,
  data: DataObject[]
): TemplateResult {
  const nodes: ProcessedNode[] = [];
  const edges: ProcessedEdge[] = [];

  // Apply filter if specified
  let filteredData = data;
  if (template.filter) {
    filteredData = data.filter((item, index) => {
      const filterContext: DataContext = {
        item,
        index,
        length: data.length,
      };

      try {
        const result = evaluateExpressionValue(template.filter!, filterContext);
        return isTruthy(result);
      } catch (error) {
        console.error(
          `[Template ${template.id}] Error evaluating filter for item ${index}:`,
          error
        );
        return false;
      }
    });
  }

  // Apply limit if specified
  if (template.limit !== undefined && template.limit > 0) {
    filteredData = filteredData.slice(0, template.limit);
  }

  // Process each data item
  filteredData.forEach((item, index) => {
    const context: ProcessingContext = {
      templateId: template.id,
      dataIndex: index,
    };

    // Create data context with 'item' variable
    const dataContext: DataContext = { item };

    // Process template statements
    const result = processStatements(template.statements, dataContext, context);
    nodes.push(...result.nodes);
    edges.push(...result.edges);
  });

  return { nodes, edges };
}

/**
 * Process a list of template statements
 */
function processStatements(
  statements: TemplateStatement[],
  dataContext: DataContext,
  context: ProcessingContext
): TemplateResult {
  const nodes: ProcessedNode[] = [];
  const edges: ProcessedEdge[] = [];

  for (const statement of statements) {
    switch (statement.type) {
      case 'node': {
        const node = processNodeStatement(statement, dataContext, context);
        if (node) nodes.push(node);
        break;
      }
      case 'edge': {
        const edge = processEdgeStatement(statement, dataContext, context);
        if (edge) edges.push(edge);
        break;
      }
      case 'conditional': {
        const result = processConditionalStatement(
          statement,
          dataContext,
          context
        );
        nodes.push(...result.nodes);
        edges.push(...result.edges);
        break;
      }
      case 'loop': {
        const result = processLoopStatement(statement, dataContext, context);
        nodes.push(...result.nodes);
        edges.push(...result.edges);
        break;
      }
      case 'template-call': {
        // Template calls need template registry, handled separately
        console.warn(
          `[Template ${context.templateId}] Template calls not yet supported in this context`
        );
        break;
      }
    }
  }

  return { nodes, edges };
}

/**
 * Process a template node statement
 */
function processNodeStatement(
  statement: TemplateNodeStatement,
  dataContext: DataContext,
  context: ProcessingContext
): ProcessedNode | null {
  try {
    // Evaluate node ID (preserve type for numeric/string IDs)
    const id = evaluateExpressionValue(statement.id, dataContext);
    if (id === undefined || id === null) {
      console.warn(
        `[Template ${context.templateId}] Node ID is undefined at index ${context.dataIndex}`
      );
      return null;
    }

    // Evaluate shape (could be an expression)
    let shape = 'rect'; // default
    if (statement.shape) {
      // Check if shape contains variable expression
      if (statement.shape.includes('${')) {
        shape = evaluateExpression(statement.shape, dataContext);
      } else {
        shape = statement.shape;
      }
    }

    // Evaluate all properties
    const properties: Record<string, unknown> = {};
    if (statement.properties) {
      for (const [key, valueExpr] of Object.entries(statement.properties)) {
        // For most properties, we want string values
        // Special handling for certain properties could be added here
        if (
          key === 'fillColor' ||
          key === 'stroke' ||
          key === 'label' ||
          key === 'text'
        ) {
          properties[key] = evaluateExpression(valueExpr, dataContext);
        } else {
          // For other properties, preserve type
          properties[key] = evaluateExpressionValue(valueExpr, dataContext);
        }
      }
    }

    return {
      id: String(id),
      shape,
      properties,
    };
  } catch (error) {
    console.error(
      `[Template ${context.templateId}] Error processing node at index ${context.dataIndex}:`,
      error
    );
    return null;
  }
}

/**
 * Process a template edge statement
 */
function processEdgeStatement(
  statement: TemplateEdgeStatement,
  dataContext: DataContext,
  context: ProcessingContext
): ProcessedEdge | null {
  try {
    // Evaluate from and to IDs
    const from = evaluateExpressionValue(statement.from, dataContext);
    const to = evaluateExpressionValue(statement.to, dataContext);

    if (
      from === undefined ||
      from === null ||
      to === undefined ||
      to === null
    ) {
      console.warn(
        `[Template ${context.templateId}] Edge endpoints undefined at index ${context.dataIndex}`
      );
      return null;
    }

    // Evaluate properties
    const properties: Record<string, unknown> = {};
    if (statement.properties) {
      for (const [key, valueExpr] of Object.entries(statement.properties)) {
        if (key === 'label' || key === 'stroke' || key === 'fill') {
          properties[key] = evaluateExpression(valueExpr, dataContext);
        } else {
          properties[key] = evaluateExpressionValue(valueExpr, dataContext);
        }
      }
    }

    return {
      from: String(from),
      to: String(to),
      type: statement.edgeType,
      properties,
    };
  } catch (error) {
    console.error(
      `[Template ${context.templateId}] Error processing edge at index ${context.dataIndex}:`,
      error
    );
    return null;
  }
}

/**
 * Process a conditional statement
 *
 * Evaluates the condition expression and processes the statements if truthy.
 * Supports else blocks for false conditions.
 *
 * @example
 * ```
 * if ${item.active} {
 *   node ${item.id} shape:rect label:"Active: ${item.name}"
 * }
 * ```
 */
function processConditionalStatement(
  statement: ConditionalStatement,
  dataContext: DataContext,
  context: ProcessingContext
): TemplateResult {
  try {
    // Evaluate condition expression
    const conditionValue = evaluateExpressionValue(
      statement.condition,
      dataContext
    );

    // Check truthiness (JavaScript semantics)
    const isTrue = isTruthy(conditionValue);

    // Process appropriate branch
    if (isTrue) {
      return processStatements(statement.statements, dataContext, context);
    } else if (statement.elseStatements) {
      return processStatements(statement.elseStatements, dataContext, context);
    }

    return { nodes: [], edges: [] };
  } catch (error) {
    console.error(
      `[Template ${context.templateId}] Error processing conditional at index ${context.dataIndex}:`,
      error
    );
    return { nodes: [], edges: [] };
  }
}

/**
 * Process a loop statement
 *
 * Evaluates the collection expression and iterates over each item,
 * processing the loop body with the loop variable in context.
 *
 * @example
 * ```
 * for user in ${item.members} {
 *   node ${user.id} shape:circle label:${user.name}
 * }
 * ```
 */
function processLoopStatement(
  statement: LoopStatement,
  dataContext: DataContext,
  context: ProcessingContext
): TemplateResult {
  try {
    // Evaluate collection expression
    const collectionValue = evaluateExpressionValue(
      statement.collection,
      dataContext
    );

    // Ensure we have an array
    if (!Array.isArray(collectionValue)) {
      console.warn(
        `[Template ${context.templateId}] Loop collection is not an array at index ${context.dataIndex}:`,
        collectionValue
      );
      return { nodes: [], edges: [] };
    }

    const allNodes: ProcessedNode[] = [];
    const allEdges: ProcessedEdge[] = [];

    // Iterate over collection
    collectionValue.forEach((loopItem: unknown, loopIndex: number) => {
      // Create new context with loop variable
      const loopContext: DataContext = {
        ...dataContext,
        [statement.variable]: loopItem as Record<string, unknown>,
        [`${statement.variable}_index`]: loopIndex,
        [`${statement.variable}_first`]: loopIndex === 0,
        [`${statement.variable}_last`]:
          loopIndex === collectionValue.length - 1,
      };

      // Process loop body
      const result = processStatements(
        statement.statements,
        loopContext,
        context
      );
      allNodes.push(...result.nodes);
      allEdges.push(...result.edges);
    });

    return { nodes: allNodes, edges: allEdges };
  } catch (error) {
    console.error(
      `[Template ${context.templateId}] Error processing loop at index ${context.dataIndex}:`,
      error
    );
    return { nodes: [], edges: [] };
  }
}

/**
 * Determine truthiness of a value (JavaScript semantics)
 *
 * Falsy values: false, 0, '', null, undefined, NaN
 * Truthy values: everything else (including empty arrays/objects)
 */
function isTruthy(value: unknown): boolean {
  // Explicit false checks
  if (
    value === false ||
    value === 0 ||
    value === '' ||
    value === null ||
    value === undefined
  ) {
    return false;
  }

  // NaN check
  if (typeof value === 'number' && isNaN(value)) {
    return false;
  }

  // Everything else is truthy (including empty arrays/objects)
  return true;
}

/**
 * Template registry for composition support
 */
export type TemplateRegistry = Map<string, DataTemplate>;

/**
 * Processing options with template registry
 */
export interface ProcessingOptions {
  templateRegistry?: TemplateRegistry;
}

/**
 * Process statements with template call support
 */
function processStatementsWithRegistry(
  statements: TemplateStatement[],
  dataContext: DataContext,
  context: ProcessingContext,
  options: ProcessingOptions
): TemplateResult {
  const nodes: ProcessedNode[] = [];
  const edges: ProcessedEdge[] = [];

  for (const statement of statements) {
    switch (statement.type) {
      case 'node': {
        const node = processNodeStatement(statement, dataContext, context);
        if (node) nodes.push(node);
        break;
      }
      case 'edge': {
        const edge = processEdgeStatement(statement, dataContext, context);
        if (edge) edges.push(edge);
        break;
      }
      case 'conditional': {
        const result = processConditionalStatementWithRegistry(
          statement,
          dataContext,
          context,
          options
        );
        nodes.push(...result.nodes);
        edges.push(...result.edges);
        break;
      }
      case 'loop': {
        const result = processLoopStatementWithRegistry(
          statement,
          dataContext,
          context,
          options
        );
        nodes.push(...result.nodes);
        edges.push(...result.edges);
        break;
      }
      case 'template-call': {
        const result = processTemplateCall(
          statement,
          dataContext,
          context,
          options
        );
        nodes.push(...result.nodes);
        edges.push(...result.edges);
        break;
      }
    }
  }

  return { nodes, edges };
}

/**
 * Process a template call statement
 *
 * Looks up the referenced template and processes it with merged context
 */
function processTemplateCall(
  statement: TemplateCallStatement,
  dataContext: DataContext,
  context: ProcessingContext,
  options: ProcessingOptions
): TemplateResult {
  if (!options.templateRegistry) {
    console.warn(
      `[Template ${context.templateId}] No template registry available for template call`
    );
    return { nodes: [], edges: [] };
  }

  const referencedTemplate = options.templateRegistry.get(statement.templateId);
  if (!referencedTemplate) {
    console.warn(
      `[Template ${context.templateId}] Template not found: ${statement.templateId}`
    );
    return { nodes: [], edges: [] };
  }

  try {
    // Evaluate parameters and merge into context
    const callContext: DataContext = { ...dataContext };
    if (statement.parameters) {
      for (const [key, valueExpr] of Object.entries(statement.parameters)) {
        callContext[key] = evaluateExpressionValue(valueExpr, dataContext);
      }
    }

    // Process the referenced template's statements with the call context
    return processStatementsWithRegistry(
      referencedTemplate.statements,
      callContext,
      { templateId: statement.templateId, dataIndex: context.dataIndex },
      options
    );
  } catch (error) {
    console.error(
      `[Template ${context.templateId}] Error processing template call to ${statement.templateId}:`,
      error
    );
    return { nodes: [], edges: [] };
  }
}

/**
 * Process conditional with registry support
 */
function processConditionalStatementWithRegistry(
  statement: ConditionalStatement,
  dataContext: DataContext,
  context: ProcessingContext,
  options: ProcessingOptions
): TemplateResult {
  try {
    const conditionValue = evaluateExpressionValue(
      statement.condition,
      dataContext
    );
    const isTrue = isTruthy(conditionValue);

    if (isTrue) {
      return processStatementsWithRegistry(
        statement.statements,
        dataContext,
        context,
        options
      );
    } else if (statement.elseStatements) {
      return processStatementsWithRegistry(
        statement.elseStatements,
        dataContext,
        context,
        options
      );
    }

    return { nodes: [], edges: [] };
  } catch (error) {
    console.error(
      `[Template ${context.templateId}] Error processing conditional:`,
      error
    );
    return { nodes: [], edges: [] };
  }
}

/**
 * Process loop with registry support
 */
function processLoopStatementWithRegistry(
  statement: LoopStatement,
  dataContext: DataContext,
  context: ProcessingContext,
  options: ProcessingOptions
): TemplateResult {
  try {
    const collectionValue = evaluateExpressionValue(
      statement.collection,
      dataContext
    );

    if (!Array.isArray(collectionValue)) {
      console.warn(
        `[Template ${context.templateId}] Loop collection is not an array at index ${context.dataIndex}`
      );
      return { nodes: [], edges: [] };
    }

    const allNodes: ProcessedNode[] = [];
    const allEdges: ProcessedEdge[] = [];

    collectionValue.forEach((loopItem: unknown, loopIndex: number) => {
      const loopContext: DataContext = {
        ...dataContext,
        [statement.variable]: loopItem as Record<string, unknown>,
        [`${statement.variable}_index`]: loopIndex,
        [`${statement.variable}_first`]: loopIndex === 0,
        [`${statement.variable}_last`]:
          loopIndex === collectionValue.length - 1,
      };

      const result = processStatementsWithRegistry(
        statement.statements,
        loopContext,
        context,
        options
      );
      allNodes.push(...result.nodes);
      allEdges.push(...result.edges);
    });

    return { nodes: allNodes, edges: allEdges };
  } catch (error) {
    console.error(
      `[Template ${context.templateId}] Error processing loop:`,
      error
    );
    return { nodes: [], edges: [] };
  }
}

/**
 * Process a template with composition support
 *
 * @param template Template definition
 * @param data Data array to process
 * @param options Processing options including template registry
 */
export function processTemplateWithComposition(
  template: DataTemplate,
  data: DataObject[],
  options: ProcessingOptions = {}
): TemplateResult {
  const nodes: ProcessedNode[] = [];
  const edges: ProcessedEdge[] = [];

  // Apply filter if specified
  let filteredData = data;
  if (template.filter) {
    filteredData = data.filter((item, index) => {
      const filterContext: DataContext = { item, index, length: data.length };
      try {
        const result = evaluateExpressionValue(template.filter!, filterContext);
        return isTruthy(result);
      } catch (error) {
        console.error(
          `[Template ${template.id}] Error evaluating filter for item ${index}:`,
          error
        );
        return false;
      }
    });
  }

  // Apply limit if specified
  if (template.limit !== undefined && template.limit > 0) {
    filteredData = filteredData.slice(0, template.limit);
  }

  // Process each data item
  filteredData.forEach((item, index) => {
    const context: ProcessingContext = {
      templateId: template.id,
      dataIndex: index,
    };

    const dataContext: DataContext = { item };
    const result = processStatementsWithRegistry(
      template.statements,
      dataContext,
      context,
      options
    );
    nodes.push(...result.nodes);
    edges.push(...result.edges);
  });

  return { nodes, edges };
}

/**
 * Apply multiple templates to their respective data sources
 *
 * @param templates Array of templates to process
 * @param dataMap Map of dataKey to data arrays
 * @returns Combined result from all templates
 *
 * @example
 * ```typescript
 * const templates = [
 *   { id: 'users', dataKey: 'userData', statements: [...] },
 *   { id: 'connections', dataKey: 'edgeData', statements: [...] }
 * ];
 * const dataMap = {
 *   userData: [{ id: 'u1', name: 'Alice' }],
 *   edgeData: [{ from: 'u1', to: 'u2' }]
 * };
 * const result = processTemplates(templates, dataMap);
 * ```
 */
export function processTemplates(
  templates: DataTemplate[],
  dataMap: Record<string, DataObject[]>
): TemplateResult {
  const allNodes: ProcessedNode[] = [];
  const allEdges: ProcessedEdge[] = [];

  // Build template registry for composition
  const registry: TemplateRegistry = new Map();
  templates.forEach((template) => registry.set(template.id, template));

  for (const template of templates) {
    const data = dataMap[template.dataKey];
    if (!data) {
      console.warn(
        `[Template ${template.id}] Data not found for key: ${template.dataKey}`
      );
      continue;
    }

    const result = processTemplateWithComposition(template, data, {
      templateRegistry: registry,
    });
    allNodes.push(...result.nodes);
    allEdges.push(...result.edges);
  }

  return {
    nodes: allNodes,
    edges: allEdges,
  };
}

// ============================================================================
// Phase 3.3: Dynamic Shape Generation Integration
// ============================================================================

/**
 * Process template with dynamic shape generation
 * Combines template processing with auto-generated nodes/edges and style mapping
 *
 * @example
 * ```typescript
 * const result = processTemplateWithGeneration(template, data, {
 *   nodeConfig: {
 *     shape: 'rect',
 *     idField: 'id',
 *     fieldMappings: { label: 'name' },
 *     styleMappings: [{
 *       property: 'fill',
 *       field: 'status',
 *       type: 'category',
 *       categories: { active: 'green', inactive: 'gray' }
 *     }]
 *   }
 * });
 * ```
 */
export function processTemplateWithGeneration(
  template: DataTemplate,
  data: DataObject[],
  options: {
    nodeConfig?: NodeGenerationConfig;
    edgeConfig?: EdgeGenerationConfig;
    templateRegistry?: TemplateRegistry;
    generateLegends?: boolean;
    legendConfig?: LegendConfig;
  } = {}
): TemplateResult {
  // First, process the template normally
  const templateResult = processTemplateWithComposition(template, data, {
    templateRegistry: options.templateRegistry,
  });

  // Then, optionally generate additional nodes/edges
  let generatedNodes: GeneratedNode[] = [];
  let generatedEdges: GeneratedEdge[] = [];

  if (options.nodeConfig) {
    generatedNodes = generateNodes(data, options.nodeConfig);
  }

  if (options.edgeConfig) {
    generatedEdges = generateEdges(data, options.edgeConfig);
  }

  // Convert generated nodes to template nodes format
  const nodes = [
    ...templateResult.nodes,
    ...generatedNodes.map((gn) => ({
      id: gn.id,
      shape: gn.shape,
      properties: gn.properties,
    })),
  ];

  // Convert generated edges to template edges format
  const edges = [
    ...templateResult.edges,
    ...generatedEdges.map((ge) => ({
      from: ge.from,
      to: ge.to,
      type: ge.type,
      properties: ge.properties,
    })),
  ];

  // Optionally generate legends from style mappings
  let legends: Legend[] | undefined;
  if (options.generateLegends) {
    const allMappings: StyleMappingConfig[] = [];
    if (options.nodeConfig?.styleMappings) {
      allMappings.push(...options.nodeConfig.styleMappings);
    }
    if (options.edgeConfig?.styleMappings) {
      allMappings.push(...options.edgeConfig.styleMappings);
    }
    if (allMappings.length > 0) {
      legends = generateLegendsFromMappings(
        allMappings,
        options.legendConfig || {}
      );
    }
  }

  return { nodes, edges, legends };
}

/**
 * Generate nodes and edges directly from relational data
 * Useful for creating network diagrams from relationship data
 *
 * @example
 * ```typescript
 * const data = [
 *   { from: 'Alice', to: 'Bob', weight: 10 },
 *   { from: 'Bob', to: 'Charlie', weight: 5 }
 * ];
 *
 * const result = generateDiagramFromRelationalData(data, {
 *   nodeConfig: { shape: 'circle' },
 *   edgeConfig: {
 *     fromField: 'from',
 *     toField: 'to',
 *     fieldMappings: { label: 'weight' }
 *   }
 * });
 * ```
 */
export function generateDiagramFromRelationalData(
  data: DataObject[],
  options: {
    nodeConfig?: Omit<NodeGenerationConfig, 'idField'>;
    edgeConfig: EdgeGenerationConfig;
    generateLegends?: boolean;
    legendConfig?: LegendConfig;
  }
): TemplateResult {
  const result = generateNodesAndEdges(data, {
    nodeConfig: options.nodeConfig,
    edgeConfig: options.edgeConfig,
  });

  // Convert to template format
  const nodes = result.nodes.map((gn) => ({
    id: gn.id,
    shape: gn.shape,
    properties: gn.properties,
  }));

  const edges = result.edges.map((ge) => ({
    from: ge.from,
    to: ge.to,
    type: ge.type,
    properties: ge.properties,
  }));

  // Optionally generate legends from style mappings
  let legends: Legend[] | undefined;
  if (options.generateLegends) {
    const allMappings: StyleMappingConfig[] = [];
    if (options.nodeConfig?.styleMappings) {
      allMappings.push(...options.nodeConfig.styleMappings);
    }
    if (options.edgeConfig.styleMappings) {
      allMappings.push(...options.edgeConfig.styleMappings);
    }
    if (allMappings.length > 0) {
      legends = generateLegendsFromMappings(
        allMappings,
        options.legendConfig || {}
      );
    }
  }

  return { nodes, edges, legends };
}

/**
 * Re-export dynamic shape generation functions for convenience
 */
export {
  generateNodes,
  generateEdges,
  generateNodesAndEdges,
  type NodeGenerationConfig,
  type EdgeGenerationConfig,
  type GeneratedNode,
  type GeneratedEdge,
  type StyleMappingConfig,
} from './dynamic-shape-generator.js';

/**
 * Re-export legend generation functions for convenience
 */
export {
  generateScaleLegend,
  generateCategoryLegend,
  generateThresholdLegend,
  generateLegendsFromMappings,
  renderLegendSVG,
  type Legend,
  type LegendEntry,
  type LegendPosition,
  type LegendConfig,
} from './legendGenerator.js';
