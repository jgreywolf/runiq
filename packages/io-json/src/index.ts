import type { DiagramAst } from '@runiq/core';
import { validateDiagram } from '@runiq/core';

export interface ConversionResult<T> {
  success: boolean;
  data?: T;
  problems: string[];
}

export function astToJson(ast: DiagramAst): ConversionResult<string> {
  try {
    const json = JSON.stringify(ast, null, 2);
    return { success: true, data: json, problems: [] };
  } catch (error) {
    return {
      success: false,
      problems: [
        `JSON serialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    };
  }
}

export function jsonToAst(json: string): ConversionResult<DiagramAst> {
  try {
    const parsed = JSON.parse(json);
    const validation = validateDiagram(parsed);

    if (validation.success) {
      return { success: true, data: validation.data, problems: [] };
    } else {
      return { success: false, problems: validation.problems };
    }
  } catch (error) {
    return {
      success: false,
      problems: [
        `JSON parse failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    };
  }
}

export function roundTrip(ast: DiagramAst): ConversionResult<DiagramAst> {
  const jsonResult = astToJson(ast);
  if (!jsonResult.success) {
    return { success: false, problems: jsonResult.problems };
  }

  return jsonToAst(jsonResult.data!);
}
