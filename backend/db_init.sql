-- Create the database
CREATE DATABASE IF NOT EXISTS synergysphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE synergysphere;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(100) NOT NULL,
  role ENUM('admin', 'manager', 'team_member') NOT NULL DEFAULT 'team_member',
  profile_image VARCHAR(255),
  department VARCHAR(100),
  skills TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status ENUM('planning', 'in_progress', 'completed', 'on_hold') DEFAULT 'planning',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_projects_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Members table
CREATE TABLE IF NOT EXISTS project_members (
  member_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role ENUM('owner', 'manager', 'member') DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_user (project_id, user_id),
  INDEX idx_project_members_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('backlog', 'todo', 'in_progress', 'review', 'done') DEFAULT 'backlog',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  estimated_hours DECIMAL(5,2),
  complexity_score INT DEFAULT 1,
  due_date DATE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_priority (priority),
  INDEX idx_tasks_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Assignments table
CREATE TABLE IF NOT EXISTS task_assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by INT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_task_user (task_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  comment_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Workload table
CREATE TABLE IF NOT EXISTS workloads (
  workload_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  week_start_date DATE NOT NULL,
  allocated_hours DECIMAL(5,2) DEFAULT 0,
  capacity_hours DECIMAL(5,2) DEFAULT 40,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_week (user_id, week_start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mood Pulse table
CREATE TABLE IF NOT EXISTS mood_pulses (
  pulse_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT NOT NULL,
  mood_score TINYINT NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  feedback TEXT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  INDEX idx_mood_pulses_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task Dependencies table
CREATE TABLE IF NOT EXISTS task_dependencies (
  dependency_id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  depends_on_task_id INT NOT NULL,
  dependency_type ENUM('blocks', 'is_blocked_by', 'relates_to') DEFAULT 'blocks',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
  FOREIGN KEY (depends_on_task_id) REFERENCES tasks(task_id) ON DELETE CASCADE,
  UNIQUE KEY unique_task_dependency (task_id, depends_on_task_id),
  INDEX idx_task_dependencies_type (dependency_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tunnels table (for AI-powered content connections)
CREATE TABLE IF NOT EXISTS tunnels (
  tunnel_id INT AUTO_INCREMENT PRIMARY KEY,
  source_type ENUM('task', 'comment') NOT NULL,
  source_id INT NOT NULL,
  target_type ENUM('task', 'comment') NOT NULL,
  target_id INT NOT NULL,
  similarity_score DECIMAL(4,3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_tunnel (source_type, source_id, target_type, target_id),
  INDEX idx_tunnels_source (source_type, source_id),
  INDEX idx_tunnels_target (target_type, target_id),
  INDEX idx_tunnels_similarity (similarity_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
