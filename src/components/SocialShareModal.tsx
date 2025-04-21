
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
  
  // Ensure we're using the full URL including the current path
  const shareUrl = window.location.href;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Link has been copied to clipboard",
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
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out this awesome movie!")}`,
      color: "bg-[#1DA1F2] hover:bg-[#0D8ECF]" 
    },
    { 
      name: "WhatsApp", 
      icon: <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 1.94.478 3.818 1.404 5.495L.025 23.651c-.064.264.005.535.19.73.183.197.449.309.724.309.018 0 .035 0 .053-.001l6.235-.305A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.068 0-4.12-.537-5.929-1.553a1 1 0 00-.775-.096l-4.068.2L1.52 16.53a1 1 0 00-.117-.819A9.99 9.99 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>, 
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this movie: ${shareUrl}`)}`,
      color: "bg-[#25D366] hover:bg-[#128C7E]" 
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
      url: `mailto:?subject=${encodeURIComponent("Check out this movie!")}&body=${encodeURIComponent(`I found this amazing movie: ${shareUrl}`)}`,
      color: "bg-[#EA4335] hover:bg-[#D33C2C]" 
    },
  ];
  
  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
    setTimeLeft(30);
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) setTimeLeft(30);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Share This Movie</DialogTitle>
          <DialogDescription>
            Share this movie with your friends and family! 
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
            Copy direct link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShareModal;
