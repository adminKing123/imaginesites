"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { DEFAULT_AUTH_REDIRECT } from "@/lib/auth/routes";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { AuthWelcome } from "./auth-welcome";
import { ContinueWithoutAccountButton } from "./continue-without-account-button";
import { GoogleSignInButton } from "./google-sign-in-button";

export function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingSession, setCheckingSession] = useState(true);

  const redirectTo = searchParams.get("redirect") || DEFAULT_AUTH_REDIRECT;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (user) => {
      if (user) {
        router.replace(redirectTo);
        return;
      }

      setCheckingSession(false);
    });

    return unsubscribe;
  }, [redirectTo, router]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    router.replace(redirectTo);
  };

  if (checkingSession) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center text-center">
      <AuthWelcome />

      <p className="mt-16 text-sm text-muted">
        Sign in or create an account to get started.
      </p>

      <div className="mt-6 flex w-full flex-col gap-3">
        <GoogleSignInButton onSignIn={handleGoogleSignIn} />
        <ContinueWithoutAccountButton href={redirectTo} />
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        By continuing, you agree to our terms and privacy policy.
      </p>
    </div>
  );
}
