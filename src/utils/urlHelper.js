/**
 * Normalizes a URL to include the API base URL if it's a relative path
 * @param {string} url - The URL to normalize (can be full URL or relative path)
 * @returns {string} - The normalized full URL
 */
export const getFullUrl = (url) => {
  if (!url) return '';

  // If URL already starts with http:// or https://, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If URL starts with /, prepend the API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${API_URL}${url}`;
};

/**
 * Gets the API base URL from environment variables
 * @returns {string} - The API base URL
 */
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};
