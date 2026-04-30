import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowLeft, Star, MessageCircle, Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ReviewsAndNotificationsProps {
  onBack: () => void;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderId: string;
  response?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  action?: string;
}

export function ReviewsAndNotifications({ onBack }: ReviewsAndNotificationsProps) {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing pizza! The crust was perfectly crispy and the toppings were fresh. Delivery was quick too.',
      date: '2024-01-15',
      orderId: '#1245'
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      rating: 4,
      comment: 'Great food quality. The margherita pizza was delicious. Only minor issue was delivery took a bit longer than expected.',
      date: '2024-01-12',
      orderId: '#1240'
    },
    {
      id: '3',
      customerName: 'Emma Wilson',
      rating: 5,
      comment: 'Best pizza in town! The garlic bread was also amazing. Highly recommended!',
      date: '2024-01-10',
      orderId: '#1238'
    },
    {
      id: '4',
      customerName: 'David Rodriguez',
      rating: 3,
      comment: 'Food was okay but took longer than expected. Pizza was a bit cold when it arrived.',
      date: '2024-01-08',
      orderId: '#1235'
    },
    {
      id: '5',
      customerName: 'Lisa Thompson',
      rating: 2,
      comment: 'Very disappointed. Pizza was cold and missing toppings. Customer service was slow to respond.',
      date: '2024-01-05',
      orderId: '#1230'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Mozzarella cheese inventory is running low. Consider restocking soon.',
      date: '2024-01-16',
      isRead: false
    },
    {
      id: '2',
      type: 'info',
      title: 'Menu Update Required',
      message: 'Please update your menu with seasonal items for winter promotion.',
      date: '2024-01-15',
      isRead: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Payout Processed',
      message: 'Your weekly payout of $1,245.50 has been processed successfully.',
      date: '2024-01-14',
      isRead: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Customer Complaint',
      message: 'A customer has filed a complaint about order #1230. Please review and respond.',
      date: '2024-01-13',
      isRead: false,
      action: 'Review Complaint'
    },
    {
      id: '5',
      type: 'info',
      title: 'New Feature Available',
      message: 'You can now set different delivery zones with custom fees. Check it out in settings.',
      date: '2024-01-12',
      isRead: true
    }
  ]);

  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleRespondToReview = (reviewId: string) => {
    if (responseText.trim()) {
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, response: responseText }
            : review
        )
      );
      setResponseText('');
      setSelectedReview(null);
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-3 text-primary-foreground hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl">Reviews & Notifications</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Customer Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            {/* Review Summary */}
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Based on {reviews.length} reviews
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {ratingDistribution.map(({ rating, count, percentage }) => (
                      <div key={rating} className="flex items-center space-x-3">
                        <span className="w-8 text-sm">{rating}★</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">({count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{review.customerName}</h4>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{review.date}</span>
                            <span>•</span>
                            <span>Order {review.orderId}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground">{review.comment}</p>
                      
                      {review.response ? (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">
                            <strong>Restaurant Response:</strong> {review.response}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedReview === review.id ? (
                            <div className="space-y-2">
                              <textarea
                                className="w-full p-3 border border-border rounded-lg resize-none"
                                rows={3}
                                placeholder="Write your response..."
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                              />
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleRespondToReview(review.id)}
                                >
                                  Send Response
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedReview(null);
                                    setResponseText('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedReview(review.id)}
                            >
                              Respond
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 ${!notification.isRead ? 'border-primary/50 bg-primary/5' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{notification.date}</span>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <div className="flex items-center space-x-2">
                      {notification.action && (
                        <Button variant="outline" size="sm">
                          {notification.action}
                        </Button>
                      )}
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}