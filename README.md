# Task Cart API

A robust Node.js REST API built with Express.js and MongoDB, featuring comprehensive middleware, error handling, and cloud storage integration.

## 🚀 Features

- **Express.js Framework** - Fast and minimalist web framework
- **MongoDB Integration** - NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure token-based authentication
- **Cloudinary Storage** - Cloud-based image upload and storage
- **Comprehensive Error Handling** - Global error middleware with custom error classes
- **Security Middleware** - CORS, compression, and security headers
- **Environment Configuration** - Separate development and production configs
- **Graceful Shutdown** - Proper server shutdown handling
- **Code Quality** - ESLint and Prettier configuration
- **Development Tools** - Hot reloading with Nodemon

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task-cart-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory or update `config/config.env`:

4. **Start the application**

   For development:

   ```bash
   npm run start:dev
   ```

   For production:

   ```bash
   npm run start:prod
   ```

## 📁 Project Structure

```
├── config/
│   ├── config.env          # Environment variables
│   └── database.config.js  # Database connection configuration
├── controllers/            # Route controllers
├── middlewares/
│   ├── errorMiddleware.js  # Global error handling
│   └── uploadImageMiddleware.js # File upload middleware
├── models/                 # Mongoose models
├── routes/                 # API routes
├── utils/
│   └── apiError.js        # Custom error class
├── app.js                 # Express application setup
├── server.js              # Server entry point
└── package.json           # Project dependencies and scripts
```

## 🔧 API Endpoints

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

_Note: Add your specific endpoints as you develop them_

## 🛡️ Security Features

- **CORS Protection** - Cross-Origin Resource Sharing configuration
- **Data Compression** - Gzip compression for responses
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Request validation using express-validator
- **Error Handling** - Custom error classes and global error middleware
- **Environment Variables** - Sensitive data protection

## 🚀 Deployment

### Heroku Deployment

This project includes a `Procfile` for Heroku deployment:

1. **Install Heroku CLI**
2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create Heroku app**

   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET_KEY=your-jwt-secret
   # Add other environment variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Available Scripts

- `npm run start:dev` - Start development server with nodemon
- `npm run start:prod` - Start production server

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Build process or auxiliary tool changes

---

**Happy Coding! 🎉**
