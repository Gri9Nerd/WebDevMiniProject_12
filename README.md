# MediTrack - Medication Management System

## Project Overview
MediTrack is a comprehensive medication management system designed to help users track their medications, set reminders, and monitor their adherence to prescribed schedules. The application provides a user-friendly interface for managing medications, viewing schedules, and tracking medication history.

## Tech Stack

### Frontend
- **React.js** - Frontend framework for building user interfaces
- **Material-UI (MUI)** - UI component library for modern and responsive design
- **Firebase Authentication** - User authentication and authorization
- **Context API** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for storing medication and user data
- **Mongoose** - MongoDB object modeling for Node.js
- **Firebase Admin SDK** - Backend integration with Firebase services

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Firebase Realtime Database** - Real-time data synchronization

## Features

### User Authentication
- Secure login and registration
- Password reset functionality
- Session management
- Protected routes

### Medication Management
- Add, edit, and delete medications
- Set medication schedules
- Track medication adherence
- View medication history
- Set reminders and notifications

### Dashboard
- Overview of medication schedule
- Statistics and adherence tracking
- Upcoming medications
- Daily medication summary

### Profile Management
- User profile customization
- Settings and preferences
- Theme customization (light/dark mode)

## Project Structure
```
meditrack/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   └── src/                 # Source code
│       ├── components/      # Reusable UI components
│       ├── context/         # Context providers
│       ├── pages/           # Page components
│       ├── services/        # API services
│       └── App.jsx          # Main application component
│
└── backend/                 # Node.js backend application
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    ├── middleware/         # Custom middleware
    └── server.js           # Server entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Firebase project
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gri9Nerd/WebDevMiniProject_12.git
cd WebDevMiniProject_12
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Configure environment variables:
   - Create `.env` file in backend directory
   - Add Firebase service account key
   - Configure MongoDB connection string

5. Start the development servers:
```bash
# Start backend server
cd backend
npm start

# Start frontend server
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset request

### Medications
- `GET /medications` - Get all medications
- `POST /medications` - Add new medication
- `PUT /medications/:id` - Update medication
- `DELETE /medications/:id` - Delete medication
- `POST /medications/mark-taken` - Mark medication as taken
- `GET /medications/today` - Get today's schedule
- `GET /medications/stats` - Get medication statistics

## Security Features
- JWT-based authentication
- Password hashing
- Input validation
- CORS protection
- Rate limiting
- Error handling middleware

## Future Enhancements
- Push notifications for medication reminders
- Medication interaction checker
- Prescription scanning
- Family member medication management
- Export medication history
- Mobile application

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Material-UI for the component library
- Firebase for authentication services
- MongoDB for database services
- Express.js for the backend framework
