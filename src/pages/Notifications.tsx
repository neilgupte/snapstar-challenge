
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Award, Camera, Calendar, MessageCircle, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Mock data for demonstration
const mockNotifications = [
  {
    id: '1',
    type: 'contest_win',
    title: 'Congratulations! You won first place',
    message: 'Your photo "Sunset at the Lake" won first place in the Nature Photography contest!',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    type: 'comment',
    title: 'New comment on your photo',
    message: 'PhotoLover123 commented: "Amazing composition and lighting!"',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '3',
    type: 'like',
    title: 'Your photo received 10+ likes',
    message: 'Your photo "City Lights" is getting popular!',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
  },
  {
    id: '4',
    type: 'contest_reminder',
    title: 'Contest ending soon',
    message: 'The "Street Photography" contest ends in 24 hours. Submit your entry now!',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: '5',
    type: 'new_contest',
    title: 'New contest available',
    message: 'A new "Wildlife Photography" contest is now open for submissions.',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'contest_win':
      return <Award className="text-snapstar-green size-5" />;
    case 'comment':
      return <MessageCircle className="text-snapstar-blue size-5" />;
    case 'like':
      return <Heart className="text-red-500 size-5" />;
    case 'contest_reminder':
      return <Camera className="text-snapstar-purple size-5" />;
    case 'new_contest':
      return <Calendar className="text-snapstar-orange size-5" />;
    default:
      return <Bell className="text-gray-500 size-5" />;
  }
};

const formatNotificationDate = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 30) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-20 px-4 text-center">
        <Bell className="mx-auto size-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Sign In to View Notifications</h1>
        <p className="text-muted-foreground mb-6">
          Create an account or sign in to receive contest notifications and updates.
        </p>
        <Button asChild>
          <a href="/signin">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="mx-auto size-16 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">No notifications</h2>
          <p className="text-muted-foreground">
            You'll see notifications about contests, comments, and activity here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`hover:bg-accent/10 transition-colors ${!notification.isRead ? 'border-l-4 border-l-snapstar-purple' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationDate(notification.date)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 mt-1 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
