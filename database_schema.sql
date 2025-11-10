-- Futanta Fuler Ashor Database Schema
-- Created for Supabase PostgreSQL database

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Library table for books and documents
CREATE TABLE IF NOT EXISTS library (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT,
    url TEXT,
    download_url TEXT,
    thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notices table for announcements
CREATE TABLE IF NOT EXISTS notices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT,
    date TEXT,
    thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table for events and activities
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT,
    date TEXT,
    thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blogs table for blog posts
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    tags TEXT,
    thumbnail TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memberships table for membership applications
CREATE TABLE IF NOT EXISTS memberships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    father_name TEXT,
    mother_name TEXT,
    institution TEXT,
    address TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_library_title ON library(title);
CREATE INDEX IF NOT EXISTS idx_library_type ON library(type);
CREATE INDEX IF NOT EXISTS idx_library_created ON library(created_at);

CREATE INDEX IF NOT EXISTS idx_notices_title ON notices(title);
CREATE INDEX IF NOT EXISTS idx_notices_date ON notices(date);
CREATE INDEX IF NOT EXISTS idx_notices_created ON notices(created_at);

CREATE INDEX IF NOT EXISTS idx_events_title ON events(title);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);

CREATE INDEX IF NOT EXISTS idx_blogs_title ON blogs(title);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_created ON blogs(created_at);

CREATE INDEX IF NOT EXISTS idx_memberships_email ON memberships(email);
CREATE INDEX IF NOT EXISTS idx_memberships_created ON memberships(created_at);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE library ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Public read access for library" ON library FOR SELECT USING (true);
CREATE POLICY "Public read access for notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public read access for memberships" ON memberships FOR SELECT USING (true);

-- Create policies for insert access (adjust as needed)
CREATE POLICY "Public insert access for memberships" ON memberships FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE OR REPLACE TRIGGER update_library_updated_at 
    BEFORE UPDATE ON library 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_notices_updated_at 
    BEFORE UPDATE ON notices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON blogs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_memberships_updated_at 
    BEFORE UPDATE ON memberships 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove in production)
INSERT INTO library (title, description, type, url, download_url, thumbnail) VALUES
('পথের পাঁচালী', 'বিভূতিভূষণ বন্দ্যোপাধ্যায়ের কালজয়ী সৃষ্টি', 'বই', 'https://example.com/book1', 'https://drive.google.com/file/d/1', 'https://picsum.photos/600/360'),
('সোনার কাঁথা', 'লোকজ সাহিত্য বিষয়ক একটি গুরুত্বপূর্ণ গ্রন্থ', 'বই', 'https://example.com/book2', 'https://drive.google.com/file/d/2', 'https://picsum.photos/600/360'),
('রূপকথার রাজ্য', 'বাচ্চাদের জন্য গল্প ও শিক্ষামূলক লেখা', 'ম্যাগাজিন', 'https://example.com/mag1', 'https://drive.google.com/file/d/3', 'https://picsum.photos/600/360');

INSERT INTO notices (title, description, type, date, thumbnail) VALUES
('বার্ষিক সাধারণ সভা', 'সকল সদস্যদের উপস্থিতি কাম্য', 'সভা', '2024-01-15', 'https://picsum.photos/600/360'),
('লাইব্রেরি সময়সূচী', 'নতুন সময়সূচী প্রকাশিত হয়েছে', 'সাধারণ', '2024-01-10', 'https://picsum.photos/600/360');

INSERT INTO events (title, description, type, date, thumbnail) VALUES
('বইমেলা ২০২৪', 'বার্ষিক বইমেলা ও সাংস্কৃতিক অনুষ্ঠান', 'সাংস্কৃতিক', '2024-02-01', 'https://picsum.photos/600/360'),
('বক্তৃতা প্রতিযোগিতা', 'যুবদের জন্য বক্তৃতা প্রতিযোগিতা', 'প্রতিযোগিতা', '2024-01-20', 'https://picsum.photos/600/360');

INSERT INTO blogs (title, content, category, tags, thumbnail) VALUES
('সাহিত্য চর্চা', 'সাহিত্য চর্চার গুরুত্ব ও প্রয়োজনীয়তা নিয়ে আলোচনা', 'সাহিত্য', 'সাহিত্য,চর্চা,শিক্ষা', 'https://picsum.photos/600/360'),
('যুব উন্নয়ন', 'যুব সমাজের উন্নয়ন ও ভবিষ্যৎ পরিকল্পনা', 'সমাজ', 'যুব,উন্নয়ন,শিক্ষা', 'https://picsum.photos/600/360');

-- Comments for documentation
COMMENT ON TABLE library IS 'Stores library books and documents with download links';
COMMENT ON TABLE notices IS 'Stores organization notices and announcements';
COMMENT ON TABLE events IS 'Stores events and activities information';
COMMENT ON TABLE blogs IS 'Stores blog posts and articles';
COMMENT ON TABLE memberships IS 'Stores membership application forms';

-- Create storage buckets for images and files
INSERT INTO storage.buckets (id, name, public) VALUES 
('library-images', 'library-images', true),
('notices-images', 'notices-images', true),
('events-images', 'events-images', true),
('blogs-images', 'blogs-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public read access
CREATE POLICY "Public read access for library images" ON storage.objects FOR SELECT 
USING (bucket_id = 'library-images');

CREATE POLICY "Public read access for notices images" ON storage.objects FOR SELECT 
USING (bucket_id = 'notices-images');

CREATE POLICY "Public read access for events images" ON storage.objects FOR SELECT 
USING (bucket_id = 'events-images');

CREATE POLICY "Public read access for blogs images" ON storage.objects FOR SELECT 
USING (bucket_id = 'blogs-images');

-- Set up storage policies for authenticated users to upload
CREATE POLICY "Authenticated users can upload library images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'library-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload notices images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'notices-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload events images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'events-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload blogs images" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'blogs-images' AND auth.role() = 'authenticated');

-- Display confirmation message
SELECT 'Database schema and storage buckets created successfully!' AS message;

-- Admin Profile table for storing admin details
CREATE TABLE IF NOT EXISTS profile (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UID" UUID NULL DEFAULT auth.uid(),
    "Name" TEXT NULL,
    "Role" TEXT NULL
);

-- Enable RLS and allow public read for profile (adjust as needed)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for profile" ON profile FOR SELECT USING (true);