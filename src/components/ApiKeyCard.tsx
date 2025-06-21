
import { useState } from "react";
import { Copy, Eye, EyeOff, Key, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ApiKeyCard = ({ apiKey, onToggle, onDelete }: ApiKeyCardProps) => {
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.key);
      toast({
        title: "API Key Copied",
        description: "The API key has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  const maskedKey = apiKey.key.slice(0, 8) + "..." + apiKey.key.slice(-4);

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            {apiKey.name}
          </CardTitle>
          <Badge 
            variant={apiKey.isActive ? "default" : "secondary"}
            className={apiKey.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
          >
            {apiKey.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <code className="flex-1 p-2 bg-gray-50 rounded text-sm font-mono">
            {showKey ? apiKey.key : maskedKey}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 space-y-1">
          <p>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</p>
          {apiKey.lastUsed && (
            <p>Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggle(apiKey.id)}
            className="flex items-center gap-2"
          >
            {apiKey.isActive ? (
              <>
                <ToggleRight className="h-4 w-4 text-green-600" />
                Disable
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4 text-gray-600" />
                Enable
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(apiKey.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
