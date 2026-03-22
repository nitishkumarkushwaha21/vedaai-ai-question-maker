"use client";

import { useState } from "react";
import Image from "next/image";

export default function DashboardHomePage() {
  const [assignmentImageLoaded, setAssignmentImageLoaded] = useState(false);
  const [collaborationImageLoaded, setCollaborationImageLoaded] = useState(false);

  return (
    <section aria-label="Home page" className="py-4 md:py-6">
      <div className="mx-auto flex w-full max-w-[980px] flex-col items-center gap-10 px-2 md:max-w-[1160px] md:px-10 lg:px-16">
        <h2
          className="text-center text-2xl font-semibold uppercase tracking-tight text-black md:text-[36px]"
          style={{ textShadow: "0 2px 14px rgba(0, 0, 0, 0.22)" }}
        >
          YOUR AI-ASSISTED ASSIGNMENT CREATION JOURNEY
        </h2>

        <figure className="journey-image-shell journey-image-frame w-full max-w-[1060px]">
          {!assignmentImageLoaded ? <div className="journey-image-skeleton" aria-hidden="true" /> : null}
          <Image
            src="/image-3.png"
            alt="How VedaAI works - AI-assisted assignment creation journey"
            fill
            sizes="(max-width: 1060px) 100vw, 1060px"
            className={`journey-image-crop journey-image-pulse journey-image-fade ${assignmentImageLoaded ? "is-loaded" : ""}`}
            onLoad={() => setAssignmentImageLoaded(true)}
            onError={() => setAssignmentImageLoaded(true)}
          />
        </figure>

        <div className="h-2 md:h-4" aria-hidden="true" />

        <h2
          className="text-center text-2xl font-semibold uppercase tracking-tight text-black md:text-[36px]"
          style={{ textShadow: "0 2px 14px rgba(0, 0, 0, 0.22)" }}
        >
          YOUR TEACHER COLLABORATION JOURNEY
        </h2>

        <figure className="journey-image-shell journey-image-frame w-full max-w-[1060px]">
          {!collaborationImageLoaded ? <div className="journey-image-skeleton" aria-hidden="true" /> : null}
          <Image
            src="/image-4.png"
            alt="How VedaAI works - teacher collaboration journey"
            fill
            sizes="(max-width: 1060px) 100vw, 1060px"
            className={`journey-image-crop journey-image-pulse journey-image-fade ${collaborationImageLoaded ? "is-loaded" : ""}`}
            onLoad={() => setCollaborationImageLoaded(true)}
            onError={() => setCollaborationImageLoaded(true)}
          />
        </figure>
      </div>
    </section>
  );
}
