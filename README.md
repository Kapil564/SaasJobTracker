# CareerTransit - SaaS Job Tracker

A comprehensive job application tracking platform built with React and Node.js, featuring AI-powered insights, drag-and-drop Kanban boards, and seamless authentication.

## 🚀 Features

- **Job Application Management**: Track applications across different stages with a visual Kanban board
- **AI-Powered Assistance**:
  - Generate personalized cover letters
  - Analyze job compatibility scores
  - Create interview preparation materials
  - Identify red flags in job descriptions
  - Draft contextual email replies to recruiters
- **Drag-and-Drop Interface**: Intuitive Kanban board for managing application pipelines
- **Authentication**: Secure JWT-based auth with Google OAuth integration
- **Real-time Statistics**: Dynamic analytics on application response rates and interview counts
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Document Management**: Upload and manage resumes and cover letters

## 🛠 Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **@dnd-kit** for drag-and-drop functionality
- **React Router** for navigation
- **Axios** for API calls
- **Recharts** for data visualization

### Backend
- **Node.js** with Express
- **Neon Database** (PostgreSQL)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Google OAuth** integration
- **Nodemailer** for email services

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Neon database account (for database hosting)

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SaasJobTracker
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory with the following variables:

```env
NODE_ENV=development
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Initialize the database:

```bash
node src/lib/createTables.js
```

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Usage

1. **Sign Up/Login**: Create an account or sign in with Google OAuth
2. **Dashboard**: View your application statistics and pipeline overview
3. **Add Applications**: Use the "Add Job" button to track new job applications
4. **Kanban Board**: Drag and drop applications between stages (Applied, Interviewing, Offer, Rejected)
5. **AI Assistant**: Click on any job card to access AI-powered features:
   - Generate cover letters
   - Get compatibility scores
   - Prepare for interviews
   - Identify red flags
   - Draft email responses
6. **Settings**: Update your profile and preferences

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Linting

```bash
cd client
npm run lint
```

## 📁 Project Structure

```
SaasJobTracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   └── styles/        # CSS and styling files
│   ├── public/            # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API route definitions
│   │   ├── middleware/    # Express middleware
│   │   ├── lib/           # Database and utilities
│   │   └── services/      # Business logic services
│   ├── migrations/        # Database migrations
│   ├── tests/             # Backend tests
│   └── package.json
└── README.md
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- AI features powered by integrated language models
- Database hosted on Neon for serverless PostgreSQL</content>
<parameter name="filePath">c:\Users\kapil\Desktop\projects\SaasJobTracker\README.md