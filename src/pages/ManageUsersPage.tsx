import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, setDoc, deleteDoc, doc, query, where, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

function generatePassword(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const ManageUsersPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user"
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      // Check Firestore for user role
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      if (!userData || userData.role !== "admin") {
        navigate("/user/dashboard");
        return;
      }
      setCheckingRole(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!checkingRole) fetchUsers();
    // eslint-disable-next-line
  }, [checkingRole]);

  const fetchUsers = async () => {
    setLoading(true);
    const usersQuery = query(collection(db, "users"), where("role", "!=", null));
    const usersSnapshot = await getDocs(usersQuery);
    const usersList: User[] = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
    setUsers(usersList);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setForm({ ...form, password: newPassword });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const auth = getAuth();
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      // 2. Add user profile to Firestore with UID as document ID
      await setDoc(doc(db, "users", user.uid), {
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        uid: user.uid
      });
      setForm({ fullName: "", email: "", password: "", role: "user" });
      fetchUsers();
      setSuccess("User registered successfully!");
      console.log("User Registered:", form);
    } catch (err: any) {
      setError(err.message || "Error registering user");
      console.error("Error registering user:", err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(u => u.id !== userId));
      console.log("User deleted:", userId);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (checkingRole) {
    return <div className="flex min-h-screen items-center justify-center text-xl">Checking permissions...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Register New User</h2>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {success && <div className="text-green-600 mb-2">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="text"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <button type="button" onClick={handleGeneratePassword} className="bg-gray-200 px-3 py-2 rounded font-semibold hover:bg-gray-300">Auto Generate</button>
            </div>
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
            >
              Register
            </button>
          </form>
          <hr className="my-6" />
          <h3 className="text-lg font-bold mb-2">Existing Users</h3>
          {loading ? (
            <div>Loading users...</div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{user.fullName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageUsersPage; 