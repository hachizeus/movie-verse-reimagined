
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-netflix-black border-t border-netflix-darkgray pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-netflix-gray hover:text-white transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-netflix-gray hover:text-white transition-colors">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-netflix-gray hover:text-white transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-netflix-gray hover:text-white transition-colors">
            <Youtube className="h-6 w-6" />
          </a>
        </div>
        
        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div>
            <h4 className="text-netflix-lightgray font-medium mb-4">MovieVerse</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-netflix-lightgray font-medium mb-4">Help</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-netflix-lightgray font-medium mb-4">Account</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">My Account</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Plans & Pricing</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Redeem Code</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-netflix-lightgray font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Cookies</a></li>
              <li><a href="#" className="text-netflix-gray hover:text-white transition-colors">Corporate Information</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="text-center text-netflix-gray text-sm">
          <p>© 2025 MovieVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
