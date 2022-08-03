const editDistance = (s1: string, s2: string) => {
  // This is the track of the total costs
  // We create a matrix on [m + 1][n + 1]
  // Fill with null
  let track: Array<Array<number>> = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  // Here we fill the first row and column
  // With ascending values starting from 0
  for (let i = 0; i <= s1.length; i++) {
    track[0][i] = i;
  }
  for (let j = 0; j <= s2.length; j++) {
    track[j][0] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      const indicator: 1 | 0 = s1[j - 1] === s2[i - 1] ? 0 : 1;
      track[i][j] =
        Math.min(
          track[i][j - 1] + 1, // deletion
          track[i - 1][j] + 1, // insertion
          track[i - 1][j - 1] // substitution
        ) + indicator;
    }
  }

  return track[s2.length][s1.length];
};

// Levenshtein distance
// is the minimum number of single-character edits
// (insertions, deletions or substitutions)
// required to change one word into the other
// https://en.wikipedia.org/wiki/Levenshtein_distance

interface Similarity {
  (s1: string, s2: string): number;
}

export const similarity: Similarity = (s1: string, s2: string) => {
  let longer: string = s1.trim(); // We .trim() the values to avoid unecessary blank spaces
  let shorter: string = s2.trim(); // We .trim() the values to avoid unecessary blank spaces
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  let longerLength: number = longer.length;
  if (longerLength == 0) {
    return 1.0; // In this case there are not characters
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength;
};
