/**
 * Parse a price range string into min and max numbers.
 * E.g., "RM5-10" -> { min: 5, max: 10 }
 *       "RM5–10" (en-dash) -> { min: 5, max: 10 }
 *       "RM5.00 - RM10.00" -> { min: 5, max: 10 }
 *       "RM30+" -> { min: 30, max: Infinity }
 */
function parsePriceRange(priceStr) {
  if (!priceStr) return { min: 0, max: 0 };
  
  // Normalize dashes (standard hyphen, en-dash, em-dash) to standard space-separated form
  const cleaned = priceStr.replace(/[\u2013\u2014]/g, '-');
  
  // Extract all numbers (with decimal point if any)
  const matches = cleaned.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) {
    return { min: 0, max: 0 };
  }
  
  const numbers = matches.map(parseFloat);
  
  if (numbers.length === 1) {
    if (cleaned.includes('+')) {
      return { min: numbers[0], max: Infinity };
    }
    return { min: numbers[0], max: numbers[0] };
  }
  
  return { min: numbers[0], max: numbers[1] };
}

/**
 * Check if a stall's price range matches a budget category.
 * E.g. stallPriceRange = "RM5.00 - RM12.00", budget = "RM10–20" -> true (overlaps)
 */
function matchBudget(stallPriceRange, budget) {
  if (!budget || budget === 'all') return true;
  if (!stallPriceRange) return false;
  
  const stallRange = parsePriceRange(stallPriceRange);
  const budgetRange = parsePriceRange(budget);
  
  return (stallRange.min <= budgetRange.max) && (stallRange.max >= budgetRange.min);
}

module.exports = {
  parsePriceRange,
  matchBudget
};
