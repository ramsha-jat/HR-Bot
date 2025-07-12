import { useState } from "react";
import API from "@/lib/axios"; // Your axios setup

const DocumentAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Reset states when new file is selected
      setDocumentId(null);
      setSummary(null);
      setQuestion("");
      setAnswer(null);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await API.post("documents/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Analysis response:", res.data); // Debug log
      
      if (!res.data.document_id) {
        console.error("No document_id in response");
        alert("Error: Document ID not received");
        return;
      }

      setDocumentId(res.data.document_id);
      setSummary(res.data.summary);
    } catch (error: any) {
      console.error("Analysis error:", error);
      alert(error.response?.data?.detail || "Error analyzing document");
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !documentId) return;

    try {
      setChatLoading(true);
      const res = await API.post("documents/chat", {
        question: question.trim(),
        document_id: documentId
      });
      setAnswer(res.data.answer);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.detail || "Error getting answer");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-3xl space-y-8 p-8 bg-white/80 rounded-2xl shadow-2xl backdrop-blur-lg">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow">Document Analysis</h2>
        <p className="text-blue-700 mb-6">Upload a document to analyze and chat with it!</p>
        <div className="flex flex-col space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
          />
          <button
            onClick={handleUploadAndAnalyze}
            disabled={!file || loading}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow disabled:bg-gray-400"
          >
            {loading ? "Analyzing..." : "Analyze Document"}
          </button>
        </div>
        {summary && (
          <div className="bg-white rounded-xl shadow p-6 mt-6 border border-blue-100">
            <h3 className="text-xl font-bold mb-2">Summary:</h3>
            <div
              className="text-gray-700 space-y-2"
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          </div>
        )}
        {documentId && (
          <div className="bg-white rounded-xl shadow p-6 mt-6 border border-blue-100">
            <h3 className="text-xl font-bold mb-4">Chat with Document</h3>
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about the document..."
                  className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  disabled={!question.trim() || chatLoading}
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow disabled:bg-gray-400"
                >
                  {chatLoading ? "Thinking..." : "Ask"}
                </button>
              </div>
            </form>
            {answer && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Answer:</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysis;
