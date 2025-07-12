import { useState } from "react";
import API from "@/lib/axios";

const FileUploadArea = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supportedExtensions = ['pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'pptx'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return supportedExtensions.includes(ext || '');
      });
      if (newFiles.length < e.target.files.length) {
        setError('Some files were ignored due to unsupported file types.');
      }
      setFiles([...files, ...newFiles]);
      setSuccess(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return supportedExtensions.includes(ext || '');
      });
      if (newFiles.length < e.dataTransfer.files.length) {
        setError('Some files were ignored due to unsupported file types.');
      }
      setFiles([...files, ...newFiles]);
      setSuccess(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setError(null);
    setSuccess(null);
  };

  const handleUpdateVectorstore = async () => {
    if (files.length === 0) {
      setError("Please upload at least one file!");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload each file individually
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));
      const uploadResponse = await API.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Uploaded files:", uploadResponse.data);

      // Initialize vectorstore
      const updateResponse = await API.post("/chat/initialize");
      setSuccess(updateResponse.data.message || "Vectorstore updated successfully!");
      setFiles([]);
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      setError(error.response?.data?.detail || "Error updating vectorstore!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 cursor-pointer"
      >
        <svg
          className="w-12 h-12 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4-4m0 0l-4 4m4-4v12"
          />
        </svg>
        <p className="mb-2 font-semibold">Drag & Drop Files</p>
        <p className="text-sm text-center">
          Supported files: PDF, DOCX, TXT, JPG, JPEG, PNG, PPTX
        </p>

        <label className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer">
          Select Files
          <input
            type="file"
            multiple
            hidden
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.pptx"
          />
        </label>

        {files.length > 0 && (
          <div className="mt-6 w-full">
            <h4 className="font-semibold mb-2">Selected Files:</h4>
            <ul className="list-disc list-inside text-left text-sm mb-4">
              {files.map((file, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(idx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <button
                onClick={handleUpdateVectorstore}
                disabled={uploading}
                className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg font-semibold ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? "Updating..." : "Update Vectorstore"}
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
    </div>
  );
};

export default FileUploadArea;