-- Logo Inspo Database Schema
-- Run this on your VPS PostgreSQL

-- Create database (if not exists)
-- CREATE DATABASE logo_inspo;

-- Connect to database
-- \c logo_inspo

-- Create enums
DO $$ BEGIN
    CREATE TYPE theme AS ENUM ('dark', 'light', 'colorful', 'minimal', 'monochrome', 'gradient');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE category AS ENUM ('latest', 'popular', 'all', 'ai', 'finance', 'saas', 'ecommerce', 'healthcare', 'education', 'gaming', 'food', 'travel', 'real-estate', 'technology', 'marketing', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create logos table
CREATE TABLE IF NOT EXISTS logos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    designer VARCHAR(255) NOT NULL,
    description TEXT,
    website_url VARCHAR(500),
    category category NOT NULL DEFAULT 'all',
    logo_url VARCHAR(500) NOT NULL,
    theme theme NOT NULL DEFAULT 'dark',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create screenshots table
CREATE TABLE IF NOT EXISTS screenshots (
    id SERIAL PRIMARY KEY,
    logo_id INTEGER NOT NULL REFERENCES logos(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    width INTEGER,
    height INTEGER,
    "order" INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_logos_category ON logos(category);
CREATE INDEX IF NOT EXISTS idx_logos_theme ON logos(theme);
CREATE INDEX IF NOT EXISTS idx_logos_created_at ON logos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screenshots_logo_id ON screenshots(logo_id);