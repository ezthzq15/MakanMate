/**
 * Utility: queryParser.js
 * Normalizes and validates incoming query parameters for search/filters
 */
const parseFilters = (query) => {
  const { q, cuisines, halal, halalTags, budget, spice, sort, page, limit, radius, skipMenu } = query;

  return {
    searchQuery: q || '',
    cuisines: cuisines ? cuisines.split(',').filter(Boolean) : [],
    halal: halal === 'yes' ? 'yes' : 'all',
    halalTags: halalTags ? halalTags.split(',').map(t => t.trim()).filter(Boolean) : [],
    budget: budget !== 'all' ? budget : null,
    spice: spice !== 'all' ? spice : null,
    sort: sort || 'recommended',
    page: Math.max(1, parseInt(page) || 1),
    limit: Math.max(1, parseInt(limit) || 12),
    radius: radius ? parseFloat(radius) : null,
    skipMenu: skipMenu === 'true' || skipMenu === true
  };
};

module.exports = { parseFilters };
