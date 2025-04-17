
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Mail, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}`,
        },
      });
      
      if (error) throw error;
      
      setEmailSent(true);
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account before signing in.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-netflix-black text-white border-netflix-darkgray">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Join MovieVerse</DialogTitle>
          <DialogDescription className="text-netflix-lightgray">
            Sign in or create an account to enjoy unlimited movies and series.
          </DialogDescription>
        </DialogHeader>
        
        {emailSent ? (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-netflix-darkgray/30 rounded-md text-center">
              <h3 className="font-medium text-white mb-2">Verification Email Sent</h3>
              <p className="text-netflix-lightgray text-sm mb-4">
                Please check your email and click the verification link to complete your registration.
              </p>
              <Button 
                onClick={() => setEmailSent(false)} 
                variant="outline" 
                className="border-netflix-darkgray text-netflix-lightgray hover:bg-netflix-darkgray"
              >
                Back to sign in
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-netflix-darkgray">
              <TabsTrigger value="signin" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-netflix-red data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-netflix-lightgray">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="bg-netflix-darkgray/50 border-netflix-darkgray text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-netflix-lightgray">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-netflix-darkgray/50 border-netflix-darkgray text-white"
                  />
                </div>
                <Button type="submit" className="w-full bg-netflix-red hover:bg-netflix-red/90" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-netflix-darkgray"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-netflix-black px-2 text-netflix-lightgray">or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="border-netflix-darkgray text-netflix-lightgray hover:bg-netflix-darkgray">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-netflix-darkgray text-netflix-lightgray hover:bg-netflix-darkgray">
                    <Mail className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-netflix-darkgray text-netflix-lightgray hover:bg-netflix-darkgray">
                    <Github className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-netflix-lightgray">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="bg-netflix-darkgray/50 border-netflix-darkgray text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-netflix-lightgray">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-netflix-darkgray/50 border-netflix-darkgray text-white"
                  />
                </div>
                <Button type="submit" className="w-full bg-netflix-red hover:bg-netflix-red/90" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-netflix-darkgray"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-netflix-black px-2 text-netflix-lightgray">or continue with</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="border-netflix-darkgray text-netflix-lightgray hover:bg-netflix-darkgray">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-netflix-darkgray text-netflix-lightgray hover:bg-netflix-darkgray">
                    <Mail className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" className="border-netflix-darkgray text-netflix-lightgray hover:bg-netflix-darkgray">
                    <Github className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
