"use client";

import { Suspense } from "react";
import DocumentChatPage from "@/components/document/chat/DocumentChatPage";

interface Props {
  params: { id: string };
}

export default function DocumentChatRoute({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <DocumentChatPage documentId={params.id} />
    </Suspense>
  );
}
