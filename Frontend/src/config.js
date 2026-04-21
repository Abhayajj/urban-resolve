const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_URL = isLocal 
  ? "http://localhost:5000/api/v1" 
  : "https://urban-resolve.onrender.com/api/v1";

export default API_URL;
