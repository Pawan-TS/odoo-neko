# SynergySphere Database Design

## Users
Stores all registered users.

- `user_id` INT (PK, AUTO_INCREMENT)
- `name` VARCHAR(100) NOT NULL
- `email` VARCHAR(150) UNIQUE NOT NULL
- `password` VARCHAR(255) NOT NULL (hashed)
- `role` ENUM('admin','member') DEFAULT 'member'
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- UNIQUE(email)

---

## Projects
Main collaboration container.

- `project_id` INT (PK, AUTO_INCREMENT)
- `name` VARCHAR(150) NOT NULL
- `description` TEXT
- `created_by` INT (FK → Users.user_id, ON DELETE SET NULL)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- INDEX(created_by)

---

## ProjectMembers
Mapping between users and projects with role.

- `member_id` INT (PK, AUTO_INCREMENT)
- `project_id` INT (FK → Projects.project_id, ON DELETE CASCADE)
- `user_id` INT (FK → Users.user_id, ON DELETE CASCADE)
- `role` ENUM('owner','member','viewer') DEFAULT 'member'

Constraints:
- UNIQUE(project_id, user_id)

---

## Tasks
Work items inside projects.

- `task_id` INT (PK, AUTO_INCREMENT)
- `project_id` INT (FK → Projects.project_id, ON DELETE CASCADE)
- `title` VARCHAR(200) NOT NULL
- `description` TEXT
- `status` ENUM('todo','in_progress','done') DEFAULT 'todo'
- `due_date` DATE
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- INDEX(project_id, status)
- INDEX(due_date)

---

## TaskAssignments
Mapping between tasks and assigned users.

- `assignment_id` INT (PK, AUTO_INCREMENT)
- `task_id` INT (FK → Tasks.task_id, ON DELETE CASCADE)
- `user_id` INT (FK → Users.user_id, ON DELETE CASCADE)

Constraints:
- UNIQUE(task_id, user_id)

---

## Comments
Threaded discussions on tasks.

- `comment_id` INT (PK, AUTO_INCREMENT)
- `task_id` INT (FK → Tasks.task_id, ON DELETE CASCADE)
- `user_id` INT (FK → Users.user_id, ON DELETE CASCADE)
- `content` TEXT NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- INDEX(task_id)

---

## Workload
Precomputed workload metrics for smart balancing.

- `workload_id` INT (PK, AUTO_INCREMENT)
- `user_id` INT (FK → Users.user_id, ON DELETE CASCADE)
- `project_id` INT (FK → Projects.project_id, ON DELETE CASCADE)
- `task_count` INT DEFAULT 0
- `estimated_hours` INT DEFAULT 0
- `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

Constraints:
- UNIQUE(user_id, project_id)

---

## MoodPulse
Team health signals.

- `mood_id` INT (PK, AUTO_INCREMENT)
- `user_id` INT (FK → Users.user_id, ON DELETE CASCADE)
- `project_id` INT (FK → Projects.project_id, ON DELETE CASCADE)
- `mood_value` TINYINT CHECK (mood_value BETWEEN 1 AND 5)
- `comment` VARCHAR(255)
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- INDEX(project_id, created_at)

---

## TaskDependency
Represents blocking relationships between tasks.

- `dependency_id` INT (PK, AUTO_INCREMENT)
- `task_id` INT (FK → Tasks.task_id, ON DELETE CASCADE)   -- dependent task
- `blocked_by` INT (FK → Tasks.task_id, ON DELETE CASCADE) -- blocking task
- `status` ENUM('blocked','resolved') DEFAULT 'blocked'

Constraints:
- UNIQUE(task_id, blocked_by)

---

## Tunnels
AI-discovered contextual links between items.

- `tunnel_id` INT (PK, AUTO_INCREMENT)
- `source_type` ENUM('task','comment','doc') NOT NULL
- `source_id` INT NOT NULL
- `target_type` ENUM('task','comment','doc') NOT NULL
- `target_id` INT NOT NULL
- `similarity` FLOAT NOT NULL
- `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Indexes:
- INDEX(source_type, source_id)
- INDEX(target_type, target_id)
