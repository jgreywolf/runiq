/**
 * Unescape string values from DSL
 * Handles:
 * - Quoted strings: "hello" -> hello
 * - Escaped quotes: \"hello\" -> "hello"
 * - Escaped newlines: \n -> actual newline
 * - Escaped backslashes: \\ -> \
 */
export function unescapeString(value: string): string {
  // If string starts and ends with quotes, remove them
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }

  // Unescape special characters
  return value
    .replace(/\\"/g, '"') // Unescape quotes
    .replace(/\\n/g, '\n') // Unescape newlines
    .replace(/\\t/g, '\t') // Unescape tabs
    .replace(/\\r/g, '\r') // Unescape carriage returns
    .replace(/\\\\/g, '\\'); // Unescape backslashes (must be last)
}
