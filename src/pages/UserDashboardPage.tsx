import UserSidebar from "@/components/dashboard/UserSidebar";
import Header from "@/components/dashboard/Header";
import DashboardContent from "@/components/dashboard/DashboardContent";

const UserDashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <UserSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <div className="bg-white/80 rounded-2xl shadow-2xl p-6 backdrop-blur-lg">
            <DashboardContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardPage;
