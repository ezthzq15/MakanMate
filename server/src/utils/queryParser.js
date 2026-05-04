/**
 * Utility: queryParser.js
 * Normalizes and validates incoming query parameters for search/filters
 */
const parseFilters = (query) => {
  const { q, cuisines, halal, budget, spice, sort, page, limit } = query;

  return {
    searchQuery: q || '',
    cuisines: cuisines ? cuisines.split(',') : [],
    halal: halal === 'yes',
    budget: budget !== 'all' ? budget : null,
    spice: spice !== 'all' ? spice : null,
    sort: sort || 'recommended',
    page: Math.max(1, parseInt(page) || 1),
    limit: Math.max(1, parseInt(limit) || 12)
  };
};

module.exports = { parseFilters };
