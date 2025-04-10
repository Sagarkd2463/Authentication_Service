AUTHENTICATION SERVICE 
------------------------------------------
A robust, secure, and scalable authentication microservice built with Node.js, Express.js, Passport.js, JWT, Bcrypt, and Joi. It supports both traditional (email/password) authentication and OAuth-based social logins (Google, Facebook, GitHub).The system implements best practices like validation, token-based authentication, and encrypted passwords, making it ideal for integration into full-stack applications.

FEATURES 
------------------------------------------
Secure user registration and login using JWT.

OAuth integration with Google, Facebook, and GitHub.

Password hashing using Bcrypt.js.

Password reset via email/token flow.

Centralized input validation using Joi.

Middleware-based validation and error handling.

Session management and logout functionality.

TECH STACK 
------------------------------------------
Backend: Node.js, Express.js
Authentication: Passport.js, JWT, Bcrypt.js
Validation: Joi
Session & Cookies: express-session
Templating (for social logins): EJS

INSTALLATION 
------------------------------------------
Node.js and npm installed

MongoDB database and mongoose installed 

.env file with:
JWT_SECRET_KEY=your_jwt_secret

REQUIRED PACKAGES 
------------------------------------------
npm install express passport passport-google-oauth20 passport-facebook passport-github2 express-session bcryptjs jsonwebtoken joi dotenv

FOLDER STRUCTURE 
------------------------------------------ 

├── controllers/
│   └── userAuthController.js     # Register, login, forgot & reset password logic
├── middleware/
│   └── validUser.js              # Joi validation schemas & middleware
├── routes/
│   └── authRoutes.js             # API endpoints
│   └── socialAuth.js             # Passport strategies for OAuth
├── utils/
│   └── hashUtils.js              # Bcrypt hash/compare helpers
│   └── generateToken.js          # JWT token generator
├── views/                        # EJS templates for rendering OAuth profile data
├── .env
├── server.js


USAGE 
------------------------------------------

1. Email/Password Authentication Flow

/register – Registers a user with validated input and hashed password

/login – Logs in user and returns JWT

/forget-password – Sends reset link to email (token-based)

/reset-password/:token – Verifies token and allows secure password reset

/logout – Destroys session and redirects to home


2. Social Authentication with Passport.js

/auth/google, /auth/facebook, /auth/github – Initiate login with provider

/auth/{provider}/callback – Handles OAuth callback and renders user profile

/auth/{provider}/logout – Destroys session and logs user out

SECURITY HIGHLIGHTS 
------------------------------------------

JWT Authentication: Stateless, secure session handling for APIs.

Bcrypt Password Hashing: Ensures stored credentials are safe even if the DB is compromised.

Input Validation with Joi: Prevents injection attacks and invalid requests.

OAuth Strategy via Passport: Secure social login handling with fallback error routes.

