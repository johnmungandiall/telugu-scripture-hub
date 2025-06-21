
import { useEffect, useState } from "react";
import { Book, Database, Globe, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const BibleDataOverview = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalVerses: 0,
    oldTestament: 0,
    newTestament: 0
  });
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch books
      const { data: booksData, error: booksError } = await supabase
        .from('bible_books')
        .select('*')
        .order('book_order');

      if (booksError) throw booksError;

      // Fetch verse counts
      const { data: versesData, error: versesError } = await supabase
        .from('bible_verses')
        .select('id');

      if (versesError) throw versesError;

      // Calculate stats
      const oldTestamentBooks = booksData.filter(book => book.testament === 'old').length;
      const newTestamentBooks = booksData.filter(book => book.testament === 'new').length;

      setStats({
        totalBooks: booksData.length,
        totalVerses: versesData.length,
        oldTestament: oldTestamentBooks,
        newTestament: newTestamentBooks
      });

      setBooks(booksData);

      toast({
        title: "Data Loaded",
        description: "Bible data overview has been refreshed",
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load Bible data overview",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const endpoints = [
    {
      method: "GET",
      path: "/bible-api/books",
      description: "Get all available Bible books with Telugu names",
      example: "Returns list of books with their Telugu translations"
    },
    {
      method: "GET", 
      path: "/bible-api/books/{book}",
      description: "Get verses from a specific book",
      example: "?chapter=3&verse=16 - Get specific verse"
    },
    {
      method: "GET",
      path: "/bible-api/search",
      description: "Search verses by Telugu text",
      example: "?q=దేవుడు&limit=20 - Search for 'దేవుడు'"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalBooks}</p>
                <p className="text-sm text-gray-600">Total Books</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalVerses.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Verses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.oldTestament}</p>
                <p className="text-sm text-gray-600">Old Testament</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.newTestament}</p>
                <p className="text-sm text-gray-600">New Testament</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>API Endpoints</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
                <p className="text-sm text-gray-600 mb-1">{endpoint.description}</p>
                <p className="text-xs text-gray-500 font-mono">{endpoint.example}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Books */}
      <Card>
        <CardHeader>
          <CardTitle>Available Books ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {books.map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{book.name}</p>
                  <p className="text-sm text-gray-600">{book.telugu_name}</p>
                </div>
                <Badge variant="outline">
                  {book.testament === 'old' ? 'OT' : 'NT'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Base URL Information */}
      <Card>
        <CardHeader>
          <CardTitle>API Base URL</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="block p-3 bg-gray-900 text-green-400 rounded">
            https://pfrnsaftvtkaeimcwgbd.supabase.co/functions/v1
          </code>
          <p className="text-sm text-gray-600 mt-2">
            Use this base URL for all API requests. Authentication via API key is optional but recommended for usage tracking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
