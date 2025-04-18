
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

// Get the base URL from Vite's import.meta.env
const baseUrl = import.meta.env.BASE_URL || '/';

// Add Content Security Policy headers
const addSecurityHeaders = () => {
  // Only works when deployed - developers can use Helmet or a server middleware
  // This is for demo purposes - showing what would be configured on the server
  console.log("Security headers would be configured on the server with:");
  console.log("- Content-Security-Policy");
  console.log("- Strict-Transport-Security");
  console.log("- X-Content-Type-Options: nosniff");
  console.log("- X-Frame-Options: DENY");
  console.log("- X-XSS-Protection: 1; mode=block");
  console.log("- Referrer-Policy: strict-origin-when-cross-origin");
  console.log("- Permissions-Policy: camera=(), microphone=(), geolocation=()");
};

const App = () => {
  useEffect(() => {
    // Call the function to add security headers
    addSecurityHeaders();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={baseUrl}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
