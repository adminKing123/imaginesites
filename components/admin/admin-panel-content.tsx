"use client";

import { useState } from "react";
import { useAuthUser } from "@/lib/auth/use-auth-user";
import { AdminSidebar } from "./admin-sidebar";
import type { AdminSectionId } from "./config";
import { CategoriesPanel } from "./categories-panel";
import { PromptsPanel } from "./prompts-panel";
import { UploadedImagesPanel } from "./uploaded-images-panel";

export function AdminPanelContent() {
  const { user } = useAuthUser();
  const [activeSection, setActiveSection] = useState<AdminSectionId>("uploaded-images");

  if (!user) {
    return null;
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-4.5rem)]">
      <div className="flex min-h-[inherit] flex-col lg:flex-row">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="min-w-0 flex-1">
          {activeSection === "uploaded-images" ? (
            <UploadedImagesPanel user={user} />
          ) : null}
          {activeSection === "categories" ? <CategoriesPanel user={user} /> : null}
          {activeSection === "prompts" ? <PromptsPanel user={user} /> : null}
        </div>
      </div>
    </section>
  );
}
