
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  content_id: number;
  content_type: string;
}

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', notification.id);

      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      ));
    }

    // Navigate to content if available
    if (notification.content_id) {
      navigate(`/movie/${notification.content_id}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-netflix-lightgray hover:text-white relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-netflix-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-netflix-black border-netflix-darkgray">
        <DropdownMenuLabel className="text-netflix-lightgray">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-netflix-darkgray/50" />
        {notifications.length === 0 ? (
          <DropdownMenuItem className="text-netflix-lightgray">
            No notifications
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray/50 cursor-pointer p-4 ${
                !notification.read ? 'bg-netflix-darkgray/20' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="space-y-1">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm opacity-70">{notification.message}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
