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

export const handlePrint = ({ columns, data, month, year }) => {
  const printWindow = window.open("", "_blank");
  const printContent = document.createElement("div");

  // Add styles with Poppins font
  printContent.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      body {
        font-family: 'Poppins', sans-serif;
      }
      
      table { 
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f5f5f5;
      }
      .success-tag {
        color: #52c41a;
        font-weight: bold;
      }
      .error-tag {
        color: #ff4d4f;
        font-weight: bold;
      }
      .earning-amount {
        color: #52c41a;
        font-weight: bold;
      }
      .expense-amount {
        color: #ff4d4f;
        font-weight: bold;
      }
      @media print {
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
      }
    </style>
  `;

  // Create table
  const table = document.createElement("table");

  // Add headers
  const headers = columns
    .filter((col) => col.key !== "actions")
    .map((col) =>
      typeof col.title === "string" ? col.title : col.title.props.children[1]
    );
  const headerRow = `<tr>${headers
    .map((header) => `<th>${header}</th>`)
    .join("")}</tr>`;
  table.innerHTML = headerRow;

  // Add all data rows
  data?.forEach((record) => {
    const row = document.createElement("tr");
    columns
      .filter((col) => col.key !== "actions")
      .forEach((col) => {
        const cell = document.createElement("td");
        if (col.dataIndex === "date") {
          cell.textContent = new Date(record.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        } else if (col.dataIndex === "category") {
          cell.innerHTML = `<span class="${
            record.type === "earning" ? "success-tag" : "error-tag"
          }">${record.category}</span>`;
        } else if (col.dataIndex === "amount") {
          cell.innerHTML = `<span class="${
            record.type === "earning" ? "earning-amount" : "expense-amount"
          }">₹${record.amount.toLocaleString()}/-</span>`;
        } else {
          cell.textContent = record[col.dataIndex] || "-";
        }
        row.appendChild(cell);
      });
    table.appendChild(row);
  });

  printContent.appendChild(table);
  printWindow.document.body.appendChild(printContent);
  printWindow.document.title = `Monthly Details - ${month}/${year}`;
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
