/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path as needed
  ],
  theme: {
    extend: {
      // You can add custom colors, spacing, etc., if needed
    },
  },
  plugins: [
    require("tailwind-scrollbar"), // Enables custom scrollbar styling
    require("tailwind-scrollbar-hide"), // Allows you to hide scrollbars if needed
  ],
};
