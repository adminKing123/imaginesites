import { Suspense } from "react";
import { AuthPageContent } from "@/components/auth";

export default function SignUpPage() {
  return (
    <Suspense
      fallback={<p className="text-sm text-muted">Loading...</p>}
    >
      <AuthPageContent />
    </Suspense>
  );
}
