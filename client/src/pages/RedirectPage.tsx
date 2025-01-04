import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import trpcClient from "../utils/trpc";
import { TRPCClientError } from "@trpc/client";

const RedirectPage = () => {
  const { url } = useParams(); // Gets the URL param
  const [error, setError] = useState<string | null>(null); // State to track errors

  useEffect(() => {
    async function getOriginalUrl() {
      try {
        if (!url) {
          setError("Invalid short URL");
          return;
        }

        const res = await trpcClient.getOriginalUrl.query(url);
        // Redirect to the original URL
        window.location.href = res;
      } catch (error) {
        // Handle specific errors
        if (error instanceof TRPCClientError) {
          if (error.data?.httpStatus === 500) {
            setError("Invalid short URL");
            return;
          }
        }
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      }
    }

    getOriginalUrl();
  }, [url]);

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Redirecting to original URL...</div>;
};

export default RedirectPage;
