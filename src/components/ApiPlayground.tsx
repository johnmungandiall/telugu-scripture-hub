
import { useState } from "react";
import { Play, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const exampleEndpoints = [
  {
    name: "Get Specific Verse",
    method: "GET",
    endpoint: "/api/verse/matthew/1/1",
    description: "Retrieve Matthew 1:1"
  },
  {
    name: "Search Verses",
    method: "GET", 
    endpoint: "/api/search?q=love",
    description: "Search for verses containing 'love'"
  },
  {
    name: "Get Chapter",
    method: "GET",
    endpoint: "/api/chapter/john/3",
    description: "Get all verses from John chapter 3"
  }
];

const mockResponses = {
  "/api/verse/matthew/1/1": {
    success: true,
    data: {
      book: "matthew",
      chapter: 1,
      verse: 1,
      text: "అబ్రాహాము కుమారుడు దావీదు కుమారుడు యేసుక్రీస్తు వంశావళి"
    }
  },
  "/api/search?q=love": {
    success: true,
    data: [
      {
        book: "john",
        chapter: 3,
        verse: 16,
        text: "దేవుడు లోకమును ఎంతో ప్రేమించెను..."
      }
    ],
    total: 245
  },
  "/api/chapter/john/3": {
    success: true,
    data: [
      {
        book: "john",
        chapter: 3,
        verse: 1,
        text: "పరిసయ్యులలో నీకొదేము అను పేరుగల మనుష్యుడొకడుండెను..."
      }
    ],
    total: 36
  }
};

export const ApiPlayground = () => {
  const { toast } = useToast();
  const [selectedEndpoint, setSelectedEndpoint] = useState(exampleEndpoints[0]);
  const [apiKey, setApiKey] = useState("tbapi_1234567890abcdef1234567890abcdef12345678");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTestApi = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const endpoint = customEndpoint || selectedEndpoint.endpoint;
      const mockResponse = mockResponses[endpoint] || {
        success: false,
        error: "Endpoint not found in mock data"
      };
      
      setResponse(JSON.stringify(mockResponse, null, 2));
      setIsLoading(false);
      
      toast({
        title: "API Test Complete",
        description: "Check the response below",
      });
    }, 1000);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Response copied to clipboard",
    });
  };

  const generateCurlCommand = () => {
    const endpoint = customEndpoint || selectedEndpoint.endpoint;
    return `curl -X GET "https://api.telugubible.com${endpoint}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-green-600" />
            API Playground
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="font-mono text-sm"
            />
          </div>

          {/* Endpoint Selection */}
          <div className="space-y-2">
            <Label>Select Example Endpoint</Label>
            <Select
              value={selectedEndpoint.name}
              onValueChange={(value) => {
                const endpoint = exampleEndpoints.find(e => e.name === value);
                if (endpoint) setSelectedEndpoint(endpoint);
                setCustomEndpoint("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exampleEndpoints.map((endpoint) => (
                  <SelectItem key={endpoint.name} value={endpoint.name}>
                    {endpoint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">{selectedEndpoint.description}</p>
          </div>

          {/* Custom Endpoint */}
          <div className="space-y-2">
            <Label htmlFor="custom-endpoint">Or Enter Custom Endpoint</Label>
            <Input
              id="custom-endpoint"
              type="text"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              placeholder="/api/verse/luke/2/11"
              className="font-mono text-sm"
            />
          </div>

          {/* Test Button */}
          <Button 
            onClick={handleTestApi} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test API"}
          </Button>

          {/* cURL Command */}
          <div className="space-y-2">
            <Label>cURL Command</Label>
            <div className="relative">
              <Textarea
                value={generateCurlCommand()}
                readOnly
                className="font-mono text-xs bg-gray-50"
                rows={4}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  navigator.clipboard.writeText(generateCurlCommand());
                  toast({ title: "Copied!", description: "cURL command copied to clipboard" });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Response */}
          {response && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Response</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyResponse}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <Textarea
                value={response}
                readOnly
                className="font-mono text-xs bg-gray-50"
                rows={12}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub Auto-Sync Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Auto-Sync Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Webhook Configuration</h4>
              <p className="text-sm text-blue-800 mb-3">
                To automatically fetch Bible data when new commits happen, set up a GitHub webhook:
              </p>
              <ol className="text-sm text-blue-800 space-y-2 ml-4 list-decimal">
                <li>Go to your GitHub repository settings</li>
                <li>Navigate to "Webhooks" section</li>
                <li>Add webhook with URL: <code className="bg-white px-2 py-1 rounded">https://your-api.com/webhook/github</code></li>
                <li>Select "Push" events</li>
                <li>Set content type to "application/json"</li>
              </ol>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Auto-Sync Status</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">Last sync: 2 hours ago</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-800">Active</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Manual Sync</h4>
              <p className="text-sm text-orange-800 mb-3">
                You can also trigger a manual sync of Bible data from GitHub:
              </p>
              <Button variant="outline" size="sm">
                Sync Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
