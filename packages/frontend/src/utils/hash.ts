export const djb2Hash = (input: string): string => {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h) ^ input.charCodeAt(i);
  }
  // convert to unsigned 32-bit hex
  const u = h >>> 0;
  return ('00000000' + u.toString(16)).slice(-8);
};
