/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from "tailwind-scrollbar";
import tailwindScrollbarHide from "tailwind-scrollbar-hide";

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
    tailwindScrollbar, // Enables custom scrollbar styling
    tailwindScrollbarHide, // Allows you to hide scrollbars if needed
  ],
};
