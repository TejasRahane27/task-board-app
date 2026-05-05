# Task Board Application

##  Project Description
This is a full-stack Task Board Application where users can manage projects and tasks efficiently.

The application allows users to:
- Create and manage projects
- Add, update, delete tasks
- Track task status (Todo, InProgress, Done)
- View dashboard analytics
- Switch between Light and Dark mode

---

## Tech Stack

### Frontend
- React.js (Hooks, Context API)
- Bootstrap
- Axios

### Backend
- ASP.NET Core Web API
- Entity Framework Core

### Database
- SQL Server / SQLite

---

##  Features

-  Dashboard (Projects, Tasks, Completed, Overdue)
-  Project Management (CRUD)
-  Task Management (CRUD)
-  Dark/Light Mode (Context + localStorage)
-  Custom Hook (useApi)
-  Validation (Frontend + Backend)
-  Routing (React Router)

---

##  Prerequisites

Make sure you have installed:
- Node.js
- .NET SDK (6 or above)
- SQL Server / SQLite

---

##  Backend Setup

```bash
cd backend/TaskBoard.Api
dotnet restore
dotnet ef database update
dotnet ru


Frontend Setup
cd frontend/task-board-ui
npm install
npm start

 Frontend runs on:

http://localhost:3000



## API Endpoints

### Projects
- GET /api/projects
- POST /api/projects
- DELETE /api/projects/{id}

### Tasks
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/{id}
- DELETE /api/tasks/{id}


##  How to Use

1. Open dashboard
2. Create a new project
3. Add tasks inside project
4. Update task status
5. View analytics on dashboard