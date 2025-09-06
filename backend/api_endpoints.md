# Complete SynergySphere API Endpoint Reference

Below is a comprehensive guide to all API endpoints in the SynergySphere backend, including required payloads, headers, and expected responses.

## Authentication Endpoints

### 1. Register a New User

**Request:**
```http
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "admin"  // Optional: "admin" or "member" (defaults to "member")
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "admin"
  }
}
```

### 2. Login

**Request:**
```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "user_id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "admin"
    }
  }
}
```

### 3. Get Current User Profile

**Request:**
```http
GET http://localhost:3000/api/v1/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user_id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "admin",
    "created_at": "2025-09-06T10:00:00.000Z"
  }
}
```

### 4. Change Password

**Request:**
```http
POST http://localhost:3000/api/v1/auth/change-password
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "currentPassword": "securePassword123",
  "newPassword": "newSecurePassword456"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

## Project Endpoints

### 1. Create a New Project

**Request:**
```http
POST http://localhost:3000/api/v1/projects
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Mobile App Development",
  "description": "Creating a cross-platform mobile application"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Project created successfully",
  "data": {
    "project_id": 1,
    "name": "Mobile App Development",
    "description": "Creating a cross-platform mobile application",
    "created_by": 1,
    "created_at": "2025-09-06T10:30:00.000Z"
  }
}
```

### 2. Get All Projects

**Request:**
```http
GET http://localhost:3000/api/v1/projects
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "projects": [
      {
        "project_id": 1,
        "name": "Mobile App Development",
        "description": "Creating a cross-platform mobile application",
        "created_by": 1,
        "created_at": "2025-09-06T10:30:00.000Z"
      }
    ]
  }
}
```

### 3. Get Project by ID

**Request:**
```http
GET http://localhost:3000/api/v1/projects/1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "project": {
      "project_id": 1,
      "name": "Mobile App Development",
      "description": "Creating a cross-platform mobile application",
      "created_by": 1,
      "created_at": "2025-09-06T10:30:00.000Z",
      "members": [
        {
          "user_id": 1,
          "name": "John Doe",
          "role": "owner"
        }
      ]
    }
  }
}
```

### 4. Update Project

**Request:**
```http
PATCH http://localhost:3000/api/v1/projects/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Mobile App Development v2",
  "description": "Updated project description"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Project updated successfully",
  "data": {
    "project_id": 1,
    "name": "Mobile App Development v2",
    "description": "Updated project description"
  }
}
```

### 5. Add Project Member

**Request:**
```http
POST http://localhost:3000/api/v1/projects/1/members
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "user_id": 2,
  "role": "member"  // "owner", "member", or "viewer"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Member added to project",
  "data": {
    "member_id": 1,
    "project_id": 1,
    "user_id": 2,
    "role": "member"
  }
}
```

## Task Endpoints

### 1. Create a Task

**Request:**
```http
POST http://localhost:3000/api/v1/tasks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "project_id": 1,
  "title": "Design User Interface",
  "description": "Create wireframes and mockups for the mobile app",
  "status": "todo",  // "todo", "in_progress", or "done"
  "due_date": "2025-09-20"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Task created successfully",
  "data": {
    "task_id": 1,
    "project_id": 1,
    "title": "Design User Interface",
    "description": "Create wireframes and mockups for the mobile app",
    "status": "todo",
    "due_date": "2025-09-20",
    "created_at": "2025-09-06T11:00:00.000Z"
  }
}
```

### 2. Get Tasks by Project

**Request:**
```http
GET http://localhost:3000/api/v1/projects/1/tasks
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "task_id": 1,
        "project_id": 1,
        "title": "Design User Interface",
        "description": "Create wireframes and mockups for the mobile app",
        "status": "todo",
        "due_date": "2025-09-20",
        "created_at": "2025-09-06T11:00:00.000Z"
      }
    ]
  }
}
```

### 3. Get Task by ID

**Request:**
```http
GET http://localhost:3000/api/v1/tasks/1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "task": {
      "task_id": 1,
      "project_id": 1,
      "title": "Design User Interface",
      "description": "Create wireframes and mockups for the mobile app",
      "status": "todo",
      "due_date": "2025-09-20",
      "created_at": "2025-09-06T11:00:00.000Z",
      "assignees": [
        {
          "user_id": 1,
          "name": "John Doe"
        }
      ]
    }
  }
}
```

### 4. Update Task

**Request:**
```http
PATCH http://localhost:3000/api/v1/tasks/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Updated Task Title",
  "description": "Updated task description",
  "status": "in_progress",
  "due_date": "2025-09-25"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Task updated successfully",
  "data": {
    "task_id": 1,
    "title": "Updated Task Title",
    "status": "in_progress"
  }
}
```

### 5. Assign Task

**Request:**
```http
POST http://localhost:3000/api/v1/tasks/1/assignments
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "user_id": 2
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Task assigned successfully",
  "data": {
    "assignment_id": 1,
    "task_id": 1,
    "user_id": 2
  }
}
```

### 6. Add Comment to Task

**Request:**
```http
POST http://localhost:3000/api/v1/tasks/1/comments
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "content": "I've started working on the wireframes."
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Comment added successfully",
  "data": {
    "comment_id": 1,
    "task_id": 1,
    "user_id": 1,
    "content": "I've started working on the wireframes.",
    "created_at": "2025-09-06T11:30:00.000Z"
  }
}
```

## Comment Endpoints

### 1. Get Comments for a Task

**Request:**
```http
GET http://localhost:3000/api/v1/tasks/1/comments
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "comments": [
      {
        "comment_id": 1,
        "task_id": 1,
        "user_id": 1,
        "user_name": "John Doe",
        "content": "I've started working on the wireframes.",
        "created_at": "2025-09-06T11:30:00.000Z"
      }
    ]
  }
}
```

### 2. Update Comment

**Request:**
```http
PATCH http://localhost:3000/api/v1/comments/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "content": "Updated comment content"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Comment updated successfully",
  "data": {
    "comment_id": 1,
    "content": "Updated comment content"
  }
}
```

### 3. Delete Comment

**Request:**
```http
DELETE http://localhost:3000/api/v1/comments/1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Comment deleted successfully"
}
```

## Workload Endpoints

### 1. Get User Workload

**Request:**
```http
GET http://localhost:3000/api/v1/workload/users/1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "workload": [
      {
        "workload_id": 1,
        "user_id": 1,
        "project_id": 1,
        "project_name": "Mobile App Development v2",
        "task_count": 3,
        "estimated_hours": 15,
        "updated_at": "2025-09-06T12:00:00.000Z"
      }
    ]
  }
}
```

### 2. Update Workload

**Request:**
```http
PATCH http://localhost:3000/api/v1/workload/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "estimated_hours": 20
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Workload updated successfully",
  "data": {
    "workload_id": 1,
    "estimated_hours": 20
  }
}
```

## Mood Pulse Endpoints

### 1. Submit Mood Pulse

**Request:**
```http
POST http://localhost:3000/api/v1/mood
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "project_id": 1,
  "mood_value": 4,  // 1-5 scale
  "comment": "Making good progress but feeling a bit stressed"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Mood pulse submitted successfully",
  "data": {
    "mood_id": 1,
    "user_id": 1,
    "project_id": 1,
    "mood_value": 4,
    "comment": "Making good progress but feeling a bit stressed",
    "created_at": "2025-09-06T12:30:00.000Z"
  }
}
```

### 2. Get Mood Pulses for Project

**Request:**
```http
GET http://localhost:3000/api/v1/mood/projects/1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "project_id": 1,
    "project_name": "Mobile App Development v2",
    "mood_data": [
      {
        "date": "2025-09-06",
        "average_mood": 4,
        "mood_count": 5,
        "comments": [
          "Making good progress but feeling a bit stressed",
          "Team collaboration is great"
        ]
      }
    ]
  }
}
```

## Task Dependency Endpoints

### 1. Create Task Dependency

**Request:**
```http
POST http://localhost:3000/api/v1/dependencies
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "task_id": 2,
  "blocked_by": 1,
  "status": "blocked"  // "blocked" or "resolved"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Dependency created successfully",
  "data": {
    "dependency_id": 1,
    "task_id": 2,
    "blocked_by": 1,
    "status": "blocked",
    "created_at": "2025-09-06T13:00:00.000Z"
  }
}
```

### 2. Update Dependency Status

**Request:**
```http
PATCH http://localhost:3000/api/v1/dependencies/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "status": "resolved"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Dependency status updated",
  "data": {
    "dependency_id": 1,
    "status": "resolved"
  }
}
```

### 3. Get Task Dependencies

**Request:**
```http
GET http://localhost:3000/api/v1/dependencies/tasks/2
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "task_id": 2,
    "title": "Implement UI",
    "blocked_by": [
      {
        "dependency_id": 1,
        "task_id": 1,
        "title": "Design User Interface",
        "status": "resolved"
      }
    ],
    "blocking": []
  }
}
```

### 4. Delete Dependency

**Request:**
```http
DELETE http://localhost:3000/api/v1/dependencies/1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Dependency deleted successfully"
}
```

## Tunnel (AI-powered Connection) Endpoints

### 1. Create Tunnel

**Request:**
```http
POST http://localhost:3000/api/v1/tunnels
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "source_type": "task",
  "source_id": 1,
  "target_type": "task",
  "target_id": 3,
  "similarity": 0.85
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Tunnel created successfully",
  "data": {
    "tunnel_id": 1,
    "source_type": "task",
    "source_id": 1,
    "target_type": "task",
    "target_id": 3,
    "similarity": 0.85,
    "created_at": "2025-09-06T13:30:00.000Z"
  }
}
```

### 2. Get Tunnels for a Source

**Request:**
```http
GET http://localhost:3000/api/v1/tunnels?source_type=task&source_id=1
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "tunnels": [
      {
        "tunnel_id": 1,
        "source_type": "task",
        "source_id": 1,
        "target_type": "task",
        "target_id": 3,
        "similarity": 0.85,
        "target_info": {
          "title": "Related Task",
          "project_id": 2
        },
        "created_at": "2025-09-06T13:30:00.000Z"
      }
    ]
  }
}
```

### 3. Generate Tunnels Automatically

**Request:**
```http
POST http://localhost:3000/api/v1/tunnels/generate
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "source_type": "task",
  "source_id": 1,
  "threshold": 0.7  // Optional similarity threshold
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Tunnels generated successfully",
  "data": {
    "generated_tunnels": 3,
    "tunnels": [
      {
        "tunnel_id": 2,
        "source_type": "task",
        "source_id": 1,
        "target_type": "task",
        "target_id": 4,
        "similarity": 0.82
      },
      // ... more tunnels
    ]
  }
}
```

## User Management Endpoints

### 1. Get All Users

**Request:**
```http
GET http://localhost:3000/api/v1/users
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "user_id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "admin",
        "created_at": "2025-09-06T10:00:00.000Z"
      },
      {
        "user_id": 2,
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "role": "member",
        "created_at": "2025-09-06T10:15:00.000Z"
      }
    ]
  }
}
```

### 2. Get User by ID

**Request:**
```http
GET http://localhost:3000/api/v1/users/2
Authorization: Bearer YOUR_JWT_TOKEN
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "user_id": 2,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "role": "member",
      "created_at": "2025-09-06T10:15:00.000Z",
      "projects": [
        {
          "project_id": 1,
          "name": "Mobile App Development v2",
          "role": "member"
        }
      ]
    }
  }
}
```

### 3. Update User

**Request:**
```http
PATCH http://localhost:3000/api/v1/users/2
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Jane Brown",
  "email": "jane.brown@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "user_id": 2,
    "name": "Jane Brown",
    "email": "jane.brown@example.com"
  }
}
```

## Health Check Endpoint

**Request:**
```http
GET http://localhost:3000/health
```

**Success Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-09-06T14:00:00.000Z",
  "uptime": 3600
}
```

## API Root

**Request:**
```http
GET http://localhost:3000/api/v1
```

**Success Response (200 OK):**
```json
{
  "message": "Welcome to SynergySphere API",
  "version": "1.0.0",
  "documentation": "/api/docs"
}
```
