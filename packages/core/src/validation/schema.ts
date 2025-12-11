import { z } from 'zod';
import { Direction } from '../constants.js';
import type {
  DiagramAst,
  EdgeAst,
  GroupAst,
  IconRef,
  LinkRef,
  NodeAst,
  Style,
} from '../types.js';

const DirectionSchema = z.nativeEnum(Direction);

const StyleSchema = z
  .record(z.unknown())
  .refine((val): val is Style => typeof val === 'object' && val !== null);

const IconRefSchema = z.object({
  provider: z.string(),
  name: z.string(),
}) satisfies z.ZodType<IconRef>;

const LinkRefSchema = z.object({
  href: z.string(),
  target: z.enum(['_blank', '_self', '_parent', '_top']).optional(),
  rel: z.string().optional(),
}) satisfies z.ZodType<LinkRef>;

const NodeAstSchema = z.object({
  id: z.string(),
  shape: z.string(),
  label: z.string().optional(),
  style: z.string().optional(),
  icon: IconRefSchema.optional(),
  link: LinkRefSchema.optional(),
  tooltip: z.string().optional(),
  data: z.record(z.unknown()).optional(),
}) satisfies z.ZodType<NodeAst>;

const EdgeAstSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
  when: z.string().optional(),
  style: z.string().optional(),
  link: LinkRefSchema.optional(),
  tooltip: z.string().optional(),
  data: z.record(z.unknown()).optional(),
}) satisfies z.ZodType<EdgeAst>;

const GroupAstSchema = z.object({
  id: z.string().optional(),
  label: z.string().optional(),
  children: z.array(z.string()),
  style: z.string().optional(),
}) satisfies z.ZodType<GroupAst>;

export const DiagramAstSchema = z.object({
  astVersion: z.string(),
  title: z.string().optional(),
  direction: DirectionSchema.optional(),
  styles: z.record(StyleSchema).optional(),
  nodes: z.array(NodeAstSchema),
  edges: z.array(EdgeAstSchema),
  groups: z.array(GroupAstSchema).optional(),
}) satisfies z.ZodType<DiagramAst>;

export type ValidationResult<T> =
  | { success: true; data: T; problems: never[] }
  | { success: false; data: never; problems: string[] };

export function validateDiagram(data: unknown): ValidationResult<DiagramAst> {
  const result = DiagramAstSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data, problems: [] };
  }

  const problems = result.error.errors.map(
    (err) => `${err.path.join('.')}: ${err.message}`
  );

  return { success: false, data: undefined as never, problems };
}
