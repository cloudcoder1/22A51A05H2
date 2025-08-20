export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{4,12}$/.test(code);
}

export function generateShortcode(existingCodes) {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 8);
  } while (existingCodes.has(code));
  return code;
}

export function getGeolocation() {
  return 'Unknown';
}