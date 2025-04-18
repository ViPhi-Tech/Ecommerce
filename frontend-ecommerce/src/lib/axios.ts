import axios from "axios";

export const api = axios.create({
   baseURL: "http://localhost:8000/api/",
   // baseURL: "https://my-ecommerce-mu.vercel.app/",
   headers: {
      "Content-Type": "application/json",
   },
   withCredentials: true,
});
