// Mock data for users
export const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'job_seeker',
    status: 'active',
    location: 'San Francisco, CA',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 'Mid-level',
    createdAt: '2024-01-10T10:30:00Z',
    lastLogin: '2024-01-16T14:20:00Z',
    profileComplete: 85,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    role: 'recruiter',
    status: 'active',
    location: 'New York, NY',
    company: 'Tech Solutions Inc',
    createdAt: '2024-01-08T09:15:00Z',
    lastLogin: '2024-01-16T11:45:00Z',
    profileComplete: 95,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    role: 'job_seeker',
    status: 'suspended',
    location: 'Chicago, IL',
    skills: ['Python', 'Django', 'PostgreSQL'],
    experience: 'Senior',
    createdAt: '2024-01-05T16:45:00Z',
    lastLogin: '2024-01-14T15:10:00Z',
    profileComplete: 70,
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    role: 'job_seeker',
    status: 'active',
    location: 'Austin, TX',
    skills: ['Java', 'Spring Boot', 'AWS'],
    experience: 'Entry-level',
    createdAt: '2024-01-12T11:20:00Z',
    lastLogin: '2024-01-16T09:30:00Z',
    profileComplete: 60,
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@email.com',
    role: 'recruiter',
    status: 'active',
    location: 'Los Angeles, CA',
    company: 'Innovation Corp',
    createdAt: '2024-01-15T13:00:00Z',
    lastLogin: '2024-01-16T16:20:00Z',
    profileComplete: 90,
  },
];

export const USER_ROLES = {
  job_seeker: { label: 'Job Seeker', color: 'bg-blue-100 text-blue-800' },
  recruiter: { label: 'Recruiter', color: 'bg-purple-100 text-purple-800' },
  admin: { label: 'Admin', color: 'bg-gray-100 text-gray-800' },
};

export const USER_STATUSES = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  suspended: { label: 'Suspended', color: 'bg-red-100 text-red-800' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
};

export const EXPERIENCE_LEVELS = [
  'Entry-level',
  'Mid-level', 
  'Senior',
  'Executive'
];
