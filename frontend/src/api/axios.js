import axios from "axios";

const API = axios.create({
  baseURL: "https://urlshortener-6srv.onrender.com/api",
});

export default API;