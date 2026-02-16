import LZString from 'lz-string';

/**
 * Compresses a string (code) into an encoded URI component.
 */
export const compressCode = (code: string): string => {
  return LZString.compressToEncodedURIComponent(code);
};

/**
 * Decompresses an encoded URI component back into the original string.
 */
export const decompressCode = (compressed: string): string | null => {
  return LZString.decompressFromEncodedURIComponent(compressed);
};
