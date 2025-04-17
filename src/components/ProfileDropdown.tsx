
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
      
      // Add a small delay before showing the auth modal
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('show-auth-modal'));
      }, 300);
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // If no user is logged in, return null
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-netflix-lightgray hover:text-white relative"
        >
          <User size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-netflix-red rounded-full"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-netflix-black border-netflix-darkgray">
        <DropdownMenuLabel className="text-netflix-lightgray">
          My Account
        </DropdownMenuLabel>
        {user.email && (
          <DropdownMenuLabel className="text-xs text-netflix-lightgray/70 font-normal">
            {user.email}
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator className="bg-netflix-darkgray/50" />
        <DropdownMenuItem
          className="text-netflix-lightgray hover:text-white hover:bg-netflix-darkgray/50 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
