const LOG_KEY = 'url_shortener_logs';

export function logEvent(event, data) {
  const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  logs.push({ timestamp: new Date().toISOString(), event, data });
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

export function getLogs() {
  return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
}