import FileUploadArea from "@/components/upload/FileUploadArea";
import ExternalContentUpload from "@/components/upload/ExternalContentUpload";

const UploadDocumentsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-2xl p-8 backdrop-blur-lg">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-2 tracking-tight drop-shadow">Upload Documents</h2>
        <p className="text-blue-700 mb-6">
          Upload PDF, DOCX, Image, and Video files for AI analysis.
        </p>

        {/* File Upload Section */}
        <FileUploadArea />

        {/* External Content Section */}
        <div className="mt-10">
          <ExternalContentUpload />
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentsPage;
