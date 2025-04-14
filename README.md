AUTHENTICATION SERVICE 
------------------------------------
A robust, secure, and scalable authentication microservice built with Node.js, Express.js, Passport.js, JWT, Bcrypt, and Joi. It supports both traditional (email/password) authentication and OAuth-based social logins (Google, Facebook, GitHub). The system implements best practices like validation, token-based authentication, and encrypted passwords, making it ideal for integration into full-stack applications.

FEATURES 
-----------------------
# Secure user registration and login using JWT.

# OAuth integration with Google, Facebook, and GitHub.

# Password hashing using Bcrypt.js.

# Password reset via email/token flow.

# Centralized input validation using Joi.

# Middleware-based validation and error handling.

# Session management and logout functionality.

TECH STACK 
--------------------------
Backend: Node.js, Express.js
Authentication: Passport.js, JWT, Bcrypt.js
Validation: Joi
Session & Cookies: express-session
Templating (for social logins): EJS

REQUIRED PACKAGES
-------------------------------------

🔧 CORE DEPENDENCIES
------------------------------------

Package	                            Version	                Purpose
------------------------------------------------------------------------------------------------------------
express	                            ^4.19.2	                Fast, minimalist web framework for Node.js
mongoose	                          ^8.4.0	                ODM to interact with MongoDB
dotenv	                            ^16.4.5	                Load environment variables from .env
ejs	                                ^3.1.10	                Template engine to render dynamic HTML pages
body-parser	                        ^1.20.2	                Parses incoming request bodies
express-session	                    ^1.18.0	                Session middleware for storing user sessions
connect-flash	                      ^0.1.1	                Flash messages (used for showing success/errors)
joi	                                ^17.13.3	              Data validation for inputs

🔐 AUTHENTICATION & SECURITY
------------------------------------------------------

Package	                      Version	              Purpose
----------------------------------------------------------------------------------------
bcryptjs	                    ^2.4.3	              Password hashing and comparison
jsonwebtoken	                ^9.0.2	              Creating and verifying JWTs (JSON Web Tokens)
passport	                    ^0.7.0	              Main authentication middleware
passport-google-oauth        	^2.0.0	              Google OAuth2 authentication strategy
passport-github2	            ^0.1.12	              GitHub OAuth2 authentication strategy
passport-facebook	            ^3.0.0	              Facebook OAuth2 authentication strategy

📧 EMAIL & COMMUNICATION
---------------------------------------------------

Package	            Version	            Purpose
------------------------------------------------------------------------------------
nodemailer	        ^6.9.16	            Send password reset emails or notifications

🛠 Dev Dependency
------------------------------------

Package	          Version	              Purpose
----------------------------------------------------------------------------------------
nodemon	          ^3.1.0	              Automatically restarts the server on file changes


FOLDER STRUCTURE 
----------------------------

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


API ENDPOINTS
-----------------------

Method	    Endpoint	            Description
---------------------------------------------------------------
POST	  /register	                Register new user
POST	  /login	                  Login with email/password
POST	  /forget-password	        Send reset link
POST	  /reset-password/:token	  Reset password
GET	    /logout	                  Logout and clear session
GET	    /auth/google	            Login via Google
GET	    /auth/facebook	          Login via Facebook
GET  	  /auth/github	            Login via GitHub

USAGE 
-------------------------

# Email/Password Authentication Flow

/register – Registers a user with validated input and hashed password
/login – Logs in user and returns JWT
/forget-password – Sends reset link to email (token-based)
/reset-password/:token – Verifies token and allows secure password reset
/logout – Destroys session and redirects to home

# Social Authentication with Passport.js

/auth/google, /auth/facebook, /auth/github – Initiate login with provider
/auth/{provider}/callback – Handles OAuth callback and renders user profile
/auth/{provider}/logout – Destroys session and logs user out

SECURITY HIGHLIGHTS 
------------------------------------------

# JWT Authentication: Stateless, secure session handling for APIs.

# Bcrypt Password Hashing: Ensures stored credentials are safe even if the DB is compromised.

# Input Validation with Joi: Prevents injection attacks and invalid requests.

# OAuth Strategy via Passport: Secure social login handling with fallback error routes.
