# Web Portal Backend API

Backend API สำหรับ Web Portal V3.0 ที่พัฒนาด้วย Node.js, Express.js และ MySQL

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication
- **User Management**: Complete CRUD operations for user management
- **Dashboard API**: APIs for dashboard statistics and data
- **Security**: Helmet, CORS, Rate limiting, Input validation
- **Database**: MySQL with Sequelize ORM
- **Testing**: Jest testing framework setup
- **Documentation**: API documentation with examples

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models (Sequelize)
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   ├── types/          # TypeScript type definitions
│   ├── validators/     # Input validation schemas
│   └── database/       # Database migrations and seeders
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
├── config/             # Sequelize configuration
├── docs/               # Documentation
├── scripts/            # Utility scripts
└── package.json
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   # Edit .env file with your configuration
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE portal;
   CREATE DATABASE portal_test;
   
   # Run migrations
   npm run migrate
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and configure the following variables:

```env
# Server Configuration
PORT=3105
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portal
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_DIALECT=mysql
DB_TEST_NAME=portal_test

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS Configuration
CORS_ORIGIN=http://localhost:3015
```

## 📊 Database Schema

### Tables
- **`user`** - User information
- **`department`** - Department data
- **`subsystem`** - Subsystem information
- **`announcement`** - Announcements
- **`event`** - Events/Calendar
- **`identity`** - User identity providers
- **`allowedemaildomain`** - Allowed email domains

### Models
- **User** - User management
- **Department** - Department management
- **Subsystem** - Subsystem management
- **Announcement** - Announcement management
- **Event** - Event management
- **Identity** - Identity provider management
- **AllowedEmailDomain** - Email domain management

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user profile

### Users
- `GET /api/v1/users` - Get all users (with pagination)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user (Admin only)
- `PUT /api/v1/users/:id` - Update user (Admin only)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)
- `PATCH /api/v1/users/:id/status` - Update user status (Admin only)

### Dashboard
- `GET /api/v1/dashboard/overview` - Get dashboard overview
- `GET /api/v1/dashboard/stats` - Get dashboard statistics
- `GET /api/v1/dashboard/activities` - Get recent activities
- `GET /api/v1/dashboard/charts/users` - Get user chart data

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run seed` - Run database seeders
- `npm run seed:undo` - Undo all seeders

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Request validation with express-validator
- **JWT Authentication**: Secure token-based authentication
- **SQL Injection Protection**: Sequelize ORM protection

## 🗄️ Database

- **MySQL**: Relational database
- **Sequelize**: Object-Relational Mapping (ORM)
- **Migrations**: Database schema versioning
- **Seeders**: Sample data insertion
- **Indexes**: Optimized queries

## 📊 Monitoring

- **Health Check**: `/health` endpoint
- **Logging**: Morgan HTTP request logger
- **Error Handling**: Global error handler

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Configure CORS for production domain
5. Run `npm run migrate` to setup database
6. Run `npm start`

## 📄 License

MIT License