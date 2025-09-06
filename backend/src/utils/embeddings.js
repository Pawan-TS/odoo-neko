// This is a simplified implementation of embeddings utility
// In a production environment, you would use a proper NLP service like OpenAI's ada embeddings

/**
 * Simple tokenization function - splits text into words
 * @param {string} text - The text to tokenize
 * @returns {string[]} Array of tokens (words)
 */
function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Replace non-alphanumeric with space
    .split(/\s+/)              // Split by whitespace
    .filter(word => word.length > 2); // Filter out short words
}

/**
 * Creates a simple TF (Term Frequency) vector for a text
 * @param {string} text - The text to vectorize 
 * @returns {Object} A map of terms to their frequencies
 */
function createTFVector(text) {
  const tokens = tokenize(text);
  const vector = {};
  
  // Count term frequencies
  tokens.forEach(token => {
    vector[token] = (vector[token] || 0) + 1;
  });
  
  return vector;
}

/**
 * Calculate cosine similarity between two text strings
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} Similarity score between 0 and 1
 */
exports.calculateCosineSimilarity = (text1, text2) => {
  // Create TF vectors
  const vector1 = createTFVector(text1);
  const vector2 = createTFVector(text2);
  
  // Get all unique terms
  const allTerms = new Set([...Object.keys(vector1), ...Object.keys(vector2)]);
  
  // Calculate dot product
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  allTerms.forEach(term => {
    const val1 = vector1[term] || 0;
    const val2 = vector2[term] || 0;
    
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  });
  
  // Calculate cosine similarity
  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0; // Avoid division by zero
  }
  
  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * Get related content based on text similarity
 * @param {string} sourceText - The text to find related content for
 * @param {Array} contentItems - Array of items with text content
 * @param {number} threshold - Minimum similarity threshold (0-1)
 * @returns {Array} Related items sorted by similarity score
 */
exports.getRelatedContent = (sourceText, contentItems, threshold = 0.6) => {
  const results = contentItems.map(item => {
    const similarity = exports.calculateCosineSimilarity(sourceText, item.content);
    return { ...item, similarity };
  });
  
  // Filter by threshold and sort by similarity (descending)
  return results
    .filter(item => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);
};

// Note: In a production environment, you would replace these functions
// with calls to a proper embedding API (OpenAI, Cohere, etc.)
// The above implementation is for demonstration purposes only.