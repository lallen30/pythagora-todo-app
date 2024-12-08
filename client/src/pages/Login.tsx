import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { LogIn } from "lucide-react";
import { login } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login: authLogin } = useAuth(); // Use the login function from AuthContext

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      console.log("Attempting to login with data:", data);
      const response = await login(data.email, data.password);
      console.log("Login response:", response);

      // Use the authLogin function to update the auth state
      await authLogin(data.email, data.password);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/"); // Redirect to the home page (todo list)
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/register" className="text-primary hover:underline">
              Don't have an account? Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}