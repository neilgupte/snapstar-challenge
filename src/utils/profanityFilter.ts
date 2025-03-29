
// List of basic profanity words to check
const basicProfanityList = [
  'badword1',
  'badword2',
  // Add more profanity words here
];

// Extended list for stricter checking
const extendedProfanityList = [
  ...basicProfanityList,
  'badword3',
  'badword4',
  // Add more profanity words here
];

/**
 * Checks if the given text contains profanity
 * @param text The text to check for profanity
 * @param strict Whether to use the extended profanity list for stricter checking
 * @returns True if profanity is detected, false otherwise
 */
export const isProfanity = (text: string, strict: boolean = false): boolean => {
  const wordList = strict ? extendedProfanityList : basicProfanityList;
  const lowerText = text.toLowerCase();
  
  // Check for exact word matches (accounting for word boundaries)
  for (const word of wordList) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      return true;
    }
  }
  
  return false;
};

// Add this function to maintain compatibility with existing imports
export const containsProfanity = isProfanity;

// The profanity filter implementation is simplified.
// For production, consider using a more comprehensive library
// or implementing a more sophisticated algorithm.
