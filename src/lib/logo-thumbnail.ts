/** Build-time variants keep official master assets out of small UI slots. */
export function logoThumbnail(logo: string, size: 'small' | 'card' = 'small') {
  if (!/^\/logos\/[^/]+\.webp$/.test(logo)) return logo;
  return logo.replace(/(?:\.(?:small|card))?\.webp$/, `.${size}.webp`);
}
