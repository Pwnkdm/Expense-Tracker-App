export const getInitials = (name) => {
  if (!name) return null;

  const words = name.trim().split(/\s+/); // Handle multiple spaces
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase() // Take first letter of first two words
    : words[0][0].toUpperCase(); // Only first letter if single word
};
