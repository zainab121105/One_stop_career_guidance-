// Debug utility to check environment variables in production
export const debugEnv = () => {
  console.log('Environment Debug Info:');
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('VITE_API_TIMEOUT:', import.meta.env.VITE_API_TIMEOUT);
  console.log('VITE_APP_ENV:', import.meta.env.VITE_APP_ENV);
  console.log('MODE:', import.meta.env.MODE);
  console.log('All env vars:', import.meta.env);
};

// Call this in your main component to debug
if (typeof window !== 'undefined') {
  debugEnv();
}