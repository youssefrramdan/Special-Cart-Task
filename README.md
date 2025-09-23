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
   ```env
   # Server Configuration
   PORT=8000
   NODE_ENV=development
   
   # Database Configuration
   DB_URI=mongodb://localhost:27017/task-cart
   # Or for MongoDB Atlas:
   # DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
   
   # JWT Configuration
   JWT_SECRET_KEY=your-super-secret-jwt-key
   JWT_EXPIRE_TIME=3d
   
   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

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
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

*Note: Add your specific endpoints as you develop them*

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

### Other Deployment Options

- **Vercel** - Serverless deployment
- **Railway** - Simple cloud deployment
- **DigitalOcean App Platform** - Container-based deployment
- **AWS EC2** - Virtual machine deployment

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Development

### Available Scripts

- `npm run start:dev` - Start development server with nodemon
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

### Code Style

This project uses:
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Airbnb Style Guide** - JavaScript style guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Build process or auxiliary tool changes

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MongoDB is running
   - Verify DB_URI in environment variables
   - Check network connectivity for MongoDB Atlas

2. **Port Already in Use**
   - Change PORT in environment variables
   - Kill process using the port: `lsof -ti:8000 | xargs kill -9`

3. **Cloudinary Upload Issues**
   - Verify Cloudinary credentials
   - Check file format restrictions
   - Ensure proper middleware configuration

### Getting Help

- Create an issue in the repository
- Check existing issues for solutions
- Review the documentation

## 📞 Contact

- **Author**: Your Name
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

**Happy Coding! 🎉**
