
import { Book, FileText, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const bibleBooks = [
  { name: "మత్తయి", verses: 1071, progress: 100 },
  { name: "మార్కు", verses: 678, progress: 100 },
  { name: "లూకా", verses: 1151, progress: 100 },
  { name: "యోహాను", verses: 879, progress: 100 },
  { name: "అపొస్తలుల కార్యములు", verses: 1007, progress: 100 },
  { name: "రోమీయులకు", verses: 433, progress: 100 },
];

export const BibleDataOverview = () => {
  const totalVerses = 31102; // Approximate total verses in Telugu Bible
  const uploadedVerses = 31102;
  const completionPercentage = Math.round((uploadedVerses / totalVerses) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Data Upload Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Total Progress</span>
              <span>{completionPercentage}% Complete</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>Total Verses: {totalVerses.toLocaleString()}</div>
              <div>Uploaded: {uploadedVerses.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-blue-600" />
            Book Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bibleBooks.map((book, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{book.name}</div>
                  <div className="text-sm text-gray-600">{book.verses} verses</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <Progress value={book.progress} className="h-1.5" />
                  </div>
                  <span className="text-sm font-medium text-green-600 w-12">
                    {book.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Authentication</h4>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">Include your API key in the request header:</p>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">Authorization: Bearer YOUR_API_KEY</code>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Available Endpoints</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <code className="text-blue-800 font-mono">GET /api/verse/matthew/1/1</code>
                  <p className="text-gray-600 mt-1">Get a specific verse by book name, chapter, and verse number</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Example: <code>/api/verse/matthew/1/1</code> returns Matthew 1:1
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <code className="text-green-800 font-mono">GET /api/search?q=love</code>
                  <p className="text-gray-600 mt-1">Search verses containing specific keywords</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Example: <code>/api/search?q=love</code> returns all verses containing "love"
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <code className="text-purple-800 font-mono">GET /api/chapter/john/3</code>
                  <p className="text-gray-600 mt-1">Get all verses from a specific chapter</p>
                  <div className="mt-2 text-xs text-gray-500">
                    Example: <code>/api/chapter/john/3</code> returns all verses from John chapter 3
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Response Format</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <pre className="text-xs text-gray-700 overflow-x-auto">
{`{
  "success": true,
  "data": {
    "book": "matthew",
    "chapter": 1,
    "verse": 1,
    "text": "అబ్రాహాము కుమారుడు దావీదు కుమారుడు యేసుక్రీస్తు వంశావళి"
  }
}`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Rate Limits</h4>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  Free tier: 1000 requests per day<br />
                  Premium tier: 10,000 requests per day
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
