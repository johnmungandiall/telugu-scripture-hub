
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
            API Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <code className="text-blue-800 font-mono">GET /api/verse/{book}/{chapter}/{verse}</code>
              <p className="text-gray-600 mt-1">Get specific verse</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <code className="text-green-800 font-mono">GET /api/search?q={query}</code>
              <p className="text-gray-600 mt-1">Search verses by keyword</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <code className="text-purple-800 font-mono">GET /api/chapter/{book}/{chapter}</code>
              <p className="text-gray-600 mt-1">Get entire chapter</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
