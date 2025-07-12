import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FaUpload, FaComments } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "@/lib/axios"; 
import InitializeVectorStore from "../InitializeVectorStore";


interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface UserData {
  id: string;
  [key: string]: any; // Allow any other fields from Firestore
}

const AdminDashboardContent = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [queryCount, setQueryCount] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchUsersAndStats = async () => {
      try {
        // Get only active users (where role exists)
        const usersQuery = query(collection(db, "users"), where("role", "!=", null));
        const usersSnapshot = await getDocs(usersQuery);
        
        // Log the raw data for debugging
        const rawUsers = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserData[];
        
        console.log("Raw users data:", rawUsers);

        const usersList: User[] = rawUsers
          .filter(user => user.role && user.email && user.fullName) // Only include complete user records
          .map(user => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
          }));

        console.log("Filtered users list:", usersList);
        console.log("Total users count:", usersList.length);

        setUsers(usersList);
        setTotalUsers(usersList.length);

        const statsResponse = await API.get("/stats");
        setDocCount(statsResponse.data.document_count || 0);
        setQueryCount(statsResponse.data.assistant_queries || 0);
        setAnalysisCount(statsResponse.data.document_analysis || 0);
      } catch (error) {
        console.error("Error fetching users or stats:", error);
      }
    };

    fetchUsersAndStats();
  }, []);

  // Filtered Users for Search
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <InitializeVectorStore />
  
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Welcome Admin</h2>
        <p className="text-gray-600 mb-4">
          Manage users, analyze stats, and control Ask AI system.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
          <p className="text-4xl font-bold">{totalUsers}</p>
          <p className="text-gray-500 text-sm mt-2">Users in System</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Documents in Database</h3>
          <p className="text-4xl font-bold">{docCount}</p>
          <p className="text-sm text-gray-500 mt-2">Total documents in FAISS</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">AI Assistant Queries</h3>
          <p className="text-4xl font-bold">{queryCount}</p>
          <p className="text-sm text-gray-500 mt-2">Times AI Assistant was used</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Document Analysis</h3>
          <p className="text-4xl font-bold">{analysisCount}</p>
          <p className="text-sm text-gray-500 mt-2">Documents analyzed</p>
        </div>
      </div>

      {/* Other Admin Actions */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Document Analysis</h4>
            <p className="text-gray-500 text-sm">Upload and review documents.</p>
          </div>
          <Link to="/document-analysis" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaUpload /> Start
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Ask AI</h4>
            <p className="text-gray-500 text-sm">Chat with Ask AI policies and employee queries.</p>
          </div>
          <Link to="/hr-assistant" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaComments />Ask AI
          </Link>
        </div>
      </div>

      {/* Registered Users */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Registered Users</h3>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboardContent;
