# CareerZone Admin Dashboard

A modern, responsive admin dashboard for CareerZone built with React, Redux Toolkit, TailwindCSS, and shadcn/ui.

## 🚀 Features

- **Modern Tech Stack**: React 19, Redux Toolkit, TailwindCSS, shadcn/ui
- **Responsive Design**: Mobile-first responsive design with modern UI components
- **Dashboard Overview**: Comprehensive stats and analytics
- **Company Management**: Approve/reject company registrations
- **User Management**: Activate/suspend users, filter by role and status
- **Job Management**: Approve/reject job postings, manage featured listings
- **Transaction Management**: View payment history and transaction details
- **Authentication**: Secure login with demo credentials

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS, shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (skeletons, etc.)
│   └── ui/              # shadcn/ui components
├── features/            # Business logic organized by feature
│   ├── auth/           # Authentication feature
│   ├── companies/      # Company management feature
│   ├── dashboard/      # Dashboard feature
│   ├── jobs/           # Job management feature
│   ├── transactions/   # Transaction management feature
│   └── users/          # User management feature
├── layouts/            # Layout components
│   ├── DashboardLayout.jsx
│   └── AuthLayout.jsx
├── pages/              # Page entry points
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   ├── CompanyManagementPage.jsx
│   ├── UserManagementPage.jsx
│   ├── JobManagementPage.jsx
│   └── TransactionManagementPage.jsx
├── routes/             # Routing logic
│   ├── AppRouter.jsx
│   ├── AuthRoute.jsx
│   └── ProtectedRoute.jsx
├── store/              # Redux store configuration
│   └── index.js
├── data/               # Mock data and constants
│   ├── companies.js
│   ├── users.js
│   ├── jobs.js
│   └── transactions.js
├── lib/                # Utility libraries
│   └── utils.js
├── utils/              # Helper utilities
│   ├── auth.js
│   ├── cn.js
│   ├── formatDate.js
│   └── token.js
└── services/           # API services
    ├── apiClient.js
    ├── authService.js
    ├── companyService.js
    ├── jobService.js
    └── userService.js
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CareerZone-FE-ADMIN
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials

Use these credentials to log in to the admin dashboard:

- **Email**: `admin@careerzone.com`
- **Password**: `admin123`

## 📖 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

This project uses shadcn/ui components for a consistent, modern design:

- **Cards** - Information display containers
- **Tables** - Data presentation with sorting and filtering
- **Buttons** - Various button styles and states
- **Forms** - Input fields, selects, labels
- **Dialogs** - Modal dialogs and overlays
- **Badges** - Status indicators and tags
- **Alerts** - Success, error, and warning messages

## 🔧 State Management

The application uses Redux Toolkit for state management with the following slices:

- **authSlice** - Authentication state
- **companiesSlice** - Company management state
- **usersSlice** - User management state  
- **jobsSlice** - Job management state
- **transactionsSlice** - Transaction management state

## 🎯 Key Features Breakdown

### Dashboard
- Overview stats (companies, users, jobs, revenue)
- Recent activity feed
- Quick action buttons

### Company Management
- View all company registrations
- Approve/reject company applications
- Search and filter companies
- View company details

### User Management
- View all users (job seekers and recruiters)
- Activate/suspend user accounts
- Filter by role and status
- Search users

### Job Management
- View all job postings
- Approve/reject job applications
- Toggle featured status
- Filter by status and type

### Transaction Management
- View payment history
- Filter by status and type
- Transaction details modal
- Revenue analytics

## 🔐 Authentication

The app includes a complete authentication system:

- Protected routes requiring login
- Login form with validation
- Demo credentials for testing
- Logout functionality
- Auth state persistence

## 📱 Responsive Design

The dashboard is fully responsive and works on:

- Desktop (1024px+)
- Tablet (768px - 1023px) 
- Mobile (320px - 767px)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build files will be generated in the `dist` directory.

### Deploy to Vercel/Netlify

The app is configured for easy deployment to modern hosting platforms:

1. Build the project
2. Deploy the `dist` folder
3. Configure environment variables if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
