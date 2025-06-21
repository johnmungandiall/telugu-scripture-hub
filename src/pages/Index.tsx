import { useState } from "react";
import { Key, Database, Activity, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { ApiKeyCard } from "@/components/ApiKeyCard";
import { CreateApiKeyDialog } from "@/components/CreateApiKeyDialog";
import { BibleDataOverview } from "@/components/BibleDataOverview";
import { ApiPlayground } from "@/components/ApiPlayground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

const Index = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production Mobile App",
      key: "tbapi_1234567890abcdef1234567890abcdef12345678",
      isActive: true,
      createdAt: "2024-01-15",
      lastUsed: "2024-06-20"
    },
    {
      id: "2", 
      name: "Development Testing",
      key: "tbapi_abcdef1234567890abcdef1234567890abcdef12",
      isActive: true,
      createdAt: "2024-02-10",
      lastUsed: "2024-06-19"
    },
    {
      id: "3",
      name: "Legacy Integration",
      key: "tbapi_fedcba0987654321fedcba0987654321fedcba09",
      isActive: false,
      createdAt: "2023-12-05",
      lastUsed: "2024-05-15"
    }
  ]);

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'tbapi_';
    for (let i = 0; i < 40; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateKey = (name: string) => {
    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      key: generateApiKey(),
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setApiKeys([newKey, ...apiKeys]);
    toast({
      title: "API Key Created",
      description: `New API key "${name}" has been created successfully.`,
    });
  };

  const handleToggleKey = (id: string) => {
    setApiKeys(keys => 
      keys.map(key => 
        key.id === id ? { ...key, isActive: !key.isActive } : key
      )
    );
    
    const key = apiKeys.find(k => k.id === id);
    toast({
      title: key?.isActive ? "API Key Disabled" : "API Key Enabled",
      description: `The API key has been ${key?.isActive ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleDeleteKey = (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    setApiKeys(keys => keys.filter(key => key.id !== id));
    toast({
      title: "API Key Deleted", 
      description: `API key "${key?.name}" has been permanently deleted.`,
      variant: "destructive",
    });
  };

  const activeKeys = apiKeys.filter(key => key.isActive).length;
  const totalRequests = 125847;
  const monthlyRequests = 18923;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active API Keys"
            value={activeKeys}
            icon={Key}
            trend={{ value: 12, isPositive: true }}
            className="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Total Requests"
            value={totalRequests.toLocaleString()}
            icon={Activity}
            trend={{ value: 8, isPositive: true }}
            className="from-green-500 to-green-600"
          />
          <StatsCard
            title="This Month"
            value={monthlyRequests.toLocaleString()}
            icon={Users}
            trend={{ value: 15, isPositive: true }}
            className="from-purple-500 to-purple-600"
          />
          <StatsCard
            title="Bible Verses"
            value="31,102"
            icon={Database}
            className="from-orange-500 to-orange-600"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="api-keys">API Key Management</TabsTrigger>
            <TabsTrigger value="data-overview">Data Overview</TabsTrigger>
            <TabsTrigger value="playground">API Playground</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">API Key Management</h2>
                <p className="text-gray-600">Manage your Telugu Bible API access keys</p>
              </div>
              <CreateApiKeyDialog onCreateKey={handleCreateKey} />
            </div>

            <div className="grid gap-6">
              {apiKeys.map((apiKey) => (
                <ApiKeyCard
                  key={apiKey.id}
                  apiKey={apiKey}
                  onToggle={handleToggleKey}
                  onDelete={handleDeleteKey}
                />
              ))}
            </div>

            {apiKeys.length === 0 && (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
                <p className="text-gray-600 mb-6">Create your first API key to start using the Telugu Bible API</p>
                <CreateApiKeyDialog onCreateKey={handleCreateKey} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="data-overview">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Overview</h2>
                <p className="text-gray-600">Telugu Bible database status and API endpoints</p>
              </div>
              <BibleDataOverview />
            </div>
          </TabsContent>

          <TabsContent value="playground">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">API Playground</h2>
                <p className="text-gray-600">Test API endpoints with live examples and auto-sync setup</p>
              </div>
              <ApiPlayground />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
