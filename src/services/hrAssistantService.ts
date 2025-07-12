const API_BASE = "http://localhost:8000/assistant"; // Use /assistant prefix for all endpoints

// THREADS
export async function getThreads() {
  const res = await fetch(`${API_BASE}/threads`);
  return res.json();
}

export async function createThread(name: string) {
  const res = await fetch(`${API_BASE}/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function deleteThread(threadId: string) {
  const res = await fetch(`${API_BASE}/threads/${threadId}`, { method: "DELETE" });
  return res.json();
}

// FILE UPLOAD
export async function uploadFile(threadId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/threads/${threadId}/files`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Upload failed:", errorText);
    throw new Error("File upload failed");
  }

  return res.json();
}

// MESSAGES
export async function getMessages(threadId: string) {
  const res = await fetch(`${API_BASE}/threads/${threadId}/messages`);
  return res.json();
}

export async function sendMessage(threadId: string, message: string) {
  const res = await fetch(`${API_BASE}/threads/${threadId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
} 