
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url);
    const path = url.pathname;
    const searchParams = url.searchParams;

    console.log(`API Request: ${req.method} ${path}`);

    // Check API key (optional for now, but track usage)
    const apiKey = req.headers.get('x-api-key') || searchParams.get('key');
    if (apiKey) {
      // Update last_used_at for the API key
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('key_hash', apiKey);
    }

    // Route handling
    if (path === '/bible-api/books' && req.method === 'GET') {
      const { data: books, error } = await supabase
        .from('bible_books')
        .select('*')
        .order('book_order');

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          data: books,
          count: books.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (path.startsWith('/bible-api/books/') && req.method === 'GET') {
      const bookName = path.split('/')[3];
      const chapter = searchParams.get('chapter');
      const verse = searchParams.get('verse');

      // Get book info
      const { data: book, error: bookError } = await supabase
        .from('bible_books')
        .select('id, name, telugu_name')
        .eq('name', bookName)
        .single();

      if (bookError || !book) {
        return new Response(
          JSON.stringify({ success: false, error: 'Book not found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404 
          }
        );
      }

      let query = supabase
        .from('bible_verses')
        .select('chapter, verse, text')
        .eq('book_id', book.id);

      if (chapter) {
        query = query.eq('chapter', parseInt(chapter));
      }
      
      if (verse && chapter) {
        query = query.eq('verse', parseInt(verse));
      }

      query = query.order('chapter').order('verse');

      const { data: verses, error: versesError } = await query;

      if (versesError) throw versesError;

      return new Response(
        JSON.stringify({
          success: true,
          book: book,
          data: verses,
          count: verses.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (path === '/bible-api/search' && req.method === 'GET') {
      const query = searchParams.get('q');
      const limit = parseInt(searchParams.get('limit') || '20');

      if (!query) {
        return new Response(
          JSON.stringify({ success: false, error: 'Search query required' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }

      const { data: verses, error } = await supabase
        .from('bible_verses')
        .select(`
          chapter,
          verse,
          text,
          bible_books!inner(name, telugu_name)
        `)
        .textSearch('text', query)
        .limit(limit);

      if (error) throw error;

      return new Response(
        JSON.stringify({
          success: true,
          query: query,
          data: verses,
          count: verses.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Default 404 response
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Endpoint not found',
        available_endpoints: [
          'GET /bible-api/books',
          'GET /bible-api/books/{book_name}?chapter=1&verse=1',
          'GET /bible-api/search?q=దేవుడు&limit=20'
        ]
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404 
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})
