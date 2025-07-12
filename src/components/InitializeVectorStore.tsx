import { useEffect } from "react";
import API from "@/lib/axios";

const InitializeVectorStore = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await API.post("/chat/initialize");
        console.log("Vectorstore initialized:", response.data.message);
      } catch (error) {
        console.error("Failed to initialize vectorstore:", error);
      }
    };

    initialize();
  }, []);

  return null;
};

export default InitializeVectorStore;
