import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ThumbsUp, MessageCircle, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ratings = [
  {
    project: "Tachasis Village Water Project",
    rating: 5,
    review: "Kazi bora kabisa! Usambazaji wa maji umebadilisha kijiji chetu. Tunashukuru sana kwa mradi huu.",
    user: "James Kimani",
    date: "3 days ago",
    helpful: 12,
    comments: 3,
    status: "completed"
  },
  {
    project: "Kusumek Water Project",
    rating: 4,
    review: "Maendeleo mazuri hadi sasa, lakini kumekuwa na baadhi ya ucheleweshaji. Kwa ujumla nina ridhika na ubora.",
    user: "Mary Wanjiru",
    date: "1 week ago",
    helpful: 8,
    comments: 1,
    status: "in-progress"
  },
  {
    project: "Taita Mauche Dispensary",
    rating: 5,
    review: "This dispensary will save many lives. The construction quality is top-notch!",
    user: "Peter Otieno",
    date: "2 weeks ago",
    helpful: 15,
    comments: 5,
    status: "completed"
  },
  {
    project: "Mauche-Bombo-Olenguruone Road",
    rating: 3,
    review: "Barabara inaboreshwa, lakini kasi ni polepole kuliko ilivyotarajiwa. Natumaini itakwisha hivi karibuni.",
    user: "Grace Muthoni",
    date: "Wiki 3 zilizopita",
    helpful: 5,
    comments: 2,
    status: "in-progress"
  },
];

const ratingDistribution = [
  { stars: 5, count: 8, percentage: 50 },
  { stars: 4, count: 5, percentage: 31 },
  { stars: 3, count: 2, percentage: 13 },
  { stars: 2, count: 1, percentage: 6 },
  { stars: 1, count: 0, percentage: 0 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Completed</Badge>;
    case "in-progress":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200">In Progress</Badge>;
    default:
      return <Badge variant="secondary">Planned</Badge>;
  }
};

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 3.5) return "text-orange-600";
  if (rating >= 2.5) return "text-yellow-600";
  return "text-red-600";
};

const getProgressColor = (percentage: number) => {
  if (percentage >= 70) return "bg-green-500";
  if (percentage >= 40) return "bg-orange-500";
  return "bg-yellow-500";
};

const Ratings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Project Ratings</h2>
          <p className="text-gray-600 mt-2">
            Community feedback and ratings for all projects
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
            Export Report
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Request Feedback
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Rating Card */}
        <Card className="lg:col-span-1 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-orange-50 border-b border-gray-200">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Overall Rating
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${getRatingColor(4.2)}`}>4.2</div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= 4 
                        ? "fill-orange-400 text-orange-400" 
                        : star === 5 
                        ? "text-orange-200" 
                        : "text-orange-400"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">Based on 16 ratings</p>
            </div>

            <div className="mt-6 space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-20">
                    <span className="text-sm font-medium text-gray-700">{item.stars}</span>
                    <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                  </div>
                  <Progress 
                    value={item.percentage} 
                    className="flex-1 h-2 bg-gray-200"
                  />
                  <div className={getProgressColor(item.percentage)} />
                  <span className="text-sm text-gray-600 w-8 text-right font-medium">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">96% Positive Feedback</span>
              </div>
              <p className="text-green-700 text-xs mt-1">
                Most users are satisfied with project outcomes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ratings List */}
        <div className="lg:col-span-2 space-y-4">
          {ratings.map((rating, index) => (
            <Card 
              key={index} 
              className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="border-2 border-green-200">
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                      {rating.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{rating.user}</p>
                          {getStatusBadge(rating.status)}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{rating.project}</p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= rating.rating
                                ? star >= 4 
                                  ? "fill-green-500 text-green-500" 
                                  : star >= 3 
                                  ? "fill-orange-500 text-orange-500" 
                                  : "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className={`ml-2 text-sm font-bold ${
                          rating.rating >= 4 ? 'text-green-600' : 
                          rating.rating >= 3 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          {rating.rating}.0
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3 leading-relaxed">{rating.review}</p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors cursor-pointer">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">{rating.helpful}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors cursor-pointer">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{rating.comments}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {rating.date}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">8</div>
              <p className="text-green-600 text-sm mt-1">5-Star Ratings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">5</div>
              <p className="text-orange-600 text-sm mt-1">4-Star Ratings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-700">2</div>
              <p className="text-yellow-600 text-sm mt-1">3-Star Ratings</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">96%</div>
              <p className="text-blue-600 text-sm mt-1">Satisfaction Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Ratings;