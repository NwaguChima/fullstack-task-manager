# Task Manager App

A full-stack task management application built with React (Vite) frontend and Node.js + Express + TypeScript backend. Users can create, manage, and track their personal tasks with authentication and task filtering capabilities.

## Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Database (Mongo DB)

### Backend Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd task-manager-app
   ```

2. Navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```
   MONGO_URL=""
   MONGO_PASSWORD=""
   JWT_SECRET=""
   JWT_EXPIRES_IN=""
   JWT_COOKIE_EXPIRES_IN=""
   NODE_ENV=""
   ```

5. Build the TypeScript code:

   ```bash
   npm run build
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file:

   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Full Application

- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:3000`

## Database Schema Description

### Tables

#### Users

- `id` (Primary Key): UUID or auto-increment integer
- `email`: User email address (unique, required)
- `password`: Hashed password (required)
- `name`: User's full name (required)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

#### Tasks

- `id` (Primary Key): UUID or auto-increment integer
- `title`: Task title (text, required)
- `description`: Task description (text, optional)
- `status`: Task status (enum: 'pending', 'in-progress', 'done')
- `extras`: Additional task data stored as JSON (tags, due_date, priority, etc.)
- `user_id` (Foreign Key): References Users.id
- `created_at`: Task creation timestamp
- `updated_at`: Last update timestamp

### Relationships

- Users have many Tasks (one-to-many relationship)
- Tasks belong to a User (authenticated users can only access their own tasks)

### Sample Extras JSON Structure

```json
{
  "tags": ["work", "urgent"],
  "due_date": "2024-12-31",
  "priority": "high",
  "notes": "Additional notes"
}
```

## Dev Notes: What I'd Build Next If I Had More Time

### Authentication & Validation

- **Refactor login and signup pages**: Separate form components and implement Zod for better validation with React Hook Form for improved user experience and form handling
- **Better UI design**: Enhance the overall user interface with modern design patterns and improved accessibility

### Error Handling & Performance

- **Global error boundary**: Implement comprehensive error handling to gracefully manage and display errors throughout the application
- **Lazy loading**: In a larger application, implement code splitting and lazy loading for better performance and faster initial load times
- **Wildcard screen**: Add a catch-all route for handling 404 errors and unknown paths

### Task Management

- **Separate pages for task operations**: Create dedicated pages for creating and editing tasks instead of using modals or inline editing
- **Better UI components**: Develop a comprehensive component library with consistent styling and reusable elements

### Technical Improvements

- **Better token management**: Implement more secure token handling with refresh tokens and automatic token renewal
- **Separate API hooks**: Create individual custom hooks for each API call to improve code organization and reusability
- **State management**: Consider implementing a more robust state management solution (Redux, Zustand) for complex state interactions
- **Testing**: Add comprehensive unit tests, integration tests, and end-to-end tests
- **Documentation**: Expand API documentation and add inline code documentation

## Features

### Core Features

- **User Authentication**: JWT-based authentication with signup and login
- **Task CRUD Operations**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (pending, in-progress, done)
- **Personal Task Management**: Users can only see and manage their own tasks
- **Task Insights**: Server-side analytics for task status distribution

### Task Model

- **Title**: Required text field
- **Description**: Optional text field
- **Status**: Enum values (pending, in-progress, done)
- **Extras**: Flexible JSON field for additional data (tags, due dates, priority)

### Input Validation

- Empty title validation
- Email format validation
- Password strength requirements
- Task status validation

## Deployed App

🚀 **Live Demo**: [Your App Name]()

---

## Technologies Used

### Frontend

- **React 18** with **Vite** for fast development and building
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Router** for client-side routing
- **Axios** for API calls

### Backend

- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **JWT** for authentication
- **bcrypt** for password hashing
- **Database ORM/Query Builder** (Prisma, Sequelize, or raw SQL)

### Development Scripts

#### Backend Scripts:

```bash
npm run build      # Compile TypeScript to JavaScript
npm run build:dev  # Watch mode TypeScript compilation
npm run dev        # Start development server (with nodemon)
npm start          # Start production server
```

#### Frontend Scripts:

```bash
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
