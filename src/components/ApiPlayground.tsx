
import { useState } from "react";
import { Play, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const ApiPlayground = () => {
  const { toast } = useToast();
  const [selectedEndpoint, setSelectedEndpoint] = useState("books");
  const [bookName, setBookName] = useState("john");
  const [chapter, setChapter] = useState("3");
  const [verse, setVerse] = useState("16");
  const [searchQuery, setSearchQuery] = useState("దేవుడు");
  const [apiKey, setApiKey] = useState("tbapi_demo_key_for_testing");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = "https://pfrnsaftvtkaeimcwgbd.supabase.co/functions/v1";

  const getApiUrl = () => {
    switch (selectedEndpoint) {
      case "books":
        return `${baseUrl}/bible-api/books`;
      case "verses":
        const params = new URLSearchParams();
        if (chapter) params.append('chapter', chapter);
        if (verse) params.append('verse', verse);
        const queryString = params.toString();
        return `${baseUrl}/bible-api/books/${bookName}${queryString ? '?' + queryString : ''}`;
      case "search":
        return `${baseUrl}/bible-api/search?q=${encodeURIComponent(searchQuery)}&limit=20`;
      default:
        return `${baseUrl}/bible-api/books`;
    }
  };

  const executeRequest = async () => {
    setLoading(true);
    try {
      const url = getApiUrl();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (apiKey) {
        headers['x-api-key'] = apiKey;
      }

      console.log('Making request to:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      setResponse({ status: response.status, data });

      if (response.ok) {
        toast({
          title: "Request Successful",
          description: "API request completed successfully",
        });
      } else {
        toast({
          title: "Request Failed",
          description: data.error || "API request failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Request failed:', error);
      setResponse({ 
        status: 'ERROR', 
        data: { 
          error: error instanceof Error ? error.message : 'Network error occurred' 
        } 
      });
      toast({
        title: "Request Failed",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: "API URL has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const curlCommand = `curl -X GET "${getApiUrl()}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${apiKey}"`;

  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            API Playground
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                <SelectTrigger>
                  <SelectValue placeholder="Select endpoint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="books">Get All Books</SelectItem>
                  <SelectItem value="verses">Get Verses</SelectItem>
                  <SelectItem value="search">Search Verses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apikey">API Key (Optional)</Label>
              <Input
                id="apikey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your API key"
              />
            </div>
          </div>

          {/* Dynamic Parameters */}
          {selectedEndpoint === "verses" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="book">Book Name</Label>
                <Select value={bookName} onValueChange={setBookName}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matthew">Matthew (మత్తయి)</SelectItem>
                    <SelectItem value="mark">Mark (మార్కు)</SelectItem>
                    <SelectItem value="luke">Luke (లూకా)</SelectItem>
                    <SelectItem value="john">John (యోహాను)</SelectItem>
                    <SelectItem value="acts">Acts (అపొస్తలుల కార్యములు)</SelectItem>
                    <SelectItem value="romans">Romans (రోమీయులకు)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chapter">Chapter</Label>
                <Input
                  id="chapter"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="Chapter number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verse">Verse (Optional)</Label>
                <Input
                  id="verse"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  placeholder="Verse number"
                />
              </div>
            </div>
          )}

          {selectedEndpoint === "search" && (
            <div className="space-y-2">
              <Label htmlFor="search">Search Query</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Telugu text to search"
              />
            </div>
          )}

          {/* API URL Display */}
          <div className="space-y-2">
            <Label>Generated URL</Label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                {getApiUrl()}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(getApiUrl())}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Execute Button */}
          <Button onClick={executeRequest} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Making Request...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute Request
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* cURL Command */}
      <Card>
        <CardHeader>
          <CardTitle>cURL Command</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <pre className="flex-1 p-3 bg-gray-900 text-green-400 rounded text-sm overflow-x-auto">
              {curlCommand}
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(curlCommand)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Response */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              API Response
              <span className={`px-2 py-1 rounded text-sm ${
                response.status === 200 || response.status === 'SUCCESS' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {response.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
