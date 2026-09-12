"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

type GoogleSignInButtonProps = {
  onSignIn: () => Promise<void>;
  label?: string;
};

export function GoogleSignInButton({
  onSignIn,
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      await onSignIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <FcGoogle className="h-5 w-5 shrink-0" aria-hidden="true" />
        {loading ? "Signing in..." : label}
      </button>

      {error ? (
        <p className="mt-3 text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
