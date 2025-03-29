
// Basic profanity filter - this would be expanded in a production environment
const profanityWords = [
  'adult', 'explicit', 'profane', 'offensive', 'inappropriate',
  // This is a placeholder. In a real app, you'd use a more comprehensive list
  // or a third-party service for content moderation
];

export const containsProfanity = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return profanityWords.some(word => lowerText.includes(word));
};

export const filterProfanity = (text: string): string => {
  let filteredText = text;
  profanityWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  return filteredText;
};
