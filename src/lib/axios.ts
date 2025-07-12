import axios from "axios";

const API = axios.create({
  baseURL: "http://askai.twilightparadox.com", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
