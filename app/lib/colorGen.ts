/**
 * Hashes a string to a numeric value.
 * This is a simple hash function for demonstration purposes.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

/**
 * Converts a numeric hash to a 6-digit hex color code.
 */
function hashToColor(hash: number): string {
  // Ensure the hash is positive, then mask off bits to create a 24-bit color
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();
  // Pad with zeros if necessary to ensure a 6-digit hex code
  return "#" + "000000".substring(0, 6 - color.length) + color;
}

/**
 * Adjusts the brightness of a hex color.
 * @param hex A hex color string (e.g., "#AABBCC").
 * @param factor A factor > 1 to brighten or between 0 and 1 to darken.
 * @returns A new hex color string.
 */
function adjustBrightness(hex: string, factor: number): string {
  // Remove the '#' if present
  hex = hex.replace(/^#/, "");
  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Increase brightness by multiplying each component by the factor and clamping at 255
  r = Math.min(255, Math.floor(r * factor));
  g = Math.min(255, Math.floor(g * factor));
  b = Math.min(255, Math.floor(b * factor));

  // Convert back to hex and pad with zeros if needed
  const newHex =
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

  return newHex;
}

/**
 * Given a string of one or more words, returns a single hex color code,
 * adjusting brightness if needed.
 * @param input A string containing one or more words.
 * @param brightnessFactor Factor to adjust brightness (default 1.2 to brighten).
 * @returns A hex color string (e.g., "#AABBCC").
 */
function wordsToSingleColor(
  input: string,
  brightnessFactor: number = 1.2
): string {
  // Normalize the input by trimming and replacing multiple spaces with a single space
  const normalized = input.trim().replace(/\s+/g, " ");
  // Compute the hash from the normalized string
  const hash = hashString(normalized);
  // Convert the hash to a hex color code
  let color = hashToColor(hash);
  // Adjust brightness using the provided factor
  color = adjustBrightness(color, brightnessFactor);
  return color;
}
export default wordsToSingleColor
