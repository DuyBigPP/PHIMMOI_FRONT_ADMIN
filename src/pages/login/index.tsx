import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Shield } from "lucide-react";

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("authToken");
    const userInfo = localStorage.getItem("userInfo");
    
    if (token && userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user.isAdmin) {
          setIsAuthenticated(true);
          navigate("/dashboard");
        }      } catch {
        // Invalid user info, clear storage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
      }
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Don't render anything if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            PHIMSKIBIDI Admin
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Admin Access</span>
            </div>
            <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Please sign in with your admin credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 PHIMSKIBIDI. By ZuyBigPP and DuongStark.
          </p>
        </div>
      </div>
    </div>
  );
}