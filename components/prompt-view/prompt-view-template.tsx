import type { ReactNode } from "react";

type PromptViewTemplateProps = {
  preview: ReactNode;
  gallery: ReactNode;
};

export function PromptViewTemplate({ preview, gallery }: PromptViewTemplateProps) {
  return (
    <>
      <section>{preview}</section>

      {gallery ? <section className="mt-6 sm:mt-8">{gallery}</section> : null}
    </>
  );
}
