-- Main application database
CREATE DATABASE grc_platform;

-- Kong database
CREATE DATABASE kong;

-- Keycloak database
CREATE DATABASE keycloak;

-- Create users (if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'kong') THEN
        CREATE USER kong WITH PASSWORD 'kong_password';
    ELSE
        ALTER USER kong WITH PASSWORD 'kong_password';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'keycloak') THEN
        CREATE USER keycloak WITH PASSWORD 'keycloak_password';
    ELSE
        ALTER USER keycloak WITH PASSWORD 'keycloak_password';
    END IF;
END
$$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE kong TO kong;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;

-- Grant schema permissions for Keycloak
\c keycloak;
GRANT ALL ON SCHEMA public TO keycloak;
ALTER SCHEMA public OWNER TO keycloak;

-- Switch to main database
\c grc_platform;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create main tables
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100),
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_organizations (
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    role VARCHAR(50),
    PRIMARY KEY (user_id, organization_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_organizations_country ON organizations(country);