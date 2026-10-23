// Google's root-level ownership files contain a token, not an HTML page.
// Exempt only filenames whose entire payload matches that exact filename.
export function isGoogleVerificationAsset(relativePath, contents) {
  return (
    /^google[a-f0-9]+\.html$/.test(relativePath) &&
    contents.trimEnd() === `google-site-verification: ${relativePath}`
  );
}
