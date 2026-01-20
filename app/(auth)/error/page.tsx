"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let title = "Authentication Error";
  let message = "Something went wrong. Please try again.";

  if (error === "OAuthAccountNotLinked") {
    title = "Different Sign-in Method Used";
    message =
      "You have previously signed in using a different provider.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

        <p className="mt-3 text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/sign-in"
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Go to Sign In
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-500 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
