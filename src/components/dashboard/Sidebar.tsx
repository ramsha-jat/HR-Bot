import { FaRegChartBar, FaUpload, FaSignOutAlt, FaUserTie, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import hrLogo from "@/assets/hr.jpg";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="w-72 bg-gradient-to-br from-blue-700/80 via-indigo-700/80 to-blue-500/80 text-white flex flex-col justify-between min-h-screen p-8 shadow-2xl border-r border-blue-200/30 backdrop-blur-xl font-sans">
      <div>
        <img src={hrLogo} alt="Ask AI Logo" className="w-20 h-20 rounded-2xl mx-auto mb-6 shadow-xl border-4 border-white/60" />
        <h2 className="text-3xl font-extrabold mb-12 tracking-tight text-center drop-shadow-lg">Ask AI</h2>
        <nav className="space-y-6">
          <div className="text-xs uppercase tracking-wider text-blue-200/80 mb-2">Main</div>
          <button className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-white/10 hover:text-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={() => navigate("/admin/dashboard")}> <FaRegChartBar /> Dashboard </button>
          <button className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-white/10 hover:text-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={() => navigate("/document-analysis")}> <FaUpload /> Document Analysis </button>
          <button className="flex items-center gap-3 w-full py-2 px-3 rounded-lg border border-blue-400/60 bg-white/10 font-semibold mt-2 hover:bg-white/20 hover:text-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={() => navigate("/admin/users")}> <FaUserTie /> Manage Users </button>
          <button className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-white/10 hover:text-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={() => navigate("/assistant")}> <FaComments /> AI Assistant </button>
          <button className="flex items-center gap-3 w-full py-2 px-3 rounded-lg border border-blue-400/60 bg-white/10 font-semibold mt-2 hover:bg-white/20 hover:text-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={() => navigate("/hr-assistant")}> <FaUserTie /> Ask AI </button>
          <div className="text-xs uppercase tracking-wider text-blue-200/80 mt-10 mb-2">Other</div>
          <button className="flex items-center gap-3 w-full py-2 px-3 rounded-lg hover:bg-white/10 hover:text-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={handleLogout}> <FaSignOutAlt /> Logout </button>
        </nav>
      </div>
      <div className="text-blue-200/80 text-xs mt-10 font-mono tracking-tight text-center opacity-80">
        Ask AI v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
