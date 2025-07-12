import hrLogo from "@/assets/hr.jpg";

const Header = () => {
  return (
    <header className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-200/40 px-10 py-6 flex items-center gap-6 rounded-b-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-300 rounded-t-2xl" />
      <img src={hrLogo} alt="Ask AI Logo" className="w-12 h-12 rounded-2xl shadow border-2 border-blue-200/60 z-10" />
      <h1 className="text-2xl font-extrabold tracking-tight text-blue-900 drop-shadow-sm z-10">Ask AI</h1>
    </header>
  );
};

export default Header;
  