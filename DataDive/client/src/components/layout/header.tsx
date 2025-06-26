import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  name: string;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();

  const { data: user } = useQuery<{ user: User } | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dreams/usage"] });
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "وداعاً، نراك قريباً!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed w-full top-0 z-40 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <i className="fas fa-moon text-2xl text-indigo-400"></i>
            <span className="text-xl font-bold text-dream-text">محلل الأحلام</span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link 
              href="/" 
              className={`hover:text-indigo-300 transition-colors duration-200 ${
                location === "/" ? "text-indigo-400" : "text-dream-text"
              }`}
            >
              الرئيسية
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-indigo-300 transition-colors duration-200 ${
                location === "/about" ? "text-indigo-400" : "text-dream-text"
              }`}
            >
              عن الموقع
            </Link>
            {user && (
              <Link 
                href="/history" 
                className={`hover:text-indigo-300 transition-colors duration-200 ${
                  location === "/history" ? "text-indigo-400" : "text-dream-text"
                }`}
              >
                <i className="fas fa-history ml-1"></i>
                سجل الأحلام
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-dream-text">مرحباً، {user.user.name}</span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-dream-text hover:text-indigo-300"
                >
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <Link 
                href="/auth"
                className={`hover:text-indigo-300 transition-colors duration-200 ${
                  location === "/auth" ? "text-indigo-400" : "text-dream-text"
                }`}
              >
                تسجيل الدخول
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-dream-text"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="hover:text-indigo-300 transition-colors duration-200 text-dream-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                href="/about" 
                className="hover:text-indigo-300 transition-colors duration-200 text-dream-text"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                عن الموقع
              </Link>
              {user && (
                <Link 
                  href="/history" 
                  className="hover:text-indigo-300 transition-colors duration-200 text-dream-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-history ml-1"></i>
                  سجل الأحلام
                </Link>
              )}
              {user ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-dream-text">مرحباً، {user.user.name}</span>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="text-dream-text hover:text-indigo-300 justify-start p-0"
                  >
                    تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <Link 
                  href="/auth"
                  className="hover:text-indigo-300 transition-colors duration-200 text-dream-text"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
