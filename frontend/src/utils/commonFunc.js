import { jwtDecode } from "jwt-decode";

export const getInitials = (name) => {
  if (!name) return null;

  const words = name.trim().split(/\s+/); // Handle multiple spaces
  return words.length > 1
    ? (words[0][0] + words[1][0]).toUpperCase() // Take first letter of first two words
    : words[0][0].toUpperCase(); // Only first letter if single word
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwtDecode(token);

  // Getting the current time in Unix timestamp (seconds)
  const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

  // Time 1 minute before token expiry in seconds
  const oneMinuteBeforeExpiry = decodedToken.exp - 60;

  if (currentTime >= oneMinuteBeforeExpiry) {
    console.log("❌ Token is expired");
  } else {
    console.log("✅ Token is valid");
  }

  return currentTime >= oneMinuteBeforeExpiry; // Return true if current time is >= 1 minute before expiry
};

export const categories = {
  expense: [
    "Bills & Utilities",
    "EMI & Loans",
    "Rent & Housing",
    "Food & Dining",
    "Groceries",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Healthcare",
    "Education",
    "Personal Care",
    "Home Maintenance",
    "Insurance",
    "Gifts & Donations",
    "Travel & Vacation",
    "Investments",
    "Taxes",
    "Business Expenses",
    "Miscellaneous",
    "Subscriptions",
    "Pet Care",
    "Childcare",
    "Vehicle Maintenance",
    "Professional Development",
    "Hobbies",
    "Debt Payments",
  ],
  earning: [
    "Salary",
    "Bonus",
    "Freelance Income",
    "Business Revenue",
    "Investment Returns",
    "Rental Income",
    "Commission",
    "Consulting Fees",
    "Royalties",
    "Interest Income",
    "Dividends",
    "Side Projects",
    "Part-time Work",
    "Pension",
    "Other Income",
    "Overtime Pay",
    "Gratuities",
    "Government Benefits",
    "Refunds",
    "Gifts Received",
    "Gambling Winnings",
  ],
};
