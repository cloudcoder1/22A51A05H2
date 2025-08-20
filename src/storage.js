const URLS_KEY = 'url_shortener_urls';
const CLICKS_KEY = 'url_shortener_clicks';

export function getUrls() {
  return JSON.parse(localStorage.getItem(URLS_KEY) || '{}');
}

export function saveUrl(shortcode, data) {
  const urls = getUrls();
  urls[shortcode] = data;
  localStorage.setItem(URLS_KEY, JSON.stringify(urls));
}

export function getClicks() {
  return JSON.parse(localStorage.getItem(CLICKS_KEY) || '{}');
}

export function addClick(shortcode, clickData) {
  const clicks = getClicks();
  if (!clicks[shortcode]) clicks[shortcode] = [];
  clicks[shortcode].push(clickData);
  localStorage.setItem(CLICKS_KEY, JSON.stringify(clicks));
}