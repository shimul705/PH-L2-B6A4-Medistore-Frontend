export const env = {
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    // Default for local dev
    "http://localhost:5000",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};
