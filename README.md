# Web Portal V3.0

ระบบ Web Portal เวอร์ชัน 3.0 ที่พัฒนาด้วยเทคโนโลยีสมัยใหม่ แยกเป็น Frontend และ Backend ตามมาตรฐานการทำเว็บแอพ

## 🏗️ Architecture

```
Web_PortalV3.0/
├── frontend/          # Next.js Frontend Application
├── backend/           # Node.js Backend API
└── README.md         # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm หรือ pnpm
- MongoDB (สำหรับ Backend)

### 1. Clone Repository
```bash
git clone <repository-url>
cd Web_PortalV3.0
```

### 2. Setup Backend
```bash
cd backend
npm install
cp env.example .env
# แก้ไข .env file ตามต้องการ
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
# หรือ pnpm install
npm run dev
```

### 4. Access Applications
- **Frontend**: http://localhost:3015
- **Backend API**: http://localhost:3105
- **API Health Check**: http://localhost:3105/health

## 📁 Project Structure

### Frontend (Next.js 15 + React 19)
```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Components
│   │   ├── ui/             # Reusable UI Components
│   │   ├── layout/         # Layout Components
│   │   ├── forms/          # Form Components
│   │   ├── charts/         # Chart Components
│   │   └── tables/         # Table Components
│   ├── pages/              # Page Components
│   ├── hooks/              # Custom Hooks
│   ├── services/           # API Services
│   ├── contexts/           # React Contexts
│   ├── types/              # TypeScript Types
│   └── utils/              # Utility Functions
├── public/                 # Static Assets
└── package.json
```

### Backend (Node.js + Express + MongoDB)
```
backend/
├── src/
│   ├── controllers/        # Route Controllers
│   ├── models/            # Database Models
│   ├── routes/            # API Routes
│   ├── middleware/        # Custom Middleware
│   ├── services/          # Business Logic
│   ├── utils/             # Utility Functions
│   ├── config/            # Configuration
│   ├── types/             # TypeScript Types
│   └── validators/        # Input Validation
├── tests/                 # Test Files
├── docs/                  # Documentation
└── package.json
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Validation**: Joi + express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm test            # Run tests
npm run lint        # Run ESLint
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run lint        # Run ESLint
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - สมัครสมาชิก
- `POST /api/v1/auth/login` - เข้าสู่ระบบ
- `GET /api/v1/auth/me` - ข้อมูลผู้ใช้ปัจจุบัน

### User Management
- `GET /api/v1/users` - รายการผู้ใช้ทั้งหมด
- `POST /api/v1/users` - สร้างผู้ใช้ใหม่
- `PUT /api/v1/users/:id` - แก้ไขข้อมูลผู้ใช้
- `DELETE /api/v1/users/:id` - ลบผู้ใช้

### Dashboard
- `GET /api/v1/dashboard/overview` - ภาพรวมแดชบอร์ด
- `GET /api/v1/dashboard/stats` - สถิติต่างๆ
- `GET /api/v1/dashboard/activities` - กิจกรรมล่าสุด

## 🔒 Security Features

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Request validation
- **Rate Limiting**: API rate limiting
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Password Hashing**: bcrypt encryption

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm test                   # Run tests (when implemented)
npm run test:watch         # Watch mode
```

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Environment Variables
- **Backend**: Copy `backend/env.example` to `backend/.env`
- **Frontend**: Create `frontend/.env.local`

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมพัฒนา
