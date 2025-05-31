
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Users, RefreshCw } from "lucide-react";

interface User {
  id: string;
  email: string;
  username: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('admin_get_all_users');
      
      if (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
        return;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      setDeletingUserId(userId);
      
      const { error } = await supabase.rpc('admin_delete_user', {
        user_id_to_delete: userId
      });

      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: `Failed to delete user: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `User ${userEmail} has been deleted successfully`,
      });

      // Refresh the user list
      await fetchUsers();
    } catch (error) {
      console.error("Error in handleDeleteUser:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-netflix-red" />
          <h2 className="text-2xl font-bold text-white">User Management</h2>
        </div>
        <Button
          onClick={fetchUsers}
          disabled={isLoading}
          variant="outline"
          className="border-netflix-darkgray text-white hover:bg-netflix-darkgray/50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-netflix-lightgray">Loading users...</div>
        </div>
      ) : (
        <div className="border border-netflix-darkgray rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-netflix-darkgray hover:bg-netflix-darkgray/20">
                <TableHead className="text-netflix-lightgray">Email</TableHead>
                <TableHead className="text-netflix-lightgray">Username</TableHead>
                <TableHead className="text-netflix-lightgray">Created At</TableHead>
                <TableHead className="text-netflix-lightgray">Last Sign In</TableHead>
                <TableHead className="text-netflix-lightgray">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-netflix-darkgray hover:bg-netflix-darkgray/10"
                >
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell className="text-netflix-lightgray">
                    {user.username || "Not set"}
                  </TableCell>
                  <TableCell className="text-netflix-lightgray">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-netflix-lightgray">
                    {formatDate(user.last_sign_in_at)}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          disabled={deletingUserId === user.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-netflix-black border-netflix-darkgray">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Delete User
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-netflix-lightgray">
                            Are you sure you want to delete user "{user.email}"? 
                            This action cannot be undone and will permanently remove 
                            all of their data including favorites, preferences, and notifications.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-netflix-darkgray text-white border-netflix-darkgray hover:bg-netflix-darkgray/80">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deletingUserId === user.id}
                          >
                            {deletingUserId === user.id ? "Deleting..." : "Delete User"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {users.length === 0 && (
            <div className="text-center py-8 text-netflix-lightgray">
              No users found
            </div>
          )}
        </div>
      )}
      
      <div className="text-sm text-netflix-lightgray">
        Total users: {users.length}
      </div>
    </div>
  );
};

export default UserManagement;
