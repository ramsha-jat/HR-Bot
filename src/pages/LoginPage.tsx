import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white/80 rounded-2xl shadow-2xl p-8 backdrop-blur-lg">
        <LoginForm />
      </div>
    </div>
  );
}
