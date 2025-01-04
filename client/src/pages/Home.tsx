"use client";

import { useState } from "react";
import trpcClient from "../utils/trpc";
import { TRPCClientError } from "@trpc/client";

export function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const getShortUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const cleanUrl = url.endsWith("/") ? url.slice(0, -1) : url;
      const res = await trpcClient.createShortUrl.mutate({ url: cleanUrl });
      const link = window.location.origin + "/" + res;
      setShortUrl(link);
    } catch (error: any) {
      if (error instanceof TRPCClientError) {
        if (
          error.data.code === "BAD_REQUEST" &&
          error.data.path === "createShortUrl"
        ) {
          alert("Invalid URL. Please enter a valid URL.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          URL Shortener
        </h1>
        <form onSubmit={getShortUrl} className="space-y-4">
          <div>
            <input
              type="url"
              placeholder="Enter your URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>
        {shortUrl ? (
          <div className="mt-6 p-4 bg-gray-100 rounded-md relative group">
            <p className="text-sm font-medium text-gray-800 break-all pr-10">
              {shortUrl}
            </p>
            <button
              onClick={copyToClipboard}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-blue-600 hover:bg-blue-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Copy to clipboard"
            >
              <ClipboardIcon className="h-4 w-4" />
            </button>
            {copySuccess && (
              <span className="absolute -top-8 right-0 bg-green-500 text-white text-xs py-1 px-2 rounded">
                Copied!
              </span>
            )}
          </div>
        ) : (
          <div className="mt-6 p-4 bg-gray-100 rounded-md text-center text-gray-500">
            Your shortened URL will appear here
          </div>
        )}
      </div>
    </div>
  );
}
