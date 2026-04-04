export interface DiagnosticMessageContext {
  text: string;
  lineOneBased?: number;
  tokenImage?: string;
}

const SHAPE_PROPERTY_KEYS = new Set<string>([
  'label',
  'style',
  'fillColor',
  'strokeColor',
  'strokeWidth',
  'fontSize',
  'fontFamily',
  'textAlign',
  'fontWeight',
  'opacity',
  'borderRadius',
  'icon',
  'iconColor',
  'iconSize',
  'link',
  'tooltip',
  'data',
  'source',
  'showLegend',
  'showPointLabels',
  'showValues',
  'legendPosition',
  'innerRadius',
  'stacked',
  'colors',
  'labels',
  'intersections',
  'title',
  'xLabel',
  'yLabel',
  'position',
  'routing',
  'textColor',
  'shadow',
  'shape',
  'type',
  'value',
  'format',
  'name',
  'id'
]);

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 0)
  );

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function getClosestPropertySuggestion(candidate: string): string | undefined {
  let best: { key: string; dist: number } | undefined;
  for (const key of SHAPE_PROPERTY_KEYS) {
    const dist = levenshteinDistance(candidate, key);
    if (!best || dist < best.dist) best = { key, dist };
  }
  if (!best) return undefined;
  return best.dist <= 3 ? best.key : undefined;
}

function findPropertyCandidate(lineText: string): string | undefined {
  const matches = [...lineText.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g)];
  if (matches.length === 0) return undefined;
  return matches[matches.length - 1]?.[1];
}

function hasUnbalancedDoubleQuotes(lineText: string): boolean {
  const quoteCount = (lineText.match(/"/g) ?? []).length;
  return quoteCount % 2 === 1;
}

function appendHint(baseMessage: string, hint: string): string {
  if (baseMessage.includes('Hint:')) return baseMessage;
  return `${baseMessage} Hint: ${hint}`;
}

function getLineText(text: string, lineOneBased?: number): string {
  if (!lineOneBased || lineOneBased < 1) return '';
  return text.split(/\r?\n/)[lineOneBased - 1] ?? '';
}

export function enrichLexerDiagnosticMessage(
  message: string,
  context: DiagnosticMessageContext
): string {
  const lineText = getLineText(context.text, context.lineOneBased);
  if (lineText && hasUnbalancedDoubleQuotes(lineText)) {
    return appendHint(message, 'Possible missing closing quote (").');
  }
  return message;
}

export function enrichDiagnosticMessage(
  message: string,
  context: DiagnosticMessageContext
): string {
  const lineText = getLineText(context.text, context.lineOneBased);
  const tokenImage = context.tokenImage;

  if (
    (tokenImage === ':' || message.includes("but found: ':'")) &&
    lineText &&
    /\bshape\s+\S+/.test(lineText)
  ) {
    const candidate = findPropertyCandidate(lineText);
    if (candidate && !SHAPE_PROPERTY_KEYS.has(candidate)) {
      const suggestion = getClosestPropertySuggestion(candidate);
      return suggestion
        ? `Unknown property "${candidate}". Did you mean "${suggestion}"?`
        : `Unknown property "${candidate}".`;
    }
  }

  if (
    message.includes("Expecting token of type ':'") ||
    message.includes("Expecting token of type ':' but found")
  ) {
    return appendHint(
      message,
      'Missing ":" between attribute name and value (example: label:"My Label").'
    );
  }

  const expectsString =
    message.includes("Expecting token of type 'STRING'") ||
    message.includes('[STRING]');
  const foundStringToken =
    message.includes("but found: '\"");

  const likelyMissingColonBeforeString =
    !!lineText &&
    /\b[a-zA-Z_][a-zA-Z0-9_]*\s*"[^"]*"/.test(lineText) &&
    !/\b[a-zA-Z_][a-zA-Z0-9_]*\s*:\s*"[^"]*"/.test(lineText);
  if ((expectsString || foundStringToken) && likelyMissingColonBeforeString) {
    return appendHint(
      message,
      'Missing ":" between attribute name and value (example: label:"My Label").'
    );
  }

  if (expectsString) {
    if (lineText && hasUnbalancedDoubleQuotes(lineText)) {
      return appendHint(message, 'Missing closing quote (").');
    }
    return appendHint(
      message,
      'String values must be in double quotes (example: label:"My Label").'
    );
  }

  return message;
}
