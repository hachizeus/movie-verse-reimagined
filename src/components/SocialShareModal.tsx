
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Facebook, Twitter, Linkedin, Mail, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SocialShareModal = ({ open, onOpenChange }: SocialShareModalProps) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const { toast } = useToast();
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (open && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [open, timeLeft]);
  
  useEffect(() => {
    if (timeLeft === 0) {
      onOpenChange(false);
      setTimeLeft(30);
    }
  }, [timeLeft, onOpenChange]);
  
  const shareUrl = window.location.origin;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Website link has been copied to clipboard",
      });
    });
  };
  
  const socialLinks = [
    { 
      name: "Facebook", 
      icon: <Facebook className="mr-2 h-4 w-4" />, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "bg-[#1877F2] hover:bg-[#0E5FC0]" 
    },
    { 
      name: "Twitter", 
      icon: <Twitter className="mr-2 h-4 w-4" />, 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out this awesome movie site!")}`,
      color: "bg-[#1DA1F2] hover:bg-[#0D8ECF]" 
    },
    { 
      name: "LinkedIn", 
      icon: <Linkedin className="mr-2 h-4 w-4" />, 
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "bg-[#0A66C2] hover:bg-[#084F97]" 
    },
    { 
      name: "Email", 
      icon: <Mail className="mr-2 h-4 w-4" />, 
      url: `mailto:?subject=${encodeURIComponent("Check out this movie site!")}&body=${encodeURIComponent(`I found this amazing movie site: ${shareUrl}`)}`,
      color: "bg-[#EA4335] hover:bg-[#D33C2C]" 
    },
  ];
  
  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Share Our Website</DialogTitle>
          <DialogDescription>
            Help us grow by sharing with your friends and colleagues! 
            <span className="block mt-2 text-sm text-netflix-red">
              This window will close in {timeLeft} seconds
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 py-4">
          {socialLinks.map((social) => (
            <Button 
              key={social.name}
              className={`w-full ${social.color} text-white justify-start`}
              onClick={() => handleShare(social.url)}
            >
              {social.icon}
              Share on {social.name}
            </Button>
          ))}
          
          <div className="flex items-center">
            <div className="h-px flex-1 bg-gray-700"></div>
            <span className="px-4 text-sm text-gray-400">Or</span>
            <div className="h-px flex-1 bg-gray-700"></div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-start"
            onClick={handleCopyLink}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Copy website link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareModal;
