// Function to extract initials
export const getInitials = (name) => {
  if (!name) return null;
  const words = name.split(" ");
  const initials = words
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2); // Max 2 characters
  return initials;
};
