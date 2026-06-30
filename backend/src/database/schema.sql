-- PostgreSQL Database Schema based on the Entity Relationship Diagram (ERD)
-- This file defines the tables, columns, constraints, and relationships for Project K.

-- 1. USERS TABLE
-- Stores user accounts, credentials, and roles.
CREATE TABLE IF NOT EXISTS users (
    -- Unique identifier for the user. Matches 'user_id string pk' in the ERD.
    user_id VARCHAR(255) PRIMARY KEY,
    
    -- Unique username for logging in. Matches 'username string unique'.
    username VARCHAR(255) UNIQUE NOT NULL,
    
    -- User's email address. Matches 'email string'.
    email VARCHAR(255) NOT NULL,
    
    -- Secure hashed password. Matches 'password_hash string'.
    password_hash VARCHAR(255) NOT NULL,
    
    -- Access role (e.g., 'admin', 'member'). Matches 'role string'.
    role VARCHAR(100) NOT NULL,
    
    -- Approval status (e.g., to control login). Matches 'is_approved bool'. Defaults to false.
    is_approved BOOLEAN DEFAULT FALSE,
    
    -- Timestamp when the user account was created. Matches 'createdAt timestamp'.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROFILES TABLE
-- Stores profile details for a user. One-to-one relationship with the users table.
CREATE TABLE IF NOT EXISTS profiles (
    -- Unique identifier for the profile. Matches 'profile_id string pk'.
    profile_id VARCHAR(255) PRIMARY KEY,
    
    -- Foreign key referencing the users table. Matches 'user_id string fk'.
    -- If a user is deleted, their profile is also deleted automatically (ON DELETE CASCADE).
    user_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Contact details/phone number. Matches 'contact string'.
    contact VARCHAR(100),
    
    -- Timestamp when the profile was created. Matches 'createdAt timestamp'.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. PROJECTS TABLE
-- Stores portfolio links and project details for a profile. One-to-many relationship.
CREATE TABLE IF NOT EXISTS projects (
    -- Unique auto-incrementing identifier for the project. Matches 'project_id int pk'.
    project_id SERIAL PRIMARY KEY,
    
    -- Foreign key referencing the profile. Matches 'profile_id string fk'.
    -- If the profile is deleted, its projects are also deleted.
    profile_id VARCHAR(255) NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    
    -- URL link to the project repository or demo. Matches 'link string'.
    link VARCHAR(255),
    
    -- Detailed text description of the project. Matches 'description string'.
    description TEXT
);

-- 4. SKILLS TABLE
-- Stores master list of available skills.
CREATE TABLE IF NOT EXISTS skills (
    -- Unique auto-incrementing identifier for the skill. Matches 'skill_id int pk'.
    skill_id SERIAL PRIMARY KEY,
    
    -- Name of the skill (e.g. 'Node.js', 'PostgreSQL'). Matches 'name string'.
    name VARCHAR(100) NOT NULL,
    
    -- Category of the skill (e.g. 'Backend', 'Frontend'). Matches 'category string'.
    category VARCHAR(100)
);

-- 5. MEMBER_SKILLS JUNCTION TABLE
-- Junction table implementing a Many-to-Many relationship between Profiles and Skills.
CREATE TABLE IF NOT EXISTS member_skills (
    -- Foreign key referencing the profile. Matches 'profile_id string fk'.
    profile_id VARCHAR(255) NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    
    -- Foreign key referencing the skill. Matches 'skill_id int fk'.
    skill_id INT NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
    
    -- Composite primary key to ensure uniqueness of profile-skill pairs.
    PRIMARY KEY (profile_id, skill_id)
);

-- 6. RESUME TABLE
-- Stores resume file paths for a profile. One-to-one relationship with profiles.
CREATE TABLE IF NOT EXISTS resume (
    -- Unique auto-incrementing identifier for the resume record. Matches 'resume_id int pk'.
    resume_id SERIAL PRIMARY KEY,
    
    -- Foreign key referencing the profile. Matches 'profile_id string fk'.
    profile_id VARCHAR(255) NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    
    -- File path on the server where the resume is stored. Matches 'filePath string'.
    file_path VARCHAR(255) NOT NULL
);
