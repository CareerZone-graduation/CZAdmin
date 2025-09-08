// Mock mode configuration
export const MOCK_MODE = import.meta.env.DEV || !import.meta.env.VITE_API_URL;

export const mockConfig = {
  enabled: MOCK_MODE,
  loginDelay: 1000, // Simulate API delay
  adminCredentials: {
    email: 'admin@careerzone.com',
    password: 'admin123'
  },
  mockUser: {
    id: '1',
    email: 'admin@careerzone.com',
    role: 'admin',
    name: 'Admin User',
    company: 'CareerZone',
    active: true,
    isEmailVerified: true
  },
  mockToken: 'mock-jwt-token-for-dev'
};