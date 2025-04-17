import { Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "@/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "./AuthModal";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { AdminLogin } from "./AdminLogin";
import logo from '../images/logo.png';

const Navbar = () => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, applyFilters } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    const handleShowAuthModal = () => {
      setAuthModalOpen(true);
    };
    
    window.addEventListener('show-auth-modal', handleShowAuthModal);
    
    return () => {
      window.removeEventListener('show-auth-modal', handleShowAuthModal);
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session && !localStorage.getItem('auth-modal-shown')) {
        setAuthModalOpen(true);
        localStorage.setItem('auth-modal-shown', 'true');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, applyFilters]);

  const handleTabChange = (tab: 'movie' | 'series') => {
    setActiveTab(tab);
    applyFilters();
  };

  const handleLoginClick = () => {
    setAuthModalOpen(true);
  };
  
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-netflix-black shadow-lg' : 'bg-gradient-to-b from-netflix-black/80 to-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-netflix-red font-bold text-2xl"
            onClick={() => setIsAdminModalOpen(true)}
          >
            A
          </Button>
          <Link to="/">
          <img src={logo} alt="WATCHIT" className="h-36 mt-5" />
</Link>
          
          <div className="hidden md:flex space-x-6">
            <button 
              onClick={() => handleTabChange('movie')} 
              className={`text-sm font-medium ${activeTab === 'movie' ? 'text-white' : 'text-netflix-lightgray hover:text-white'}`}
            >
              Movies
            </button>
            <button 
              onClick={() => handleTabChange('series')} 
              className={`text-sm font-medium ${activeTab === 'series' ? 'text-white' : 'text-netflix-lightgray hover:text-white'}`}
            >
              Series
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <div className="relative animate-fade-in">
              <Input
                type="search"
                placeholder="Search titles, people, genres..."
                className="w-[200px] md:w-[300px] bg-netflix-darkgray/50 border-netflix-darkgray text-white"
                value={searchQuery}
                onChange={handleSearch}
                autoFocus
                onBlur={() => searchQuery === "" && setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-netflix-lightgray hover:text-white"
            >
              <Search size={20} />
            </Button>
          )}
          
          {session && <NotificationsDropdown />}
          {session ? (
            <ProfileDropdown />
          ) : (
            <Button 
              variant="ghost"
              size="sm"
              onClick={handleLoginClick}
              className="text-netflix-lightgray hover:text-white"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <AdminLogin open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen} />
    </nav>
  );
};

export default Navbar;
