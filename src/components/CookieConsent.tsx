
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/store';
import { X } from 'lucide-react';

const CookieConsent = () => {
  const { cookieConsent, setCookieConsent } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show the cookie consent if it hasn't been set yet
    if (cookieConsent === null) {
      // Small delay to ensure it appears after page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [cookieConsent]);

  const handleAccept = () => {
    setCookieConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookieConsent(false);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-netflix-black border-t border-netflix-darkgray z-50 p-4 md:p-6 animate-fade-up">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-white mb-2">We use cookies</h3>
            <p className="text-netflix-lightgray text-sm">
              This website uses cookies to ensure you get the best experience on our website. 
              By continuing to use our site, you accept our use of cookies and privacy policy.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              className="border-netflix-gray text-netflix-lightgray hover:bg-netflix-darkgray hover:text-white"
              onClick={handleDecline}
            >
              Decline
            </Button>
            <Button
              className="bg-netflix-red hover:bg-netflix-red/90 text-white"
              onClick={handleAccept}
            >
              Accept All
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-netflix-lightgray hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
