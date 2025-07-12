import { useEffect, useState } from "react";
import { FaUpload, FaComments,  FaSync } from "react-icons/fa";
import { Link } from "react-router-dom";
import API from "@/lib/axios";

const UserDashboardContent = () => {
  const [queryCount, setQueryCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      console.log("Fetching stats...");
      const response = await API.get("/stats");
      console.log("Stats response:", response.data);
      
      // Ensure we're getting numbers
      const stats = {
        document_count: Number(response.data.document_count) || 0,
        chunk_count: Number(response.data.chunk_count) || 0,
        assistant_queries: Number(response.data.assistant_queries) || 0,
        post_count: Number(response.data.post_count) || 0,
        document_analysis: Number(response.data.document_analysis) || 0
      };
      
      console.log("Processed stats:", stats);
      
      setDocCount(stats.document_count);
      setQueryCount(stats.assistant_queries);
      setPostCount(stats.post_count);
      setAnalysisCount(stats.document_analysis);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to fetch stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initializeVectorstore = async () => {
    try {
      console.log("Initializing vectorstore...");
      const response = await API.post("/chat/initialize");
      console.log("Vectorstore initialization response:", response.data);
    } catch (error) {
      console.error("Failed to initialize vectorstore:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await initializeVectorstore();
      await fetchStats();
    };
    initialize();

    // Refresh stats every 10 seconds instead of 30
    const intervalId = setInterval(fetchStats, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchStats();
  };

  // Debug render
  console.log("Current stats state:", {
    docCount,
    queryCount,
    postCount,
    analysisCount,
    loading,
    error
  });

  return (
    <div className="space-y-6">
      {/* ✅ Welcome message */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Welcome to Ask AI</h2>
        <p className="text-gray-600">Your assistant for HR policies, employee queries, and document insights.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow relative">
          <button 
            onClick={handleRefresh}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            title="Refresh stats"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
          </button>
          <h3 className="text-lg font-semibold mb-2">Documents in Database</h3>
          <p className="text-4xl font-bold">{loading ? "..." : docCount}</p>
          <p className="text-sm text-gray-500 mt-2">Total documents in FAISS</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">AI Assistant Queries</h3>
          <p className="text-4xl font-bold">{loading ? "..." : queryCount}</p>
          <p className="text-sm text-gray-500 mt-2">Times AI Assistant was used</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Document Analysis</h3>
          <p className="text-4xl font-bold">{loading ? "..." : analysisCount}</p>
          <p className="text-sm text-gray-500 mt-2">Documents analyzed</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={handleRefresh}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      )}

      {/* Feature cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Analyze Docs</h4>
            <p className="text-gray-500 text-sm">Upload and summarize your defense documents.</p>
          </div>
          <Link to="/document-analysis" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaUpload /> Start
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Ask AI</h4>
            <p className="text-gray-500 text-sm">Get instant answers to HR policy questions and employee support.</p>
          </div>
          <Link to="/hr-assistant" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaComments /> Ask HR
          </Link>
        </div>
      </div>

      {/* ➕ New card for Upload Docs */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold mb-2">Upload Docs</h4>
            <p className="text-gray-500 text-sm">Add new documents to your knowledge base.</p>
          </div>
          <Link to="/upload" className="mt-4 text-blue-600 flex items-center gap-2 hover:underline">
            <FaUpload /> Upload
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardContent;
