CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    profile_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    contact VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    link VARCHAR(255),
    description TEXT
);

CREATE TABLE IF NOT EXISTS skills (
    skill_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS member_skills (
    profile_id VARCHAR(255) NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    skill_id INT NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, skill_id)
);

CREATE TABLE IF NOT EXISTS resume (
    resume_id SERIAL PRIMARY KEY,
    profile_id VARCHAR(255) NOT NULL REFERENCES profiles(profile_id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL
);
