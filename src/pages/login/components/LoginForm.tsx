import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { login } from "@/services/function";
import { LoginRequest, AuthResponse, ApiResponse } from "@/types/api";
import axios from "axios";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await login(formData);
      
      // Handle both direct AuthResponse and ApiResponse<AuthResponse>
      let authData: AuthResponse;
      
      if ('success' in response && 'data' in response) {
        // It's an ApiResponse<AuthResponse>
        const apiResponse = response as ApiResponse<AuthResponse>;
        if (!apiResponse.success) {
          throw new Error(apiResponse.message || "Login failed");
        }
        authData = apiResponse.data;
      } else {
        // It's a direct AuthResponse
        authData = response as AuthResponse;
      }

      // Check if user is admin
      if (!authData.user.isAdmin) {
        setError("Access denied. Admin privileges required.");
        return;
      }

      // Store token and user info in localStorage
      localStorage.setItem("authToken", authData.token);
      localStorage.setItem("userInfo", JSON.stringify(authData.user));
      
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;

      console.log("Login successful:", authData);
      
      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      
      // Navigate to dashboard
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle different error types
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="admin@phimmoi.com"
          className="w-full h-12 px-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          autoComplete="email"
          required
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="w-full h-12 px-4 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in...</span>
          </div>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
