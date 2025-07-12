// components/LogoutButton.tsx
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);           // Firebase logout
      localStorage.clear();          // Clear any local storage/session
      navigate("/login");            // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:underline font-medium"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
