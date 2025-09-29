# Web Portal Frontend

Frontend application สำหรับ Web Portal V3.0 ที่พัฒนาด้วย Next.js 15, React 19, และ TypeScript

## 🚀 Features

- **Modern Stack**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI components with Tailwind CSS
- **Responsive Design**: Mobile-first responsive design
- **Dark Mode**: Theme switching support
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Context API and custom hooks
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icons

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   ├── forms/             # Form components
│   │   ├── charts/            # Chart components
│   │   ├── tables/            # Table components
│   │   └── existing/          # Existing components
│   ├── pages/                 # Page components
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   ├── profile/           # Profile pages
│   │   └── settings/          # Settings pages
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── services/              # API services
│   ├── contexts/              # React contexts
│   ├── reducers/              # State reducers
│   ├── middleware/            # Next.js middleware
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utility functions
│   └── styles/                # Global styles
├── public/                    # Static assets
│   └── existing/              # Existing assets
└── package.json
```

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3015
   ```

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3105/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3015

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 UI Components

### Built with Radix UI
- **Accessible**: WCAG compliant components
- **Customizable**: Fully customizable with Tailwind CSS
- **Unstyled**: No default styling, full control

### Available Components
- Accordion, Alert Dialog, Avatar, Badge
- Button, Card, Checkbox, Dialog, Dropdown
- Form, Input, Label, Navigation Menu
- Popover, Progress, Radio Group, Select
- Sheet, Table, Tabs, Toast, Tooltip

## 🎯 Key Features

### Authentication
- Login/Register forms
- Protected routes
- JWT token management
- User profile management

### Dashboard
- Overview statistics
- Interactive charts
- Recent activities
- Notifications

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions

### Theme Support
- Light/Dark mode
- System preference detection
- Smooth theme transitions

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Dependencies

### Core
- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety

### UI & Styling
- **Tailwind CSS**: Utility-first CSS
- **Radix UI**: Accessible components
- **Lucide React**: Icons
- **Class Variance Authority**: Component variants

### Forms & Validation
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **@hookform/resolvers**: Form validation resolvers

### Charts & Visualization
- **Recharts**: Chart library
- **React Day Picker**: Date picker

### Utilities
- **clsx**: Conditional classes
- **tailwind-merge**: Tailwind class merging
- **date-fns**: Date utilities

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically

### Other Platforms
1. Build the application: `npm run build`
2. Start the server: `npm start`
3. Configure environment variables

## 📄 License

MIT License
