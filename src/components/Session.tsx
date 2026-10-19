"use client";

import { useEffect, useState } from "react";
import { isStorageOk, markSeen, startSession } from "@/lib/store";
import { Banner } from "./ui";

// Mounted once in the layout. Starts the visit clock (first visit, last
// seen, previous visit), notes when you leave, and warns if the browser
// won't let us save.
const markSeenNow = () => markSeen();

export function Session() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    startSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- storage can only be checked in the browser
    setBlocked(!isStorageOk());
    const onHide = () => {
      if (document.visibilityState === "hidden") markSeen();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", markSeenNow);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", markSeenNow);
    };
  }, []);

  if (!blocked) return null;
  return (
    <div className="mb-6">
      <Banner title="This browser isn't saving Kinnect">
        Everything works for this visit, but your friends and posts will be gone when you close the tab. Private
        browsing often causes this.
      </Banner>
    </div>
  );
}
