-- Drop tables in reverse order of dependency
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
    viewer_profile_id UUID REFERENCES profiles(profile_id) ON DELETE SET NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Resume Downloads Table
CREATE TABLE resume_downloads (
    download_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    downloader_profile_id UUID REFERENCES profiles(profile_id) ON DELETE SET NULL,
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
