import { Suspense } from "react";
import { AuthPageContent } from "@/components/auth";

export default function SignInPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted">Loading...</p>}
    >
      <AuthPageContent />
    </Suspense>
  );
}
