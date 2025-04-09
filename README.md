# Medication Management System

A modern, secure, and user-friendly medication management system built with React, Node.js, and MongoDB. This application helps users track their medications, set reminders, and manage their health records efficiently.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248)

## 🌟 Features

- **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Password encryption

- **Medication Management**
  - Add, edit, and delete medications
  - Track medication schedules
  - Set reminders and notifications
  - View medication history

- **Dashboard**
  - Overview of current medications
  - Upcoming medication schedule
  - Health statistics and insights

- **Modern UI/UX**
  - Responsive design
  - Material-UI components
  - Dark/Light mode support
  - Intuitive navigation

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Gri9Nerd/WebDevMiniProject_12.git
cd WebDevMiniProject_12
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🛠️ Built With

- **Frontend**
  - React 18
  - Material-UI
  - React Router
  - Axios
  - Vite

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT Authentication

## 📝 API Documentation

The API documentation is available at `/api-docs` when running the server.

### Main Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/medications` - Get user's medications
- `POST /api/medications` - Add a new medication
- `PUT /api/medications/:id` - Update a medication
- `DELETE /api/medications/:id` - Delete a medication

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Input validation
- XSS protection
- CORS enabled

## 🎨 UI Components

The application uses a custom theme with:
- Modern color palette
- Responsive typography
- Custom component styling
- Consistent spacing and layout
- Accessibility features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- The React community for excellent documentation and tools
