-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS outbound_clicks CASCADE;
DROP TABLE IF EXISTS pitch_members CASCADE;
DROP TABLE IF EXISTS pitches CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS approval_requests CASCADE;
DROP TABLE IF EXISTS resume_downloads CASCADE;
DROP TABLE IF EXISTS profile_views CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS member_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS contact_info CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'member',
    is_approved BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Profiles Table
CREATE TABLE profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    yr_of_graduation INT,
    bio TEXT,
    tagline VARCHAR(255),
    availability VARCHAR(100),
    profile_image VARCHAR(255),
    department VARCHAR(255),
    college VARCHAR(255),
    location VARCHAR(255),
    role_category VARCHAR(100) DEFAULT 'Other Members',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contact Info Table
CREATE TABLE contact_info (
    contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    phone VARCHAR(50),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    portfolio_url VARCHAR(255)
);

-- 4. Skills Table
CREATE TABLE skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100)
);

-- 5. Member Skills Table (Junction)
CREATE TABLE member_skills (
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
    level VARCHAR(100), -- e.g., Beginner, Intermediate, Expert
    PRIMARY KEY (profile_id, skill_id)
);

-- 6. Projects Table
CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    github_link VARCHAR(255),
    tech_stack VARCHAR(255),
    demo_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Resumes Table
CREATE TABLE resumes (
    resume_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Profile Views Table
CREATE TABLE profile_views (
    view_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viewed_profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    viewer_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Resume Downloads Table
CREATE TABLE resume_downloads (
    download_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    downloader_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Approval Requests Table
CREATE TABLE approval_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
    reviewed_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP
);

-- 11. Audit Logs Table
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Pitches Table
CREATE TABLE pitches (
    pitch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Pitch Members Table (Junction)
CREATE TABLE pitch_members (
    pitch_id UUID NOT NULL REFERENCES pitches(pitch_id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    PRIMARY KEY (pitch_id, profile_id)
);

-- 14. Outbound Clicks Table
CREATE TABLE outbound_clicks (
    click_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    link_type VARCHAR(100) NOT NULL, -- e.g. github, linkedin, portfolio, leetcode
    clicked_url VARCHAR(255) NOT NULL,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Predefined Engineering-Only Skills Seed Data
INSERT INTO skills (name, category) VALUES
-- Software Engineering & Web Development
('JavaScript', 'Software Engineering'),
('TypeScript', 'Software Engineering'),
('Python', 'Software Engineering'),
('Java', 'Software Engineering'),
('C++', 'Software Engineering'),
('Go (Golang)', 'Software Engineering'),
('Rust', 'Software Engineering'),
('Ruby', 'Software Engineering'),
('C#', 'Software Engineering'),
('HTML5/CSS3', 'Software Engineering'),
('React.js', 'Software Engineering'),
('Angular', 'Software Engineering'),
('Vue.js', 'Software Engineering'),
('Next.js', 'Software Engineering'),
('Node.js', 'Software Engineering'),
('Express.js', 'Software Engineering'),
('Django', 'Software Engineering'),
('Spring Boot', 'Software Engineering'),
('ASP.NET Core', 'Software Engineering'),
('GraphQL', 'Software Engineering'),
('REST APIs', 'Software Engineering'),
('Microservices', 'Software Engineering'),
('System Design', 'Software Engineering'),

-- Databases & Data Engineering
('PostgreSQL', 'Data Engineering & Databases'),
('MongoDB', 'Data Engineering & Databases'),
('MySQL', 'Data Engineering & Databases'),
('Redis', 'Data Engineering & Databases'),
('SQL', 'Data Engineering & Databases'),
('Apache Cassandra', 'Data Engineering & Databases'),
('Apache Kafka', 'Data Engineering & Databases'),
('Apache Spark', 'Data Engineering & Databases'),
('Data Warehousing', 'Data Engineering & Databases'),
('ETL Pipelines', 'Data Engineering & Databases'),

-- DevOps, Cloud & SRE
('Docker', 'DevOps & Cloud'),
('Kubernetes', 'DevOps & Cloud'),
('Terraform', 'DevOps & Cloud'),
('Amazon Web Services (AWS)', 'DevOps & Cloud'),
('Microsoft Azure', 'DevOps & Cloud'),
('Google Cloud Platform (GCP)', 'DevOps & Cloud'),
('Git/GitHub', 'DevOps & Cloud'),
('CI/CD Pipelines', 'DevOps & Cloud'),
('Linux', 'DevOps & Cloud'),
('Shell Scripting', 'DevOps & Cloud'),
('Jenkins', 'DevOps & Cloud'),

-- Hardware & Systems Engineering
('Embedded Systems', 'Hardware & Systems'),
('C (Programming Language)', 'Hardware & Systems'),
('Microcontrollers', 'Hardware & Systems'),
('Raspberry Pi / Arduino', 'Hardware & Systems'),
('VHDL / Verilog', 'Hardware & Systems'),
('FPGA Development', 'Hardware & Systems'),
('ROS (Robot Operating System)', 'Hardware & Systems'),
('RTOS (Real-Time OS)', 'Hardware & Systems'),
('VLSI Design', 'Hardware & Systems'),
('CAD Design (SolidWorks/AutoCAD)', 'Hardware & Systems')
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- SEED DATA: MOCK USERS & PROFILES
-- ==========================================

-- 1. Insert Users (Password is 'password123' for all mock users)
INSERT INTO users (user_id, username, email, password_hash, role, is_approved) VALUES
('11111111-1111-1111-1111-111111111111', 'atharva', 'atharva@oysterkode.club', '$2b$10$uA6w8r9j0/rWJ2m21D4N.e1zJ72z6U.4L5gYp29m6N8/c8vO01.f2', 'member', true),
('22222222-2222-2222-2222-111111111111', 'sneha', 'sneha.s@oysterkode.club', '$2b$10$uA6w8r9j0/rWJ2m21D4N.e1zJ72z6U.4L5gYp29m6N8/c8vO01.f2', 'member', true),
('33333333-3333-3333-3333-111111111111', 'vikram', 'vikram@oysterkode.club', '$2b$10$uA6w8r9j0/rWJ2m21D4N.e1zJ72z6U.4L5gYp29m6N8/c8vO01.f2', 'member', true),
('44444444-4444-4444-4444-111111111111', 'rohan', 'rohan@oysterkode.club', '$2b$10$uA6w8r9j0/rWJ2m21D4N.e1zJ72z6U.4L5gYp29m6N8/c8vO01.f2', 'member', true),
('55555555-5555-5555-5555-111111111111', 'ananya', 'ananya@oysterkode.club', '$2b$10$uA6w8r9j0/rWJ2m21D4N.e1zJ72z6U.4L5gYp29m6N8/c8vO01.f2', 'alumni', true),
('66666666-6666-6666-6666-111111111111', 'rahul', 'rahul@oysterkode.club', '$2b$10$uA6w8r9j0/rWJ2m21D4N.e1zJ72z6U.4L5gYp29m6N8/c8vO01.f2', 'member', true),
('99999999-9999-9999-9999-111111111111', 'admin', 'admin@oysterkode.club', '$2b$10$uA6w8r9j0/rWJ2m21D4N.e1zJ72z6U.4L5gYp29m6N8/c8vO01.f2', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Profiles
INSERT INTO profiles (profile_id, user_id, full_name, yr_of_graduation, bio, tagline, availability, department, college, location, role_category) VALUES
('11111111-1111-1111-1111-222222222222', '11111111-1111-1111-1111-111111111111', 'Atharva Kulkarni', 2026, 'Passionate software engineer specializing in building high-performance web applications and embedding machine learning models. Active open-source contributor and technical team lead at Oyster Kode Club. Exploring low-latency systems and distributed backend pipelines.', 'Full Stack Engineer & AI Enthusiast', 'Available', 'Core Team', 'Oyster Institute of Technology', 'Mumbai, India', 'Core Team'),
('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-111111111111', 'Sneha Sharma', 2025, 'Focusing on crafting gorgeous, modern, and user-centric interfaces. Bridge the gap between engineering complexity and intuitive interaction designs. Experienced in React, Tailwind, Figma prototyping, and design systems.', 'UI/UX Designer & Frontend Developer', 'Open to work', 'Technical Team', 'School of Design Studies', 'Bangalore, India', 'Technical Team'),
('33333333-3333-3333-3333-222222222222', '33333333-3333-3333-3333-111111111111', 'Vikram Malhotra', 2026, 'Cloud enthusiast and system orchestrator. Interested in container networks, cluster automation, and scalable cluster monitoring systems.', 'DevOps & Cloud Architect', 'Busy', 'Technical Team', 'Tech State College', 'Pune, India', 'Technical Team'),
('44444444-4444-4444-4444-222222222222', '44444444-4444-4444-4444-111111111111', 'Rohan Das', 2025, 'Focused on deep learning pipelines, computer vision systems, and hardware acceleration for edge computing deployments.', 'ML Engineer | Embedded Systems Dev', 'Available', 'Technical Team', 'Institute of Engineering', 'Delhi, India', 'Technical Team'),
('55555555-5555-5555-5555-222222222222', '55555555-5555-5555-5555-111111111111', 'Ananya Iyer', 2023, 'Systems architect specializing in hardware design description, gate arrays, and embedded platform layouts.', 'Systems Engineer & VLSI Designer', 'Available', 'Alumni', 'National Tech Academy', 'Chennai, India', 'Alumni'),
('66666666-6666-6666-6666-222222222222', '66666666-6666-6666-6666-111111111111', 'Rahul Verma', 2026, 'Exploring multi-threaded database engines, performance optimizations, and cloud database integrations.', 'Backend Developer & Database Admin', 'Open to work', 'Other Members', 'City Engineering College', 'Hyderabad, India', 'Other Members')
ON CONFLICT (profile_id) DO NOTHING;

-- 3. Insert Contact Details
INSERT INTO contact_info (profile_id, phone, linkedin, github, portfolio_url) VALUES
('11111111-1111-1111-1111-222222222222', '+91 98765 43210', 'https://linkedin.com/in/atharva', 'https://github.com/atharva', 'https://atharvak.dev'),
('22222222-2222-2222-2222-222222222222', '+91 87654 32109', 'https://linkedin.com/in/sneha', 'https://github.com/sneha', 'https://sneha.design'),
('33333333-3333-3333-3333-222222222222', '+91 76543 21098', 'https://linkedin.com/in/vikram', 'https://github.com/vikram', 'https://vikram.io'),
('44444444-4444-4444-4444-222222222222', '+91 65432 10987', 'https://linkedin.com/in/rohan', 'https://github.com/rohan', 'https://rohan.ai'),
('55555555-5555-5555-5555-222222222222', '+91 54321 09876', 'https://linkedin.com/in/ananya', 'https://github.com/ananya', 'https://ananya.systems'),
('66666666-6666-6666-6666-222222222222', '+91 43210 98765', 'https://linkedin.com/in/rahul', 'https://github.com/rahul', 'https://rahulverma.dev');

-- 4. Link Predefined Skills to Profiles
INSERT INTO member_skills (profile_id, skill_id, level)
SELECT '11111111-1111-1111-1111-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'TypeScript'
UNION ALL
SELECT '11111111-1111-1111-1111-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'Next.js'
UNION ALL
SELECT '11111111-1111-1111-1111-222222222222'::uuid, skill_id, 'Intermediate' FROM skills WHERE name = 'PostgreSQL'
UNION ALL
SELECT '22222222-2222-2222-2222-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'HTML5/CSS3'
UNION ALL
SELECT '22222222-2222-2222-2222-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'React.js'
UNION ALL
SELECT '33333333-3333-3333-3333-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'Docker'
UNION ALL
SELECT '33333333-3333-3333-3333-222222222222'::uuid, skill_id, 'Intermediate' FROM skills WHERE name = 'Kubernetes'
UNION ALL
SELECT '33333333-3333-3333-3333-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'Amazon Web Services (AWS)'
UNION ALL
SELECT '44444444-4444-4444-4444-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'Python'
UNION ALL
SELECT '44444444-4444-4444-4444-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'C++'
UNION ALL
SELECT '44444444-4444-4444-4444-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'Embedded Systems'
UNION ALL
SELECT '55555555-5555-5555-5555-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'VHDL / Verilog'
UNION ALL
SELECT '55555555-5555-5555-5555-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'C (Programming Language)'
UNION ALL
SELECT '55555555-5555-5555-5555-222222222222'::uuid, skill_id, 'Intermediate' FROM skills WHERE name = 'VLSI Design'
UNION ALL
SELECT '66666666-6666-6666-6666-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'Node.js'
UNION ALL
SELECT '66666666-6666-6666-6666-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'Express.js'
UNION ALL
SELECT '66666666-6666-6666-6666-222222222222'::uuid, skill_id, 'Expert' FROM skills WHERE name = 'PostgreSQL'
ON CONFLICT (profile_id, skill_id) DO NOTHING;

-- 5. Insert Projects
INSERT INTO projects (project_id, profile_id, title, description, github_link, tech_stack, demo_link) VALUES
('11111111-2222-3333-4444-555555555555', '11111111-1111-1111-1111-222222222222', 'Distributed Task Scheduler', 'A high-performance cluster job queue built with Go and gRPC, capable of scheduling 10k jobs per second.', 'https://github.com/atharva/scheduler', 'Go, gRPC, Redis, Docker', 'https://scheduler.atharvak.dev'),
('22222222-3333-4444-5555-666666666666', '11111111-1111-1111-1111-222222222222', 'Bento Portfolio Portal', 'A visual portfolio workspace designed with a modular bento grid layout to showcase member capabilities.', 'https://github.com/atharva/bento-portal', 'React, Next.js, Tailwind CSS', 'https://k.oysterkode.club'),
('33333333-4444-5555-6666-777777777777', '22222222-2222-2222-2222-222222222222', 'Oyster Design System', 'A comprehensive UI kit built on Tailwind for rapid frontend prototyping across all club tools.', 'https://github.com/sneha/oyster-ds', 'Figma, React, Tailwind', 'https://design.oysterkode.club')
ON CONFLICT (project_id) DO NOTHING;

