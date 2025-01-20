// Common styles for reusability
export const styles = {
  button: {
    primary: "btn-primary",
    secondary: "btn-secondary",
    highlight: "btn-highlight",
    disabled: "opacity-50 cursor-not-allowed"
  },
  container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  heading: {
    primary: "text-4xl font-bold text-primary-main mb-4",
    light: "text-primary-light"
  },
  card: "bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-primary-light/10",
  input: {
    base: "w-full px-4 py-2 rounded-full border border-primary-light/20 focus:outline-none focus:ring-2 focus:ring-primary-main/20 bg-white/50 backdrop-blur-sm",
    error: "border-red-300 focus:ring-red-200",
    valid: "border-green-300 focus:ring-green-200"
  },
  label: "block text-sm font-medium text-primary-main mb-1",
  errorText: "text-sm text-red-500 mt-1",
  successText: "text-sm text-green-500 mt-1"
} as const;