import { useState } from "react";
import API from "@/lib/axios";

interface Post {
  id?: string;
  title?: string;
  content: string;
  timestamp: string;
  url?: string;
  author?: string;
  subreddit?: string;
}

const ExternalContentUpload = () => {
  const [redditLink, setRedditLink] = useState("");
  const [telegramLink, setTelegramLink] = useState("");
  const [redditPosts, setRedditPosts] = useState<Post[]>([]);
  const [telegramPosts, setTelegramPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingReddit, setUploadingReddit] = useState(false);
  const [uploadingTelegram, setUploadingTelegram] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const fetchContent = async (link: string, source: "reddit" | "telegram") => {
    if (!link.trim()) {
      setError(`Please paste a ${source} link!`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStatus(`Fetching ${source} content...`);
      console.log(`Fetching ${source} content from:`, link);
      
      const response = await API.post("content/fetch-and-update", { link });
      console.log(`${source} response:`, response.data);

      if (response.data && response.data.status === "success") {
        if (response.data.details && response.data.details.total_posts > 0) {
          const postsResponse = await API.get(`content/posts?source=${source}&link=${encodeURIComponent(link)}`);
          console.log(`${source} posts response:`, postsResponse.data);
          
          if (postsResponse.data && Array.isArray(postsResponse.data)) {
            const posts = postsResponse.data.map((post: any) => ({
              id: post.id || "",
              title: post.title || "",
              content: post.content || post.selftext || "",
              timestamp: post.timestamp || "",
              url: post.url || "",
              author: post.author || "[deleted]",
              subreddit: post.subreddit || ""
            }));
            console.log("Processed posts:", posts);
            source === "reddit" ? setRedditPosts(posts) : setTelegramPosts(posts);
            setStatus(response.data.message || `Found ${posts.length} ${source} posts`);
          } else {
            setError(`No ${source} posts found in response`);
            setStatus(null);
            source === "reddit" ? setRedditPosts([]) : setTelegramPosts([]);
          }
        } else {
          setError(response.data.message || `No ${source} content found!`);
          setStatus(null);
          source === "reddit" ? setRedditPosts([]) : setTelegramPosts([]);
        }
      } else {
        setError(`No ${source} content found!`);
        setStatus(null);
        source === "reddit" ? setRedditPosts([]) : setTelegramPosts([]);
      }
    } catch (error: any) {
      console.error(`${source} fetch error:`, error);
      setError(error.response?.data?.detail || `Failed to fetch ${source} content!`);
      setStatus(null);
      source === "reddit" ? setRedditPosts([]) : setTelegramPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateVectorstore = async (posts: Post[], source: "reddit" | "telegram") => {
    if (posts.length === 0) {
      setError(`No ${source} posts to update.`);
      return;
    }

    try {
      source === "reddit" ? setUploadingReddit(true) : setUploadingTelegram(true);
      setStatus(`Updating ${source} content in vectorstore...`);
      const response = await API.post("/update-vectorstore-from-posts", { posts });
      setStatus(response.data.message || `${source} content added to vectorstore! 🎉`);
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.detail || `Error updating ${source} content.`);
      setStatus(null);
    } finally {
      source === "reddit" ? setUploadingReddit(false) : setUploadingTelegram(false);
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 space-y-10">
      <h3 className="text-2xl font-bold">Fetch External Content</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {status && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="status">
          <span className="block sm:inline">{status}</span>
        </div>
      )}

      {/* Reddit Section */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold">Reddit</h4>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Paste Reddit link (e.g., https://reddit.com/r/subreddit)..."
            value={redditLink}
            onChange={(e) => setRedditLink(e.target.value)}
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            onClick={() => fetchContent(redditLink, "reddit")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {/* Debug info */}
        <div className="text-sm text-gray-500">
          Posts found: {redditPosts.length}
        </div>

        {redditPosts.length > 0 && (
          <div className="mt-4 space-y-4">
            {redditPosts.map((post, idx) => (
              <div key={post.id || idx} className="p-4 bg-white rounded shadow">
                {post.title && <h5 className="text-lg font-bold mb-2">{post.title}</h5>}
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  <p>Posted by {post.author || "Unknown"} in r/{post.subreddit}</p>
                  <p>{new Date(post.timestamp).toLocaleString()}</p>
                  {post.url && (
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View on Reddit
                    </a>
                  )}
                </div>
              </div>
            ))}

            <div className="text-center mt-6">
              <button
                onClick={() => updateVectorstore(redditPosts, "reddit")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
                disabled={uploadingReddit}
              >
                {uploadingReddit ? "Updating..." : "Update Reddit Vectorstore"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Telegram Section */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold">Telegram</h4>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Paste Telegram link..."
            value={telegramLink}
            onChange={(e) => setTelegramLink(e.target.value)}
            className="flex-1 border border-gray-300 rounded p-2"
          />
          <button
            onClick={() => fetchContent(telegramLink, "telegram")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>

        {/* Debug info */}
        <div className="text-sm text-gray-500">
          Posts found: {telegramPosts.length}
        </div>

        {telegramPosts.length > 0 && (
          <div className="mt-4 space-y-4">
            {telegramPosts.map((post, idx) => (
              <div key={post.id || idx} className="p-4 bg-white rounded shadow">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  <p>{new Date(post.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}

            <div className="text-center mt-6">
              <button
                onClick={() => updateVectorstore(telegramPosts, "telegram")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:opacity-50"
                disabled={uploadingTelegram}
              >
                {uploadingTelegram ? "Updating..." : "Update Telegram Vectorstore"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalContentUpload;
