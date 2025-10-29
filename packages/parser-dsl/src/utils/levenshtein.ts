/**
 * Calculate the Levenshtein distance between two strings
 * Used for fuzzy matching and suggesting similar shape names
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  // Initialize first column
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Initialize first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Find the closest matches to a given string from a list of candidates
 * @param input The input string to match
 * @param candidates List of valid candidates
 * @param maxDistance Maximum Levenshtein distance to consider (default: 3)
 * @param maxSuggestions Maximum number of suggestions to return (default: 5)
 * @returns Array of suggestions sorted by similarity
 */
export function findClosestMatches(
  input: string,
  candidates: string[],
  maxDistance: number = 3,
  maxSuggestions: number = 5
): string[] {
  const inputLower = input.toLowerCase();
  
  // Calculate distances for all candidates
  const distances = candidates.map(candidate => ({
    candidate,
    distance: levenshteinDistance(inputLower, candidate.toLowerCase()),
    // Bonus for prefix matches
    prefixMatch: candidate.toLowerCase().startsWith(inputLower),
    // Bonus for contains matches
    containsMatch: candidate.toLowerCase().includes(inputLower)
  }));

  // Filter and sort
  return distances
    .filter(d => d.distance <= maxDistance || d.prefixMatch || d.containsMatch)
    .sort((a, b) => {
      // Prioritize prefix matches
      if (a.prefixMatch && !b.prefixMatch) return -1;
      if (!a.prefixMatch && b.prefixMatch) return 1;
      
      // Then contains matches
      if (a.containsMatch && !b.containsMatch) return -1;
      if (!a.containsMatch && b.containsMatch) return 1;
      
      // Then by distance
      return a.distance - b.distance;
    })
    .slice(0, maxSuggestions)
    .map(d => d.candidate);
}
