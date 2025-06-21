
-- Create table for Bible books
CREATE TABLE public.bible_books (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  telugu_name TEXT NOT NULL,
  testament TEXT NOT NULL CHECK (testament IN ('old', 'new')),
  book_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for Bible verses
CREATE TABLE public.bible_verses (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES public.bible_books(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(book_id, chapter, verse)
);

-- Insert some sample Bible books
INSERT INTO public.bible_books (name, telugu_name, testament, book_order) VALUES
('matthew', 'మత్తయి', 'new', 1),
('mark', 'మార్కు', 'new', 2),
('luke', 'లూకా', 'new', 3),
('john', 'యోహాను', 'new', 4),
('acts', 'అపొస్తలుల కార్యములు', 'new', 5),
('romans', 'రోమీయులకు', 'new', 6);

-- Insert some sample verses
INSERT INTO public.bible_verses (book_id, chapter, verse, text) VALUES
(1, 1, 1, 'అబ్రాహాము కుమారుడు దావీదు కుమారుడు యేసుక్రీస్తు వంశావళి'),
(4, 3, 16, 'దేవుడు లోకమును ఎంతో ప్రేమించెను కనుక తన అద్వితీయ కుమారుని దానికిచ్చెను'),
(4, 3, 1, 'పరిసయ్యులలో నీకొదేము అను పేరుగల మనుష్యుడొకడుండెను');

-- Enable RLS on both tables
ALTER TABLE public.bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bible_verses ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access (since this is a public Bible API)
CREATE POLICY "Anyone can read bible books" ON public.bible_books FOR SELECT USING (true);
CREATE POLICY "Anyone can read bible verses" ON public.bible_verses FOR SELECT USING (true);

-- Create table for API keys
CREATE TABLE public.api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on API keys table
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Policy for API keys (only allow reading your own keys - we'll handle this via edge functions)
CREATE POLICY "Service role can manage api keys" ON public.api_keys USING (false);
