# Personal Life Management System

A full-stack web application for managing personal projects, ideas, and todos with PostgreSQL database persistence.

## 🏗️ Architecture

- **Frontend**: Vue 3 + TypeScript + Vite
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Styling**: Custom CSS with modern design

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### 1. Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create the database**:
   ```sql
   CREATE DATABASE personal_life_management;
   ```

3. **Run the schema creation**:
   ```bash
   psql -U your_username -d personal_life_management -f database/schema.sql
   ```

4. **Insert sample data** (optional):
   ```bash
   psql -U your_username -d personal_life_management -f database/seed.sql
   ```

### 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=personal_life_management
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the backend server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Or production mode
   npm start
   ```

   The server will start at `http://localhost:3001`

### 3. Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd personal-life-management-vue
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:5173`

## 🔧 Development

### Database Schema

The application uses four main tables:
- `users` - User accounts and authentication
- `projects` - Life area projects with progress tracking
- `ideas` - Ideas linked to projects
- `todos` - Task items with completion status

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify` - Verify JWT token

#### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Ideas
- `GET /api/ideas` - Get all user ideas
- `GET /api/ideas/project/:category` - Get ideas by project
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea

#### Todos
- `GET /api/todos` - Get all user todos
- `GET /api/todos/project/:category` - Get todos by project
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle completion status
- `DELETE /api/todos/:id` - Delete todo

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **CORS**: Configured for specific origins
- **Helmet**: Security headers for Express.js
- **SQL Injection Protection**: Parameterized queries

## 🎯 Features

- **Project Management**: Track life areas with progress, priorities, and deadlines
- **Idea Capture**: Brainstorm and organize ideas by project
- **Todo System**: Task management with completion tracking
- **Search & Filter**: Find items quickly with real-time search
- **Responsive Design**: Works on desktop and mobile devices
- **Data Persistence**: All data saved to PostgreSQL database
- **User Authentication**: Secure login and registration system

## 📝 Usage

1. **Register/Login**: Create an account or use existing credentials
2. **Create Projects**: Add life areas you want to track
3. **Add Ideas**: Brainstorm ideas for each project
4. **Create Todos**: Break down projects into actionable tasks
5. **Track Progress**: Update project progress and mark todos complete
6. **Search & Sort**: Use filters to find specific items

## 🛠️ Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `sudo service postgresql start`
- Check database credentials in `.env` file
- Verify database exists: `psql -l`

### Backend Issues
- Check port 3001 is available
- Verify all environment variables are set
- Check logs for detailed error messages

### Frontend Issues
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify CORS settings if accessing from different domain

## 📊 Database Backup

To backup your data:
```bash
pg_dump -U your_username personal_life_management > backup.sql
```

To restore:
```bash
psql -U your_username personal_life_management < backup.sql
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if available)
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.