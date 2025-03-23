import { useState, useEffect } from "react";
import axios from "axios";

export const request = axios.create({
   // baseURL: "https://my-ecommerce-mu.vercel.app/",
   headers: { "Content-Type": "application/json" },
   baseURL: "http://localhost:8000/",
   withCredentials: true,
});

type Method = "get" | "post" | "put" | "delete";

const useAxios = ({
   url,
   method,
   body = null,
   headers = null,
}: {
   url: string;
   method: Method;
   body?: any;
   headers?: any;
}) => {
   const [response, setResponse] = useState(null);
   const [error, setError] = useState("");
   const [loading, setloading] = useState(true);

   const fetchData = async () => {
      await request[method](url, JSON.parse(headers), JSON.parse(body))
         .then(res => {
            setResponse(res.data);
         })
         .catch(err => {
            setError(err);
         })
         .finally(() => {
            setloading(false);
         });
   };

   return { response, error, loading, fetch: fetchData };
};

export default useAxios;
