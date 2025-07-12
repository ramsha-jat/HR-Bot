import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FaSignInAlt} from "react-icons/fa";
import { login, resetPassword } from "@/services/authService";
import hrLogo from "@/assets/hr.jpg";
// ... (imports remain the same)

// ... (imports remain the same)

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Disabled Microsoft login temporarily
  /*
  const handleMicrosoftSignIn = () => {
    const clientId = "4ea3810a-d417-4937-94ad-57c020c2469b"; // replace with your real client ID
    const redirectUri = "http://localhost:5173/auth/microsoft/callback";
    const scope = "openid profile email";

    const authUrl =
      `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
      `client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_mode=query&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };
  */

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first!");
      return;
    }
    try {
      await resetPassword(email);
      alert("Password reset email sent!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div className="flex flex-col items-center mb-6">
        <img src={hrLogo} alt="Ask AI Logo" className="w-16 h-16 rounded-full shadow-lg border-4 border-white mb-2" />
        <h1 className="text-2xl font-bold text-center">Ask AI</h1>
        <p className="text-center text-gray-500 mt-2">Welcome back! Log in to your account.</p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Button variant="primary" className="flex items-center gap-2" disabled>
          <FaSignInAlt /> Login
        </Button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
